const axios = require("axios");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../utils/s3Client");

const Booking = require("../src/models/Booking");
const Facility = require("../src/models/Facility");
const Startup = require("../src/models/Startup");
const ServiceProvider = require("../src/models/ServiceProvider");

const { generateProfessionalInvoiceHTML } = require("./invoiceHtmlTemplates");
const { sendInvoiceEmail } = require("./invoiceEmailService");

async function generateAndStoreInvoice(bookingId) {
  try {
    const booking = await Booking.findById(bookingId).lean();

    if (!booking) {
      return { success: false, message: "Booking not found" };
    }

    // Already generated invoice
    if (booking.invoiceUrl) {
      return {
        success: true,
        invoiceUrl: booking.invoiceUrl,
        alreadyExists: true,
      };
    }

    const facility = await Facility.findById(booking.facilityId).lean();

    let startup =
      (await Startup.findOne({ userId: booking.startupId }).lean()) ||
      (await Startup.findById(booking.startupId).lean());

    const serviceProvider = await ServiceProvider.findOne({
      $or: [{ userId: booking.incubatorId }, { _id: booking.incubatorId }],
    }).lean();

    if (!facility || !startup) {
      return { success: false, message: "Facility or Startup not found" };
    }

    const invoiceNumber = `INV-${bookingId.toString().substring(0, 8)}-${Date.now()
      .toString()
      .substring(9, 13)}`;

    const invoiceHTML = generateProfessionalInvoiceHTML({
      booking,
      facility,
      startup,
      serviceProvider,
      invoiceNumber,
      invoiceDate: new Date(),
    });

    const accessKey = "ed1d01b7e7626fc1cdf1cc04f0f61075";
    if (!accessKey) {
      return { success: false, message: "PDFLAYER_ACCESS_KEY missing" };
    }

    const pdfResponse = await axios.post(
      `http://api.pdflayer.com/api/convert?access_key=${accessKey}`,
      new URLSearchParams({
        document_html: invoiceHTML,
        document_name: "invoice.pdf",
        page_size: "A4",
        test: "1",
      }).toString(),
      {
        responseType: "arraybuffer",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    const pdfBuffer = Buffer.from(pdfResponse.data);

    // Upload to S3
    const bucketName = process.env.AWS_BUCKET_NAME || "cumma-images";
    const region = process.env.AWS_REGION || "eu-north-1";

    const s3Key = `invoices/${bookingId}/${invoiceNumber}.pdf`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
        ContentDisposition: `attachment; filename="${invoiceNumber}.pdf"`,
      }),
    );

    const invoiceUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;

    // Save invoiceUrl in booking
    await Booking.updateOne(
      { _id: bookingId },
      {
        $set: {
          invoiceUrl,
          invoiceGeneratedAt: new Date(),
        },
      },
    );

    // Send invoice email automatically
    const recipientEmail = startup.startupMailId || startup.email;

    if (recipientEmail) {
      const formattedStartDate = new Date(
        booking.startDate,
      ).toLocaleDateString();
      const formattedEndDate = new Date(booking.endDate).toLocaleDateString();
      const bookingDates = `${formattedStartDate} – ${formattedEndDate}`;

      const facilityLocation = `${facility.city || ""}, ${facility.state || ""}`;

      const paidAmount = Number(booking.finalAmount ?? booking.amount ?? 0);

      const emailResult = await sendInvoiceEmail({
        recipientEmail,
        startupName: startup.startupName,
        facilityName: facility.details?.name,
        facilityLocation,
        bookingDates,
        bookingId: bookingId.toString(),
        amount: paidAmount,
        invoiceUrl,
      });

      await Booking.updateOne(
        { _id: bookingId },
        {
          $push: {
            invoiceEmailHistory: {
              sentTo: recipientEmail,
              sentAt: new Date(),
              sentBy: "system",
              status: emailResult.success ? "sent" : "failed",
              error: emailResult.success ? null : emailResult.error?.message,
            },
          },
        },
      );
    }

    return { success: true, invoiceUrl };
  } catch (error) {
    console.error("Invoice generation error:", error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  generateAndStoreInvoice,
};
