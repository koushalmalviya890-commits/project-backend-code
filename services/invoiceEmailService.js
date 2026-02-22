const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("EMAIL_USER and EMAIL_PASS missing");
  }

  return nodemailer.createTransport({
    host: "smtppro.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

async function sendInvoiceEmail({
  recipientEmail,
  startupName,
  facilityName,
  facilityLocation,
  bookingDates,
  bookingId,
  amount,
  invoiceUrl,
}) {
  console.log("📧 Attempting to send email to:", recipientEmail);
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: `"Cumma" <${process.env.EMAIL_FROM}>`,
    to: recipientEmail,
    subject: `Congratulations, Your Booking through Cumma is Confirmed`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
   <div style="text-align: center; margin-bottom: 20px;">
        <img src="cid:emailLogo" alt="Cumma Logo" style="height: 60px;" />
      </div>

        <p style="font-size: 16px;">Hi ${startupName || "there"},</p>

        <p style="font-size: 16px;">
          Your booking for <strong>${facilityName}</strong> on <strong>${bookingDates}</strong> is confirmed.
        </p>

        <p style="font-size: 16px;">
          <strong>Location:</strong><br/>
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

        <p style="font-size: 16px;">
          <strong>Booking ID:</strong> ${bookingId}<br/>
          <strong>Amount Paid:</strong> ₹${Number(amount).toLocaleString("en-IN")}
        </p>
      <!-- Invoice Section -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${invoiceUrl}"  style="
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
        
        <p style="text-align:center;color:#4F46E5;font-style:italic;">
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
          <a href="https://www.cumma.in" style="color: #4F46E5;">www.cumma.in</a>
        </p>
      </div>
    </div>
   `,
  attachments: [
    {
      filename: 'logo.png',
      path: './public/logo.png',
      cid: 'emailLogo'
    }
  ]
};


  try {
    await transporter.sendMail(mailOptions);
    return { success: true, provider: "zoho" };
  } catch (zohoErr) {
    console.error("Zoho email failed:", zohoErr);

    try {
      const { error } = await resend.emails.send({
        from: `Cumma <${process.env.EMAIL_FROM || "noreply@cumma.in"}>`,
        to: recipientEmail,
        subject: `Booking Confirmed - Invoice from Cumma`,
        html: mailOptions.html,
      });

      if (error) throw error;

      return { success: true, provider: "resend" };
    } catch (resendErr) {
      console.error("Resend failed:", resendErr);
      return { success: false, error: resendErr };
    }
  }
}

// async function sendSimpleConfirmationEmail({
//   recipientEmail,
//   startupName,
//   facilityName,
//   bookingDates,
//   bookingId,
//   amount,
// }) {
//   console.log("📧 Attempting to send email to:", recipientEmail);
//   const transporter = createEmailTransporter();

//   const mailOptions = {
//     from: `"Cumma" <${process.env.EMAIL_FROM}>`,
//     to: recipientEmail,
//     subject: `Your Booking is Confirmed – Cumma`,
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2>🎉 Booking Confirmed</h2>
//         <p>Hi ${startupName || "there"},</p>

//         <p>Your booking has been successfully confirmed.</p>

//         <p>
//           <strong>Facility:</strong> ${facilityName}<br/>
//           <strong>Booking ID:</strong> ${bookingId}<br/>
//           <strong>Dates:</strong> ${bookingDates}<br/>
//           <strong>Amount Paid:</strong> ₹${Number(amount).toLocaleString("en-IN")}
//         </p>

//         <p>
//           Your invoice is being processed and will be shared shortly.
//         </p>

//         <p>Warm regards,<br/>Team Cumma</p>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return { success: true };
//   } catch (err) {
//     console.error("Fallback email failed:", err);
//     return { success: false, error: err };
//   }
// }

module.exports = { sendInvoiceEmail };

{/*<div style="text-align:center; margin: 30px 0;">
          <a href="${invoiceUrl}" style="background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">
            📥 View Invoice
          </a>
        </div>*/}
