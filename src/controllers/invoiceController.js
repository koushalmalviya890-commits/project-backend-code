const Booking = require("../models/Booking");
const Startup = require("../models/Startup");
const Facility = require("../models/Facility");
const ServiceProvider = require("../models/ServiceProvider");

const { sendInvoiceEmail } = require("../../services/invoiceEmailService");
const { generateAndStoreInvoice } = require("../../services/invoiceService");

async function generateInvoice(req, res) {
  try {
    const bookingId = req.params.bookingId;

    const result = await generateAndStoreInvoice(bookingId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Invoice generation failed" });
  }
}

async function sendInvoiceByEmail(req, res) {
  try {
    const { bookingId, forceSend } = req.body;

    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "bookingId required" });
    }

    const booking = await Booking.findById(bookingId).lean();

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Auth check
    const userId = req.user?.id;

    if (
      booking.startupId.toString() !== userId &&
      booking.incubatorId.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Ensure invoice exists
    // if (!booking.invoiceUrl) {
    //   const result = await generateAndStoreInvoice(bookingId);
    //   if (!result.success) {
    //     return res.status(400).json(result);
    //   }
    // }

    let invoiceUrl = booking.invoiceUrl;

    if (!invoiceUrl) {
      const result = await generateAndStoreInvoice(bookingId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      invoiceUrl = result.invoiceUrl; // IMPORTANT
    }

    const startup =
      (await Startup.findOne({ userId: booking.startupId }).lean()) ||
      (await Startup.findById(booking.startupId).lean());

    const facility = await Facility.findById(booking.facilityId).lean();

    if (!startup || !facility) {
      return res
        .status(500)
        .json({ success: false, message: "Startup/Facility missing" });
    }

    // Prevent spam (5 mins)
    if (!forceSend && booking.invoiceEmailHistory?.length > 0) {
      const last =
        booking.invoiceEmailHistory[booking.invoiceEmailHistory.length - 1];
      const lastTime = new Date(last.sentAt).getTime();
      const now = Date.now();

      if ((now - lastTime) / (1000 * 60) < 5) {
        return res.status(200).json({
          success: true,
          message: "Email already sent recently",
        });
      }
    }

    const recipientEmail = startup.startupMailId || startup.email;

    if (!recipientEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Startup email missing" });
    }

    const bookingDates = `${new Date(booking.startDate).toLocaleDateString()} – ${new Date(
      booking.endDate,
    ).toLocaleDateString()}`;

    const facilityLocation = `${facility.city || ""}, ${facility.state || ""}`;

    const paidAmount = Number(booking.finalAmount ?? booking.amount ?? 0);

    const emailResult = await sendInvoiceEmail({
      recipientEmail,
      startupName: startup.startupName,
      facilityName: facility.details?.name,
      facilityLocation,
      bookingDates,
      bookingId: booking._id.toString(),
      amount: paidAmount,
      invoiceUrl: booking.invoiceUrl,
    });

    await Booking.updateOne(
      { _id: bookingId },
      {
        $push: {
          invoiceEmailHistory: {
            sentTo: recipientEmail,
            sentAt: new Date(),
            sentBy: userId,
            status: emailResult.success ? "sent" : "failed",
            error: emailResult.success ? null : emailResult.error?.message,
          },
        },
      },
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Email failed",
        error: emailResult.error?.message,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Invoice email sent" });
  } catch (err) {
    console.error("sendInvoiceByEmail error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send invoice email" });
  }
}

module.exports = {
  generateInvoice,
  sendInvoiceByEmail,
};
