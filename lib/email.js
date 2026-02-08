
const nodemailer = require('nodemailer');
const dayjs = require('dayjs');

// Create email transporter with validation
const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Validate credentials
  if (!emailUser || !emailPass) {
    console.error('❌ Email credentials missing. Please set EMAIL_USER and EMAIL_PASS in .env');
    throw new Error('Email credentials not configured');
  }

  return nodemailer.createTransport({
    host: 'smtppro.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    // Add these for better debugging
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });
};

// Verify transporter before use
const verifyTransporter = async () => {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error);
    return false;
  }
};

async function sendServiceProviderNotificationEmail({
  to,
  facilityName,
  startupName,
  rentalPlan,
  startDate,
  endDate,
  amount
}) {
  try {
    const transporter = createEmailTransporter();
    const subject = `New Booking Confirmed: ${facilityName}`;

    const formatDateSafe = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : 'N/A';
    const safeAmount = Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
        <h2 style="color: #2D3748; font-size: 20px;">✅ Facility Booking Confirmed</h2>

        <p style="font-size: 15px; color: #4A5568;">Dear Service Provider,</p>

        <p style="font-size: 15px; color: #4A5568;">
          <strong>${startupName}</strong> has successfully booked your facility 
          <strong>${facilityName}</strong>.
        </p>

        <table style="width: 100%; margin-top: 16px; border-collapse: collapse; font-size: 15px;">
          <tr>
            <td style="padding: 8px 0;"><strong>Rental Plan:</strong></td>
            <td style="padding: 8px 0;">${rentalPlan}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Start Date:</strong></td>
            <td style="padding: 8px 0;">${formatDateSafe(startDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>End Date:</strong></td>
            <td style="padding: 8px 0;">${formatDateSafe(endDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Amount Paid:</strong></td>
            <td style="padding: 8px 0;">₹${safeAmount}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; font-size: 15px; color: #4A5568;">
          You can view the full booking details in your 
          <a href="https://cumma.in" style="color: #3182CE; text-decoration: none;">Cumma</a>.
        </p>

        <p style="margin-top: 30px; font-size: 15px; color: #4A5568;">
          Regards,<br />
          Team Cumma
        </p>

        <hr style="margin-top: 40px; border: none; border-top: 1px solid #E2E8F0;" />
        <p style="font-size: 12px; color: #A0AEC0; margin-top: 16px;">
          This is an automated notification from Cumma. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

    await transporter.sendMail({
      from: `"Cumma" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

  } catch (error) {
    console.error('❌ Failed to send service provider notification:', error);
    throw error;
  }
}

async function sendReminderEmailToStartup({
  to,
  startupName,
  facilityName,
  rentalPlan,
  endDate
}) {
  try {
    const transporter = createEmailTransporter();
    const end = dayjs(endDate);
    const today = dayjs();
    const daysLeft = end.diff(today, 'day'); // 3, 2, or 0
    const formattedEndDate = end.format('MMMM D, YYYY');

    let subject = '';
    let html = '';

    switch (daysLeft) {
      case 3:
        subject = `Your Cumma Booking is Ending Soon – Buffer Time Available`;
        html = `
        <p>Hi ${startupName},</p>

        <p>Just a quick reminder — your booking on Cumma is about to end.</p>

        <p>Some facilities offer a short buffer time after your slot, but this is fully managed by the facility enabler. If you'd like to extend your time, please check with the facility enabler directly.</p>

        <p>If not extended, the slot will automatically become available for the next user — so do plan accordingly.</p>

        <p>Thanks for choosing Cumma. We hope the space  served you well!</p>

        <br>
        —<br>
        Team Cumma<br>
        <a href="https://www.cumma.in">www.cumma.in</a><br>
        support@cumma.in
      `;
        break;

      case 2:
        subject = `Reminder - Just 2 Days Left in Your Booking, Renew now with cumma for hassle-free utilisation`;
        html = `
        <p>Hi ${startupName},</p>

        <p>This is to remind you that your current booking for <strong>${facilityName}</strong> is ending in 2 days!</p>

        <p>If you're planning to extend or rebook the space, now's a great time to secure your next slot and avoid last-minute unavailability.</p>

        <p>As always, we're here if you need any support at <a href="mailto:support@cumma.in">support@cumma.in</a></p>

        <br>
        Team Cumma<br>
        <a href="https://www.cumma.in">www.cumma.in</a>
      `;
        break;

      case 0:
        subject = `Your Cumma Booking Ends Today – Need More Time?`;
        html = `
        <p>Hi ${startupName},</p>

        <p>Your current booking through Cumma ends today.</p>

        <p>If you're planning to continue using the space, we recommend rebooking soon to avoid any disruption or slot unavailability.</p>

        <p>Need assistance with your next booking? We're just a message away.</p>

        <p>Wishing you continued success in whatever you're building!</p>

        <br>
        Team Cumma<br>
        <a href="https://www.cumma.in">www.cumma.in</a><br>
        support@cumma.in
      `;
        break;

      default:
        // Optional: skip sending for any other day
        return;
    }

    await transporter.sendMail({
      from: `"Cumma" <${process.env.EMAIL_FROM || 'noreply@cumma.in'}>`,
      to,
      subject,
      html,
    });

  } catch (error) {
    console.error('❌ Failed to send reminder email:', error);
    throw error;
  }
}

async function sendBookingExtensionNotificationToProvider({
  to,
  startupName,
  facilityName,
  extentDays
}) {
  try {
    const transporter = createEmailTransporter();
    const subject = `Extension Request for ${facilityName}`;

    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f5f8fa; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
        <h2 style="color: #2D3748;">🔔 Extension Request Received</h2>

        <p style="font-size: 15px; color: #4A5568;">
          Dear Service Provider,
        </p>

        <p style="font-size: 15px; color: #4A5568;">
          <strong>${startupName}</strong> has requested to extend their booking for your facility 
          <strong>${facilityName}</strong> by 
          <strong>${extentDays} day${extentDays > 1 ? 's' : ''}</strong>.
        </p>

        <div style="margin: 20px 0; padding: 16px; background-color: #EDF2F7; border-left: 4px solid #3182CE;">
          <p style="margin: 0; color: #2B6CB0;">
            📅 Requested Extension: <strong>${extentDays} day${extentDays > 1 ? 's' : ''}</strong>
          </p>
        </div>

        <p style="font-size: 15px; color: #4A5568;">
          You can review and take action on this request in your 
          <a href="https://cumma.in" style="color: #3182CE; text-decoration: none;">Cumma</a>.
        </p>

        <p style="margin-top: 32px; font-size: 15px; color: #4A5568;">
          Regards,<br/>
          Team Cumma
        </p>

        <hr style="margin-top: 40px; border: none; border-top: 1px solid #E2E8F0;" />
        <p style="font-size: 12px; color: #A0AEC0; margin-top: 16px;">
          This is an automated message from Cumma. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

    await transporter.sendMail({
      from: `"Cumma" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('❌ Failed to send booking extension notification mail:', error);
    throw error;
  }
}

async function sendFacilityContactMail({
  to,
  facilityName,
  startupName,
  rentalPlan,
  startDate,
  endDate,
  amount
}) {
  try {
    const transporter = createEmailTransporter();
    const subject = `New Booking Confirmed: ${facilityName}`;

    const formatDateSafe = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : 'N/A';
    const safeAmount = Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); padding: 24px;">
        <h2 style="color: #2D3748;">🎉 Booking Confirmed!</h2>
        <p>Dear Service Provider,</p>

        <p>
          <strong>${startupName}</strong> has successfully booked your facility <strong>${facilityName}</strong>.
          Please find the booking details below:
        </p>

        <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Rental Plan:</strong></td>
            <td style="padding: 8px 0;">${rentalPlan}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Start Date:</strong></td>
            <td style="padding: 8px 0;">${formatDateSafe(startDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>End Date:</strong></td>
            <td style="padding: 8px 0;">${formatDateSafe(endDate)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Amount Paid:</strong></td>
            <td style="padding: 8px 0;">₹${safeAmount}</td>
          </tr>
        </table>

        <p style="margin-top: 24px;">
          Please log in to your <a href="https://cumma.in" style="color: #3182CE;">Cumma.in</a> for full details.
        </p>

        <p style="margin-top: 32px;">Regards,<br/>Team Cumma</p>

        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 12px; color: #718096; margin-top: 16px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

    await transporter.sendMail({
      from: `"Cumma" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });

  } catch (error) {
    console.error('❌ Failed to send facility contact mail:', error);
    throw error;
  }
}

module.exports = {
  verifyTransporter,
  sendServiceProviderNotificationEmail,
  sendReminderEmailToStartup,
  sendBookingExtensionNotificationToProvider,
  sendFacilityContactMail
};