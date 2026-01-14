const nodemailer = require('nodemailer'); 

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.in', // Zoho SMTP server
  port: 465,
  secure: true, 
  auth: { 
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper function to replace placeholders in custom content
function replacePlaceholders(content, data) {
  if (!content) return '';
  
  return content
    .replace(/\[Event Name\]/g, data.eventTitle || '[Event Name]')
    .replace(/\[Event Title\]/g, data.eventTitle || '[Event Title]')
    .replace(/\[User Name\]/g, data.userName || '[User Name]')
    .replace(/\[Customer Name\]/g, data.userName || '[Customer Name]')
    .replace(/\[Date\]/g, data.eventDate || '[Date]')
    .replace(/\[Time\]/g, data.eventTime || '[Time]')
    .replace(/\[Venue\]/g, data.venue || '[Venue]')
    .replace(/\[Booking ID\]/g, data.bookingId || '[Booking ID]')
    .replace(/\[Ticket Count\]/g, data.ticketCount || '[Ticket Count]')
    .replace(/\[Total Amount\]/g, data.totalAmount !== undefined ? `₹${data.totalAmount.toLocaleString()}` : '[Total Amount]');
}

// Send booking confirmation email to user
async function sendBookingConfirmationEmail({
  to,
  userName,
  eventTitle, 
  eventDate,
  eventTime,
  venue,
  ticketCount,
  totalAmount,
  bookingId,
  customContent = null // New parameter for custom content
}) {
  const subject = `🎉 Booking Confirmed: ${eventTitle}`;
  
  // Process custom content if provided
  let customContentHtml = '';
  if (customContent && customContent.trim()) {
    const processedContent = replacePlaceholders(customContent, {
      eventTitle, userName, eventDate, eventTime, venue, bookingId, ticketCount, totalAmount
    });
    
    customContentHtml = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; margin: 25px 0; color: white; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-size: 18px;">📧</span>
          </div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Message from Event Organizer</h3>
        </div>
        <div style="font-size: 15px; line-height: 1.6; color: rgba(255, 255, 255, 0.95);">
          ${processedContent.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header with gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 40px 30px; text-align: center;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: center;">
                        <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px; font-weight: 700; letter-spacing: -0.5px;">Cumma Events</h1>
                        <div style="width: 60px; height: 4px; background-color: rgba(255, 255, 255, 0.3); margin: 0 auto; border-radius: 2px;"></div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Success Icon -->
              <tr>
                <td style="padding: 40px 40px 30px; text-align: center;">
                  <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 25px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);">
                    <span style="color: white; font-size: 36px; line-height: 1;">✓</span>
                  </div>
                  <h2 style="color: #1f2937; font-size: 28px; margin: 0 0 15px; font-weight: 700;">Booking Confirmed!</h2>
                  <p style="font-size: 17px; color: #6b7280; margin: 0; line-height: 1.5;">
                    Hi <strong style="color: #1f2937;">${userName}</strong>,<br>
                    Your booking for <strong style="color: #10B981;">${eventTitle}</strong> has been confirmed successfully.
                  </p>
                </td>
              </tr>

              <!-- Custom Content from Event Creator -->
              ${customContentHtml ? `<tr><td style="padding: 0 40px;">${customContentHtml}</td></tr>` : ''}

              <!-- Event Details Card -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 25px; text-align: center; font-weight: 600;">${eventTitle}</h3>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; width: 45%;">
                          <div style="display: flex; align-items: center;">
                            <span style="margin-right: 10px; font-size: 18px;">📅</span>
                            <strong style="color: #374151;">Date & Time:</strong>
                          </div>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 500;">${eventDate} at ${eventTime}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                          <div style="display: flex; align-items: center;">
                            <span style="margin-right: 10px; font-size: 18px;">📍</span>
                            <strong style="color: #374151;">Venue:</strong>
                          </div>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 500;">${venue}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                          <div style="display: flex; align-items: center;">
                            <span style="margin-right: 10px; font-size: 18px;">🎫</span>
                            <strong style="color: #374151;">Tickets:</strong>
                          </div>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 500;">${ticketCount} ticket(s)</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                          <div style="display: flex; align-items: center;">
                            <span style="margin-right: 10px; font-size: 18px;">${totalAmount > 0 ? '💰' : '🎉'}</span>
                            <strong style="color: #374151;">${totalAmount > 0 ? 'Total Paid:' : 'Event Type:'}</strong>
                          </div>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #10B981; font-weight: 700; font-size: 16px;">${totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : 'FREE'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <div style="display: flex; align-items: center;">
                            <span style="margin-right: 10px; font-size: 18px;">🔖</span>
                            <strong style="color: #374151;">Booking ID:</strong>
                          </div>
                        </td>
                        <td style="padding: 12px 0; font-family: 'Courier New', monospace; font-weight: 700; color: #1f2937; background: #f3f4f6; padding: 8px 12px; border-radius: 6px; font-size: 14px;">${bookingId}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Important Notice -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                    <div style="display: flex; align-items: flex-start;">
                      <span style="font-size: 20px; margin-right: 12px; margin-top: 2px;">⚠️</span>
                      <div>
                        <p style="margin: 0; font-size: 15px; color: #92400e; font-weight: 600;">
                          <strong>Important Reminder:</strong>
                        </p>
                        <p style="margin: 8px 0 0; font-size: 14px; color: #b45309; line-height: 1.5;">
                          Please bring a valid ID and this booking confirmation to the venue. Save this email for your records.
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Contact Support -->
              <tr>
                <td style="padding: 0 40px 30px; text-align: center;">
                  <p style="font-size: 15px; color: #6b7280; margin: 0 0 10px; line-height: 1.6;">
                    Need help? Contact us at <a href="mailto:support@cumma.in" style="color: #10B981; text-decoration: none; font-weight: 600;">support@cumma.in</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 15px; font-weight: 600;">
                    Thank you for choosing Cumma Events!<br>
                    <strong style="color: #10B981;">Team Cumma</strong>
                  </p>
                  <p style="font-size: 13px; color: #9ca3af; margin: 20px 0 0; line-height: 1.4;">
                    This is an automated confirmation email. Please do not reply to this email.<br>
                    © 2025 Cumma Events. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Cumma Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

// Send invoice email to user
async function sendInvoiceEmail({
  to,
  userName,
  eventTitle,
  bookingId,
  invoiceUrl,
  totalAmount,
  customContent = null // New parameter for custom content
}) {
  const subject = `📄 Invoice for ${eventTitle} - Booking ${bookingId}`;

  // Process custom content if provided
  let customContentHtml = '';
  if (customContent && customContent.trim()) {
    const processedContent = replacePlaceholders(customContent, {
      eventTitle, userName, bookingId, totalAmount
    });
    
    customContentHtml = `
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px; padding: 25px; margin: 25px 0; color: white; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-size: 18px;">🎟️</span>
          </div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Special Message for You</h3>
        </div>
        <div style="font-size: 15px; line-height: 1.6; color: rgba(255, 255, 255, 0.95);">
          ${processedContent.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice Ready</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px; font-weight: 700;">Cumma Events</h1>
                  <div style="width: 60px; height: 4px; background-color: rgba(255, 255, 255, 0.3); margin: 0 auto; border-radius: 2px;"></div>
                </td>
              </tr>

              <!-- Invoice Icon -->
              <tr>
                <td style="padding: 40px 40px 30px; text-align: center;">
                  <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 50%; margin: 0 auto 25px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);">
                    <span style="color: white; font-size: 32px;">📄</span>
                  </div>
                  <h2 style="color: #1f2937; font-size: 28px; margin: 0 0 15px; font-weight: 700;">Your Invoice is Ready!</h2>
                  <p style="font-size: 17px; color: #6b7280; margin: 0; line-height: 1.5;">
                    Hi <strong style="color: #1f2937;">${userName}</strong>,<br>
                    Your invoice for <strong style="color: #3b82f6;">${eventTitle}</strong> is now available for download.
                  </p>
                </td>
              </tr>

              <!-- Custom Content from Event Creator -->
              ${customContentHtml ? `<tr><td style="padding: 0 40px;">${customContentHtml}</td></tr>` : ''}

              <!-- Invoice Details -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; width: 40%;">
                          <strong style="color: #374151;">Event:</strong>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 500;">${eventTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #374151;">Booking ID:</strong>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-family: 'Courier New', monospace; font-weight: 700; color: #1f2937;">${bookingId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <strong style="color: #374151;">Total Amount:</strong>
                        </td>
                        <td style="padding: 12px 0; color: #10B981; font-weight: 700; font-size: 18px;">${totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : 'FREE'}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Download Button -->
              <tr>
                <td style="padding: 0 40px 40px; text-align: center;">
                  <a href="${invoiceUrl}" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                    📥 Download Invoice (PDF)
                  </a>
                  <p style="font-size: 14px; color: #6b7280; margin: 20px 0 0;">
                    Keep this invoice for your records. You can download it anytime using the link above.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 15px; font-weight: 600;">
                    Thank you for choosing Cumma Events!<br>
                    <strong style="color: #10B981;">Team Cumma</strong>
                  </p>
                  <p style="font-size: 13px; color: #9ca3af; margin: 20px 0 0;">
                    This is an automated email. Please do not reply to this email.<br>
                    © 2025 Cumma Events. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Cumma Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

// Send notification to service provider (Enhanced design)
async function sendServiceProviderNotificationEmail({
  to,
  eventTitle,
  userName,
  userEmail,
  userPhone,
  ticketCount,
  totalAmount,
  bookingId
}) {
  const subject = `🎯 New Event Booking: ${eventTitle}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; border-radius: 16px 16px 0 0;">
                  <h2 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">🎯 New Event Booking Confirmed</h2>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">Dear Service Provider,</p>
                  
                  <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #10B981;">
                    <p style="font-size: 16px; color: #065f46; margin: 0; font-weight: 600;">
                      🎉 Great news! You have a new booking for <strong>${eventTitle}</strong>
                    </p>
                  </div>

                  <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0;">
                    <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 20px; font-weight: 600;">Customer Details</h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                      <tr>
                        <td style="padding: 8px 0; width: 35%; color: #6b7280;"><strong>Customer Name:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${userEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;"><strong>Phone:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${userPhone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;"><strong>Tickets:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${ticketCount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;"><strong>Amount Received:</strong></td>
                        <td style="padding: 8px 0; color: #10B981; font-weight: 700; font-size: 16px;">${totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : 'FREE'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;"><strong>Booking ID:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-family: monospace; font-weight: 700;">${bookingId}</td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://cumma.in/service-provider/events" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
                      📊 View in Dashboard
                    </a>
                  </div>

                  <p style="font-size: 15px; color: #6b7280; margin: 30px 0 0;">
                    Best regards,<br>
                    <strong style="color: #10B981;">Team Cumma</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="font-size: 13px; color: #9ca3af; margin: 0;">
                    This is an automated notification from Cumma. Please do not reply to this email.<br>
                    © 2025 Cumma Events. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Cumma Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

// Keep the existing sendEventInvitationEmail function as is
async function sendEventInvitationEmail({
  to,
  eventTitle,
  eventVenue,
  eventDate,
  eventTime,
  registrationStartDate,
  registrationEndDate, 
  eventId
}) {
  const subject = `🎉 You're Invited to ${eventTitle}`;
  const eventDetailUrl = `${process.env.FRONTEND_URL}/EventDetail/${eventId}`;

  // Extract name from email (part before @)
  const userName = to.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Invitation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px; font-weight: 700;">Cumma Events</h1>
                  <div style="width: 60px; height: 4px; background-color: rgba(255,255,255,0.3); margin: 0 auto; border-radius: 2px;"></div>
                </td>
              </tr>

              <!-- Invitation content -->
              <tr>
                <td style="padding: 40px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 25px; display: inline-flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 32px;">🎉</span>
                    </div>
                    <h2 style="color: #1f2937; font-size: 28px; margin: 0 0 15px; font-weight: 700;">You're Invited!</h2>
                    <p style="font-size: 17px; color: #6b7280; margin: 0;">
                      Hi <strong style="color: #1f2937;">${userName}</strong>,<br>
                      You've been invited to join <strong style="color: #10B981;">${eventTitle}</strong>.
                    </p>
                  </div>

                  <!-- Event Details -->
                  <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin: 30px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>📅 Event:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${eventTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>📍 Venue:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${eventVenue}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>🕒 Date & Time:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${eventDate} at ${eventTime}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>🚀 Registration Starts:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${registrationStartDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;"><strong>⏰ Registration Ends:</strong></td>
                        <td style="padding: 10px 0; color: #dc2626; font-weight: bold;">${registrationEndDate}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${eventDetailUrl}" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px;">
                      🎟️ View Event & Register
                    </a>
                  </div>

                  <p style="text-align: center; font-size: 15px; color: #6b7280;">
                    Don't miss out! Register before <strong>${registrationEndDate}</strong> to secure your spot.
                  </p>

                  <p style="text-align: center; font-size: 16px; color: #374151; margin: 30px 0 0;">
                    We're excited to see you there!<br>
                    <strong style="color: #10B981;">Team Cumma</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="font-size: 13px; color: #9ca3af; margin: 0;">
                    This is an automated invitation. Please do not reply to this email.<br>
                    © 2025 Cumma Events. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Cumma Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

// Helper function to replace placeholders
function replacePlaceholders(content, data) {
  if (!content) return '';
  
  return content
    .replace(/\[Event Name\]/g, data.eventTitle || '[Event Name]')
    .replace(/\[Event Title\]/g, data.eventTitle || '[Event Title]')
    .replace(/\[User Name\]/g, data.userName || '[User Name]')
    .replace(/\[Customer Name\]/g, data.userName || '[Customer Name]')
    .replace(/\[Date\]/g, data.eventDate || '[Date]')
    .replace(/\[Time\]/g, data.eventTime || '[Time]')
    .replace(/\[Venue\]/g, data.venue || '[Venue]')
    .replace(/\[Booking ID\]/g, data.bookingId || '[Booking ID]');
}

// Send post-event feedback email
// Updated email function with encoded URL
async function sendPostEventFeedbackEmail({
  to,
  serviceProviderId,
  eventId,
  userName,
  eventTitle,
  eventDate,
  eventTime,
  venue,
  bookingId,
  customContent,
  userEmail = to // Use the 'to' field as email if not provided separately
}) {
  const subject = `🌟 Share Your Experience: ${eventTitle}`;

  // 🔒 UPDATED: Encode URL parameters for security
  const encodedParams = Buffer.from(JSON.stringify({
    username: userName,
    email: userEmail,
    serviceProviderId: serviceProviderId,
    eventId: eventId,
    eventTitle: eventTitle
  })).toString('base64');

  const feedbackUrl = `https://cumma.in/event-feedback/${eventId}?data=${encodedParams}`;

  // Process custom content
  let customContentHtml = '';
  if (customContent && customContent.trim()) {
    const processedContent = replacePlaceholders(customContent, {
      eventTitle, userName, eventDate, eventTime, venue, bookingId
    });
    
    customContentHtml = `
      <tr>
        <td style="padding: 0 40px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; margin: 25px 0; box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);">
            <tr>
              <td style="padding: 25px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="width: 40px; vertical-align: top;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="40" height="40">
                        <tr>
                          <td style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; text-align: center; vertical-align: middle;">
                            <span style="font-size: 18px;">💬</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style="padding-left: 15px; vertical-align: middle;">
                      <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: white;">Message from Event Organizer</h3>
                    </td>
                  </tr>
                </table>
                
                <div style="font-size: 15px; line-height: 1.6; color: rgba(255, 255, 255, 0.95); margin-top: 15px;">
                  ${processedContent.replace(/\n/g, '<br>')}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  // Rest of your existing HTML template with the updated feedbackUrl
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Post Event Feedback - Cumma Events</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      
      <!-- Main Container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            
            <!-- Email Content -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 0 auto;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px;" align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px; font-weight: 700; letter-spacing: -0.5px; text-align: center;">Cumma Events</h1>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="60" style="margin: 0 auto;">
                          <tr>
                            <td style="height: 4px; background-color: rgba(255, 255, 255, 0.3); border-radius: 2px;"></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Feedback Icon & Message -->
              <tr>
                <td style="padding: 40px 40px 30px;" align="center">
                  <!-- Feedback Icon -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="80" style="margin: 0 auto 25px;">
                    <tr>
                      <td style="width: 80px; height: 80px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 50%; text-align: center; vertical-align: middle; box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);">
                        <span style="color: white; font-size: 36px; line-height: 80px;">🌟</span>
                      </td>
                    </tr>
                  </table>
                  
                  <h2 style="color: #1f2937; font-size: 28px; margin: 0 0 15px; font-weight: 700; text-align: center;">How was your experience?</h2>
                  <p style="font-size: 17px; color: #6b7280; margin: 0; line-height: 1.5; text-align: center;">
                    Hi <strong style="color: #1f2937;">${userName}</strong>,<br><br>
                    Thank you for attending <strong style="color: #667eea;">${eventTitle}</strong>. We'd love to hear about your experience!
                  </p>
                </td>
              </tr>

              <!-- Custom Content -->
              ${customContentHtml}

              <!-- Event Details -->
              <tr>
                <td style="padding: 0 40px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f8fafc; border-radius: 12px; margin: 25px 0;">
                    <tr>
                      <td style="padding: 30px;">
                        <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 20px; font-weight: 600; text-align: center;">Event Details</h3>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="width: 30px; vertical-align: top;">
                                    <span style="font-size: 16px;">🎭</span>
                                  </td>
                                  <td style="padding-left: 12px;">
                                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Event</div>
                                    <div style="font-size: 16px; color: #1f2937; font-weight: 600;">${eventTitle}</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="width: 30px; vertical-align: top;">
                                    <span style="font-size: 16px;">📍</span>
                                  </td>
                                  <td style="padding-left: 12px;">
                                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Venue</div>
                                    <div style="font-size: 16px; color: #1f2937; font-weight: 600;">${venue}</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="width: 30px; vertical-align: top;">
                                    <span style="font-size: 16px;">🕒</span>
                                  </td>
                                  <td style="padding-left: 12px;">
                                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Date & Time</div>
                                    <div style="font-size: 16px; color: #1f2937; font-weight: 600;">${eventDate} at ${eventTime}</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 12px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td style="width: 30px; vertical-align: top;">
                                    <span style="font-size: 16px;">🎫</span>
                                  </td>
                                  <td style="padding-left: 12px;">
                                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Booking ID</div>
                                    <div style="font-size: 16px; color: #1f2937; font-weight: 600; font-family: 'Courier New', monospace;">${bookingId}</div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Feedback CTA -->
              <tr>
                <td style="padding: 0 40px 40px;" align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 25px auto;">
                    <tr>
                      <td>
                        <a href="${feedbackUrl}" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; padding: 18px 35px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);">
                          🌟 Share Your Feedback
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="font-size: 14px; color: #6b7280; margin: 20px 0 0; text-align: center;">
                    Your feedback helps us improve future events
                  </p>
                </td>
              </tr>

              <!-- Support Section -->
              <tr>
                <td style="padding: 0 40px 40px;" align="center">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 15px; font-weight: 600; text-align: center;">
                    Thank you for being part of our event!<br>
                    <strong style="color: #667eea;">Team Cumma</strong>
                  </p>
                </td>
              </tr>

            </table>

            <!-- Footer -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 30px auto 0;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5;">
                    © 2025 Cumma Events. All rights reserved.<br>
                    This feedback request was sent as part of the event follow-up process.
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Cumma Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}


// Send 1 hour before event reminder
async function sendOneHourReminderEmail({
  to,
  userName,
  eventTitle,
  eventDate,
  eventTime,
  venue,
  venueStatus,
  bookingId
}) {
  const subject = `⏰ Event Starting in 1 Hour: ${eventTitle}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Starting Soon</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px; font-weight: 700;">Cumma Events</h1>
                  <div style="width: 60px; height: 4px; background-color: rgba(255,255,255,0.3); margin: 0 auto; border-radius: 2px;"></div>
                </td>
              </tr>

              <!-- Alert Icon -->
              <tr>
                <td style="padding: 40px 40px 30px; text-align: center;">
                  <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); border-radius: 50%; margin: 0 auto 25px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);">
                    <span style="color: white; font-size: 32px;">⏰</span>
                  </div>
                  <h2 style="color: #1f2937; font-size: 28px; margin: 0 0 15px; font-weight: 700;">Event Starting in 1 Hour!</h2>
                  <p style="font-size: 17px; color: #6b7280; margin: 0; line-height: 1.5;">
                    Hi <strong style="color: #1f2937;">${userName}</strong>,<br>
                    Your event <strong style="color: #ff6b6b;">${eventTitle}</strong> is starting in just <strong>1 hour</strong>!
                  </p>
                </td>
              </tr>

              <!-- Urgent Notice -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-left: 4px solid #ff6b6b; border-radius: 8px; padding: 20px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                      <span style="font-size: 20px; margin-right: 10px;">🚨</span>
                      <h3 style="margin: 0; color: #856404; font-size: 16px; font-weight: 600;">Get Ready Now!</h3>
                    </div>
                    <p style="margin: 0; color: #6c5ce7; font-size: 14px; line-height: 1.5;">
                      • Prepare your documents and valid ID<br>
                      • Leave early to avoid traffic delays<br>
                      • Check event location and parking details
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Event Details -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="background: #f8fafc; border-radius: 12px; padding: 25px;">
                    <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 20px; font-weight: 600; text-align: center;">Event Details</h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; width: 35%;"><strong>🎯 Event:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 600;">${eventTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>📅 Date & Time:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #ff6b6b; font-weight: 600;">${eventDate} at ${eventTime}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>📍 Location:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${venue}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>🏢 Type:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; text-transform: capitalize;">${venueStatus}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;"><strong>🎫 Booking ID:</strong></td>
                        <td style="padding: 10px 0; font-family: monospace; font-weight: 700; color: #1f2937;">${bookingId}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Action Button -->
              <tr>
                <td style="padding: 0 40px 40px; text-align: center;">
                  <div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: white; margin: 0 0 10px; font-size: 18px;">Ready to Join?</h4>
                    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
                      ${venueStatus === 'online' ? '🔗 Event link will be shared separately' : '🚗 Start your journey now to reach on time!'}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 15px; font-weight: 600;">
                    See you at the event!<br>
                    <strong style="color: #ff6b6b;">Team Cumma</strong>
                  </p>
                  <p style="font-size: 13px; color: #9ca3af; margin: 20px 0 0;">
                    This is an automated reminder for your registered event.<br>
                    © 2025 Cumma Events. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Cumma Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

// Send 1 day before event reminder
async function sendOneDayReminderEmail({
  to,
  userName,
  eventTitle,
  eventDate,
  eventTime,
  venue,
  venueStatus,
  bookingId
}) {
  const subject = `📅 Tomorrow: ${eventTitle} - Don't Miss Out!`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Tomorrow</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4834d4 0%, #6c5ce7 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px; font-weight: 700;">Cumma Events</h1>
                  <div style="width: 60px; height: 4px; background-color: rgba(255,255,255,0.3); margin: 0 auto; border-radius: 2px;"></div>
                </td>
              </tr>

              <!-- Calendar Icon -->
              <tr>
                <td style="padding: 40px 40px 30px; text-align: center;">
                  <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #4834d4 0%, #6c5ce7 100%); border-radius: 50%; margin: 0 auto 25px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(72, 52, 212, 0.3);">
                    <span style="color: white; font-size: 32px;">📅</span>
                  </div>
                  <h2 style="color: #1f2937; font-size: 28px; margin: 0 0 15px; font-weight: 700;">Event Tomorrow!</h2>
                  <p style="font-size: 17px; color: #6b7280; margin: 0; line-height: 1.5;">
                    Hi <strong style="color: #1f2937;">${userName}</strong>,<br>
                    Just a friendly reminder that <strong style="color: #4834d4;">${eventTitle}</strong> is happening <strong>tomorrow</strong>!
                  </p>
                </td>
              </tr>

              <!-- Preparation Tips -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-left: 4px solid #4834d4; border-radius: 8px; padding: 20px;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                      <span style="font-size: 20px; margin-right: 10px;">💡</span>
                      <h3 style="margin: 0; color: #1565c0; font-size: 16px; font-weight: 600;">Preparation Tips</h3>
                    </div>
                    <ul style="margin: 0; color: #1976d2; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                      <li>Plan your route and travel time in advance</li>
                      <li>Prepare all required documents and ID</li>
                      <li>Set reminders on your phone</li>
                      <li>Check weather forecast for tomorrow</li>
                      ${venueStatus === 'online' ? '<li>Test your internet connection and camera</li>' : '<li>Check parking availability near the venue</li>'}
                    </ul>
                  </div>
                </td>
              </tr>

              <!-- Event Details -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="background: #f8fafc; border-radius: 12px; padding: 25px;">
                    <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 20px; font-weight: 600; text-align: center;">Event Details</h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; width: 35%;"><strong>🎯 Event:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 600;">${eventTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>📅 Date & Time:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #4834d4; font-weight: 600;">${eventDate} at ${eventTime}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>📍 Location:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${venue}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>🏢 Type:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937; text-transform: capitalize;">${venueStatus}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;"><strong>🎫 Booking ID:</strong></td>
                        <td style="padding: 10px 0; font-family: monospace; font-weight: 700; color: #1f2937;">${bookingId}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Excitement Building -->
              <tr>
                <td style="padding: 0 40px 40px; text-align: center;">
                  <div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); border-radius: 12px; padding: 25px; margin: 20px 0;">
                    <h4 style="color: white; margin: 0 0 10px; font-size: 20px;">We're Excited to See You! 🎉</h4>
                    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 15px; line-height: 1.5;">
                      Get ready for an amazing experience. We've prepared something special for all attendees!
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 15px; font-weight: 600;">
                    Looking forward to seeing you tomorrow!<br>
                    <strong style="color: #4834d4;">Team Cumma</strong>
                  </p>
                  <p style="font-size: 13px; color: #9ca3af; margin: 20px 0 0;">
                    This is an automated reminder for your registered event.<br>
                    © 2025 Cumma Events. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Cumma Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}



module.exports = {
  sendBookingConfirmationEmail,
  sendInvoiceEmail,
  sendServiceProviderNotificationEmail,
  sendEventInvitationEmail,
  sendPostEventFeedbackEmail,
  sendOneHourReminderEmail,
  sendOneDayReminderEmail
}; 
