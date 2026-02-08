const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const User = require("../models/User");

const resend = new Resend(process.env.RESEND_API_KEY);

// Zoho SMTP
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: "smtppro.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendInvoiceEmail = async (
  recipientEmail,
  startupName,
  facilityName,
  facilityLocation,
  bookingDates,
  facilityType,
  bookingId,
  amount,
  invoiceUrl
) => {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: `"Cumma" <${process.env.EMAIL_FROM}>`,
    to: recipientEmail,
    subject: "Congratulations, Your Booking through Cumma is Confirmed",
    html: `
      <<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Brand Logo -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="cid:emailLogo" alt="Cumma Logo" style="height: 60px;" />
  </div>
 
  <!-- Greeting -->
  <p style="font-size: 16px; color: #333;">Hi ${startupName || 'there'},</p>
 
  <!-- Confirmation Text -->
  <p style="font-size: 16px; color: #333; line-height: 1.6;">
    Your booking for <strong>${facilityName || 'N/A'}</strong> on <strong>${bookingDates}</strong> is confirmed.
  </p>
 
  <!-- Location Info -->
  <p style="font-size: 16px; color: #333; line-height: 1.6;">
    <strong>Location:</strong><br />
    ${facilityLocation}
  </p>
 
  <!-- Value Message -->
  <p style="font-size: 16px; color: #333; line-height: 1.6;">
    You’ve just unlocked access to a facility designed to help you create, collaborate, and grow.
    From focused work to big ideas, we’re glad to be part of your journey.
  </p>
 
  <!-- Note for Arrival -->
  <p style="font-size: 16px; color: #333;">
    When you arrive, please show your booking invoice for access to the space (if asked).
  </p>
 
  <!-- Invoice Section -->
  <div style="text-align: center; margin: 30px 0;">
    <a href="${invoiceUrl}" style="
      background-color: #4F46E5;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      display: inline-block;
    ">
      📥 View Invoice
    </a>
  </div>
 
  <!-- Join Cumma Family Section -->
  <div style="margin: 40px 0; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9ff;">
    <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 15px 0;">
      🔑 To access your booking details online and become part of the Cumma family, please set up your account.
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="https://www.cumma.in/affiliateUser/signIn" style="
        background-color: #22c55e;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 500;
        display: inline-block;
      ">
        Join Cumma Family & Create Password
      </a>
    </div>
    <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0;">
      ⚠️ <strong>Note:</strong> If you try to log in without creating your password first, you may see this error:
      <br />
      <em>"Account setup incomplete. Please create your password using the link sent to your email."</em>
    </p>
  </div>
 
  <!-- Sustainability Line -->
  <p style="font-style: italic; color: #4F46E5; text-align: center;">
    And hey champion, you save at least 3 papers every time you access through Cumma!
  </p>
 
  <!-- Footer -->
  <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
    <p style="color: #333; font-size: 16px; margin: 0 0 10px 0;">
      We’re excited to support your next move. Have a good day!
    </p>
    <p style="color: #666; font-size: 14px;">
      Warm regards,<br />
      Team Cumma<br />
    </p>
  </div>
</div>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: "./public/logo.png",
        cid: "emailLogo",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

exports.sendInvoiceEmailEndpoint = async (req, res) => {
  try {
    const { bookingId, automated, recipientEmail: automatedRecipient, forceSend } = req.body;

    const automationSecret = req.headers["x-invoice-automation"];
    const isAutomatedRequest =
      automationSecret === process.env.EMAIL_WEBHOOK_SECRET &&
      automated === true;

    const db = mongoose.connection.db;

    // 🔐 Auth check for manual requests
    let userId = null;

    if (!isAutomatedRequest) {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      userId = req.user.id;
    }

    if (!bookingId) {
      return res.status(400).json({ error: "Missing booking ID" });
    }

    const booking = await db.collection("bookings").findOne({
      _id: new mongoose.Types.ObjectId(bookingId),
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 🔐 Authorization
    if (!isAutomatedRequest && userId) {
      if (
        booking.startupId.toString() !== userId &&
        booking.incubatorId.toString() !== userId
      ) {
        return res.status(403).json({
          error: "Not authorized to access this booking",
        });
      }
    }

    if (!booking.invoiceUrl) {
      return res.status(400).json({
        error: "Invoice not available for this booking",
      });
    }

    //  Duplicate prevention (5 minutes)
    if (booking.invoiceEmailHistory?.length && !forceSend) {
      const recentEmails = booking.invoiceEmailHistory
        .filter((history) => {
          if (isAutomatedRequest && automatedRecipient) {
            return history.sentTo === automatedRecipient;
          } else if (userId && booking.startupId.toString() === userId) {
            return history.sentTo === booking.affiliateUserEmail;
          }
          return false;
        })
        .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

      if (recentEmails.length > 0) {
        const lastSentTime = new Date(recentEmails[0].sentAt).getTime();
        const minutesSince =
          (Date.now() - lastSentTime) / (1000 * 60);

        if (minutesSince < 5) {
          return res.json({
            success: true,
            message: "Email was sent recently, skipping duplicate send",
            minutesSinceLastEmail: Math.floor(minutesSince),
          });
        }
      }
    }

    // 🔎 Fetch related data
    const [startup, facility] = await Promise.all([
      User.findOne({ email: booking.affiliateUserEmail }),
      db.collection("Facilities").findOne({ _id: booking.facilityId }),
    ]);

    if (!startup || !facility) {
      return res.status(500).json({
        error: "Failed to find related data",
      });
    }

    let recipientEmail = "";

    if (isAutomatedRequest && automatedRecipient) {
      recipientEmail = automatedRecipient;
    } else if (booking.startupId.toString() === userId) {
      recipientEmail = startup.email;
    } else {
      const serviceProvider = await db.collection("Service Provider").findOne({
        userId: booking.incubatorId,
      });
      recipientEmail = serviceProvider?.primaryEmailId || "";
    }

    if (!recipientEmail) {
      return res.status(400).json({
        error: "Recipient email not found",
      });
    }

    const formattedStartDate = new Date(booking.startDate).toLocaleDateString();
    const formattedEndDate = new Date(booking.endDate).toLocaleDateString();
    const bookingDates = `${formattedStartDate} – ${formattedEndDate}`;
    const facilityLocation = `${facility.city || ""}, ${facility.state || ""}`;

    let emailSent = false;
    let emailError = null;

    try {
      await sendInvoiceEmail(
        recipientEmail,
        startup.name || "there",
        facility.details?.name || "N/A",
        facilityLocation,
        bookingDates,
        facility.facilityType || "N/A",
        booking._id.toString(),
        booking.amount,
        booking.invoiceUrl
      );

      emailSent = true;

    } catch (zohoError) {
      emailError = zohoError;

      try {
        await resend.emails.send({
          from: `Cumma <${process.env.EMAIL_FROM}>`,
          to: recipientEmail,
          subject:
            "Congratulations - Your Facility Booking is Confirmed – Here's Your Invoice from Cumma",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.5;">
              <p>Hi ${startup.name || 'there'},</p>
              <p>Thank you for booking through Cumma! 🎉<br>
              We're excited to support your startup journey by connecting you with the right space and infrastructure.</p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Here are your booking details:</h3>
                <p><strong>Facility Name:</strong> ${facility.details?.name || 'N/A'}</p>
                <p><strong>Location:</strong> ${facilityLocation}</p>
                <p><strong>Booking Date(s):</strong> ${bookingDates}</p>
                <p><strong>Facility Type:</strong> ${facility.facilityType || 'N/A'}</p>
                <p><strong>Booking ID:</strong> #${booking._id.toString()}</p>
                <p><strong>Payment Made:</strong> ₹${booking.amount.toLocaleString()}</p>
              </div>
              <p>Your invoice is attached to this email for your reference.</p>
              <p style="margin: 20px 0;">
                <a href="${booking.invoiceUrl}" style="background-color: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  View Invoice
                </a>
              </p>
              <p>If you have any questions or need help with your booking, reply to this email or contact us at support@cumma.in.</p>
              <p>Thanks for choosing Cumma —<br>
              Let's build, together.</p>
              <p>Warm regards,<br>
              Team Cumma<br>
              <a href="https://www.cumma.in/affiliateUser/signIn">www.cumma.in</a></p>
            </div>
          `,
        });

        emailSent = true;

      } catch (resendError) {
        emailError = resendError;
      }
    }

    // 🗂 Save email history
    await db.collection("bookings").updateOne(
      { _id: new mongoose.Types.ObjectId(bookingId) },
      {
        $push: {
          invoiceEmailHistory: {
            sentTo: recipientEmail,
            sentAt: new Date(),
            sentBy: isAutomatedRequest ? "system" : userId || "unknown",
            status: emailSent ? "sent" : "failed",
            error: emailSent ? null : emailError?.message,
          },
        },
      }
    );

    if (emailSent) {
      return res.json({
        success: true,
        message: "Invoice email sent successfully",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to send invoice email via both Zoho and Resend",
      details: emailError?.message || "Unknown error",
    });

  } catch (error) {
    console.error("Error sending invoice email:", error);
    return res.status(500).json({
      error: "Failed to send invoice email",
    });
  }
};