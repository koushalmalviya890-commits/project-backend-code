const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('./s3Client');
const axios = require('axios');
const EventBookingDetail = require('../src/models/EventBookingDetails');


// Generate professional invoice HTML
function generateEventInvoiceHTML({
  booking,
  event,
  serviceProvider,
  invoiceNumber,
  invoiceDate
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: "Asia/Kolkata",
    });
  };

  const formatTime = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    const end = new Date(endDate).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: "Asia/Kolkata",
      
    });
    return `${start} - ${end}`;
  };

  return `
 
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #10B981; }
        .company-info h1 { color: #10B981; font-size: 32px; margin: 0; }
        .company-info p { margin: 5px 0; color: #666; }
        .invoice-info { text-align: right; }
        .invoice-info h2 { color: #333; font-size: 24px; margin: 0; }
        .invoice-info p { margin: 5px 0; color: #666; }
        .billing-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .billing-info { width: 48%; }
        .billing-info h3 { color: #333; font-size: 18px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
        .event-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .event-details h3 { color: #10B981; font-size: 20px; margin-bottom: 15px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .detail-row strong { color: #333; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #10B981; color: white; padding: 15px; text-align: left; }
        .items-table td { padding: 15px; border-bottom: 1px solid #ddd; }
        .items-table .amount { text-align: right; font-weight: bold; }
        .totals { width: 300px; margin-left: auto; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .total-row.final { border-top: 2px solid #10B981; font-size: 18px; font-weight: bold; color: #10B981; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
        .payment-status { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="company-info">
            <h1>Cumma Events</h1>
            <p>Email: support@cumma.in</p>
            <p>Website: www.cumma.in</p>
          </div>
          <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${formatDate(invoiceDate)}</p>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
          </div>
        </div>

        <!-- Payment Status -->
        <div class="payment-status">
          ✅ PAYMENT COMPLETED
        </div>

        <!-- Billing Information -->
        <div class="billing-section">
          <div class="billing-info">
            <h3>Bill To:</h3>
            <p><strong>${booking.PersonalInfo[0]?.userfullName || 'N/A'}</strong></p>
            <p>Email: ${booking.PersonalInfo[0]?.useremail || 'N/A'}</p>
            <p>Phone: ${booking.PersonalInfo[0]?.userphoneNumber || 'N/A'}</p>
          </div>
          <div class="billing-info">
            <h3>Event Provider:</h3>
            <p><strong>${serviceProvider?.serviceName || 'Cumma Events'}</strong></p>
            <p>Email: ${serviceProvider?.primaryEmailId || 'support@cumma.in'}</p>
          </div>
        </div>

        <!-- Event Details -->
        <div class="event-details">
          <h3>${event?.title || 'Event'}</h3>
          <div class="detail-row">
            <span><strong> Date:</strong></span>
            <span>${formatDate(event?.startDateTime)}</span>
          </div>
          <div class="detail-row">
            <span><strong> Time:</strong></span>
            <span>${formatTime(event?.startDateTime, event?.endDateTime)}</span>
          </div>
          <div class="detail-row">
            <span><strong> Venue:</strong></span>
            <span>${event?.venue || 'TBD'}</span>
          </div>
          <div class="detail-row">
            <span><strong> Tickets:</strong></span>
            <span>${booking.bookingTickets} ticket(s)</span>
          </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th class="amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Event Ticket - ${event?.title || 'Event'}</td>
              <td>${booking.bookingTickets}</td>
              <td>₹${(event?.ticketPrice || 0).toLocaleString()}</td>
              <td class="amount">₹${((event?.ticketPrice || 0) * booking.bookingTickets).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
       <!-- Totals -->
<div class="totals">
  <div class="total-row">
    <span>Subtotal:</span>
    <span>₹${((event?.ticketPrice || 0) * booking.bookingTickets).toLocaleString()}</span>
  </div>

  ${booking.gstAmount > 0 ? `
    <div class="total-row">
      <span>GST (18%):</span>
      <span>₹${booking.gstAmount.toLocaleString()}</span>
    </div>
  ` : ''}



  ${booking.couponCode ? `
    <div class="total-row">
      <span>Discount (${booking.couponCode}):</span>
      <span>-₹${booking.discountAmount.toLocaleString()}</span>
    </div>
  ` : ''}


  <div class="total-row final">
    <span>Total Paid:</span>
    <span>₹${(booking.totalAmount || 0).toLocaleString()}</span>
  </div>
</div>


        <!-- Footer -->
        <div class="footer">
          <p><strong>Thank you for choosing Cumma Events!</strong></p>
          <p>For any queries regarding this invoice, please contact us at support@cumma.in</p>
          <p style="margin-top: 20px; font-size: 12px;">
            This is a computer generated invoice. No signature required.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate and store invoice
async function generateAndStoreEventInvoice(bookingId) {
  try {
    console.log(`Starting invoice generation for booking ${bookingId}`);

    // Find the booking
    const booking = await EventBookingDetail.findById(bookingId)
      .populate('eventId', 'title startDateTime endDateTime venue ticketPrice serviceProviderId')
      .exec();

    if (!booking) {
      console.error(`Booking ${bookingId} not found`);
      return null;
    }

    const event = booking.eventId;
    console.log(`Found booking for event: ${event?.title}`);

    // Generate invoice number
    const invoiceNumber = `INV-EVT-${bookingId.toString().substring(0, 8)}-${Date.now().toString().substring(9, 13)}`;
    console.log(`Generated invoice number: ${invoiceNumber}`);

    // Get service provider info if available
    let serviceProvider = null;
    if (event?.serviceProviderId) {
      const ServiceProvider = require('../src/models/ServiceProvider'); // Adjust path as needed
      serviceProvider = await ServiceProvider.findOne({ userId: event.serviceProviderId });
    }

    // Create invoice HTML
    const invoiceHTML = generateEventInvoiceHTML({
      booking,
      event,
      serviceProvider,
      invoiceNumber,
      invoiceDate: new Date()
    });

    const PDFLAYER_API_KEY = "ed1d01b7e7626fc1cdf1cc04f0f61075";
    // Generate PDF using PDFLayer
    console.log('Converting HTML to PDF using PDFLayer');
    const response = await axios.post(
      `http://api.pdflayer.com/api/convert?access_key=${PDFLAYER_API_KEY}`,
      new URLSearchParams({
        document_html: invoiceHTML,
        document_name: `${invoiceNumber}.pdf`,
        test: '0'
      }),
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const pdfBuffer = Buffer.from(response.data);

    // Upload to S3
    const bucketName = process.env.AWS_BUCKET_NAME;
    const s3Key = `event-invoices/${bookingId}/${invoiceNumber}.pdf`;
    
    console.log(`Uploading PDF to S3: ${bucketName}/${s3Key}`);
    
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        ContentDisposition: `attachment; filename="${invoiceNumber}.pdf"`
      })
    );

    // Get the URL
    const region = process.env.AWS_REGION;
    const invoiceUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
    
    console.log(`PDF uploaded successfully. URL: ${invoiceUrl}`);

    // Update booking with invoice URL
    await EventBookingDetail.findByIdAndUpdate(bookingId, {
      invoiceUrl,
      invoiceGeneratedAt: new Date()
    });

    console.log('Invoice URL updated in booking record');

    return {
      invoiceUrl,
      invoiceNumber
    };

  } catch (error) {
    console.error(`Error generating invoice for booking ${bookingId}:`, error);
    return null;
  }
}

module.exports = {
  generateAndStoreEventInvoice
};
