const mongoose = require("mongoose");
const axios = require("axios");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { logToDB } = require("./logToDB");

 s3Client = new S3Client({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});



exports.generateAndStoreInvoice = async (bookingId) => {
    let invoiceUrl = null;

    try {
        const db = mongoose.connection.db;

        await logToDB(db, "info", `Invoice generation started for ${bookingId}`);

        const booking = await db.collection("bookings").findOne({
            _id: new mongoose.Types.ObjectId(bookingId),
        });

        if (!booking) {
            await logToDB(db, "error", `Booking not found: ${bookingId}`);
            return null;
        }

        //  Fetch related data
        let facility = await db.collection("Facilities").findOne({
            _id: booking.facilityId,
        });

        let startup = await db.collection("AffiliateLinkUsers").findOne({
            mailId: booking.affiliateUserEmail,
        });

        if (!startup) {
            startup = await db.collection("Startups").findOne({
                _id: booking.startupId,
            });
        }

        let serviceProvider = null;

        if (booking.incubatorId) {
            serviceProvider = await db.collection("Service Provider").findOne({
                userId: booking.incubatorId,
            });
        }

        // 🛡 Fallback values
        facility = facility || {
            details: { name: "Facility (Unavailable)" },
            facilityType: "N/A",
        };

        startup = startup || {
            contactName: "Startup (Unavailable)",
            mailId: "N/A",
        };

        const invoiceNumber = `INV-${bookingId.substring(
            0,
            8
        )}-${Date.now().toString().slice(-4)}`;

        await logToDB(db, "info", `Invoice number generated: ${invoiceNumber}`);

        // 🧾 Generate HTML
        let invoiceHTML;

        if (serviceProvider?.invoiceType === "cumma") {
            invoiceHTML = generateProfessionalInvoiceHTML({
                booking,
                facility,
                startup,
                serviceProvider,
                invoiceNumber,
                invoiceDate: new Date(),
            });
        } else if (serviceProvider?.invoiceType === "self") {
            if (serviceProvider.invoiceTemplate === "template2") {
                invoiceHTML = generateTemplate2InvoiceHTML({
                    booking,
                    facility,
                    startup,
                    serviceProvider,
                    invoiceNumber,
                    invoiceDate: new Date(),
                });
            } else {
                invoiceHTML = generateTemplate1InvoiceHTML({
                    booking,
                    facility,
                    startup,
                    serviceProvider,
                    invoiceNumber,
                    invoiceDate: new Date(),
                });
            }
        } else {
            invoiceHTML = generateProfessionalInvoiceHTML({
                booking,
                facility,
                startup,
                serviceProvider,
                invoiceNumber,
                invoiceDate: new Date(),
            });
        }

        // 📄 Convert HTML → PDF (pdflayer)
        const accessKey = process.env.PDFLAYER_ACCESS_KEY;
        let pdfBuffer = null;

        if (!accessKey) {
            await logToDB(db, "error", "PDFLayer access key missing");
        } else {
            try {
                const response = await axios.post(
                    `https://api.pdflayer.com/api/convert?access_key=${accessKey}`,
                    new URLSearchParams({
                        document_html: invoiceHTML,
                        document_name: "invoice.pdf",
                    }),
                    {
                        responseType: "arraybuffer",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );

                pdfBuffer = Buffer.from(response.data);
            } catch (error) {
                if (error.response?.data) {
                    const body = Buffer.isBuffer(error.response.data)
                        ? error.response.data.toString("utf8")
                        : String(error.response.data);
                    console.error("pdflayer error body:", body);
                    await logToDB(db, "error", "PDFLayer error body", body);
                }
                await logToDB(db, "error", "PDFLayer conversion failed", error);
            }
        }

        // ☁ Upload to S3
        const bucketName = process.env.AWS_BUCKET_NAME || "cumma-images";
        const region = process.env.AWS_REGION;
        const s3Key = `invoices/${bookingId}/${invoiceNumber}.pdf`;

        if (pdfBuffer) {
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: s3Key,
                    Body: pdfBuffer,
                    ContentType: "application/pdf",
                    ContentDisposition: `attachment; filename="${invoiceNumber}.pdf"`,
                })
            );

            invoiceUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;

            // 🗂 Update booking
            await db.collection("bookings").updateOne(
                { _id: new mongoose.Types.ObjectId(bookingId) },
                {
                    $set: {
                        invoiceUrl,
                        invoiceGeneratedAt: new Date(),
                    },
                }
            );

            await logToDB(db, "info", `Invoice uploaded: ${invoiceUrl}`);
        } else {
            await logToDB(db, "warn", "Skipping invoice upload: PDF not generated");
        }

        // 📧 Send email (non-blocking)
        try {
            const allowWithoutInvoice = !invoiceUrl;
            await sendInvoiceEmail(
                bookingId,
                invoiceUrl,
                startup,
                facility,
                allowWithoutInvoice
            );
        } catch (emailError) {
            await logToDB(db, "error", "Invoice email failed", emailError);
        }

        return invoiceUrl;
    } catch (error) {
        console.error("Invoice generation error:", error);
        return null;
    }
};

const sendInvoiceEmail = async (
    bookingId,
    invoiceUrl,
    startup,
    facility,
    allowWithoutInvoice = false
) => {
    try {
        const recipientEmail = startup.mailId || startup.email;

        if (!recipientEmail) {
            console.error(
                `No valid email found for startup ${startup?._id || "unknown"}. Cannot send invoice email.`
            );
            return;
        }

        // const baseUrl = process.env.BASE_URL || "https://cumma.in";
const baseUrl = "http://localhost:3001"
        const response = await axios.post(
            `${baseUrl}/api/affiliate/user/invoices/email`,
            {
                bookingId,
                automated: true,
                recipientEmail: recipientEmail,
                forceSend: false,
                allowWithoutInvoice: allowWithoutInvoice,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Invoice-Automation":
                        process.env.EMAIL_WEBHOOK_SECRET || "",
                },
            }
        );

        console.log(
            `Invoice email sent automatically to ${recipientEmail} for booking ${bookingId}`
        );

    } catch (error) {
        console.error("Error sending invoice email automatically:",
            error.response?.data || error.message
        );
    }
};

function generateProfessionalInvoiceHTML(data) {
    const {
        booking,
        facility,
        startup,
        serviceProvider,
        invoiceNumber,
        invoiceDate,
    } = data;

    // Format currency for display
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return "₹0.00";
        return `₹${Number(amount).toFixed(2)}`;
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return "N/A";
        try {
            return new Date(date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (e) {
            return "N/A";
        }
    };

    // Format date and time
    const formatDateTime = (date) => {
        if (!date) return "N/A";
        try {
            return new Date(date).toLocaleString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return "N/A";
        }
    };

    // Calculate amounts
    const originalBaseAmount = booking.originalBaseAmount || 0;
    const serviceFee = booking.serviceFee || 0;
    const bookingSeats = booking.bookingSeats || 0;
    const gstAmount = booking.gstAmount || 0;
    // const grandTotal = originalBaseAmount + serviceFee + gstAmount;
    const totalAmount = booking.amount || 0;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber}</title>
   <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.4;
      color: #1a1a1a;
      background-color: #ffffff;
      font-size: 13px;
    }

    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      min-height: 100%;
    }

    .letterhead {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }

    .company-info {
      width: 100%;
    }

    .company-info table {
      width: 100%;
      border-collapse: collapse;
    }

    .company-info td {
      vertical-align: middle;
      padding: 0;
    }

    .company-logo {
      text-align: left;
    }

    .company-logo h1 {
      font-size: 24px;
      font-weight: 700;
      color: #2563eb;
      letter-spacing: 1px;
    }

    .company-details {
      text-align: right;
      font-size: 11px;
      color: #6b7280;
    }

    .invoice-title {
      text-align: center;
      margin: 15px 0;
    }

    .invoice-title h2 {
      font-size: 22px;
      font-weight: 600;
      color: #1f2937;
      letter-spacing: 0.5px;
    }

    .invoice-meta {
      width: 100%;
      margin-bottom: 20px;
    }

    .invoice-meta table {
      width: 100%;
      border-collapse: collapse;
    }

    .invoice-meta td {
      width: 50%;
      vertical-align: top;
      padding: 0 10px 0 0;
    }

    .invoice-meta td:last-child {
      padding: 0 0 0 10px;
    }

    .invoice-details, .billing-info {
      background: #f8fafc;
      padding: 15px;
      border-radius: 6px;
      border-left: 3px solid #2563eb;
      width: 100%;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .info-row {
      width: 100%;
      margin-bottom: 6px;
      font-size: 12px;
    }

    .info-row table {
      width: 100%;
      border-collapse: collapse;
    }

    .info-label {
      font-weight: 500;
      color: #6b7280;
      width: 100px;
      vertical-align: baseline;
    }

    .info-value {
      font-weight: 500;
      color: #1f2937;
      text-align: right;
      word-break: break-all;
      vertical-align: baseline;
    }

    .facility-startup-info {
      width: 100%;
      margin-bottom: 20px;
    }

    .facility-startup-info table {
      width: 100%;
      border-collapse: collapse;
    }

    .facility-startup-info td {
      width: 50%;
      vertical-align: top;
      padding: 0 10px 0 0;
    }

    .facility-startup-info td:last-child {
      padding: 0 0 0 10px;
    }

    .facility-info, .startup-info {
      background: #fefefe;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
      width: 100%;
    }

    .detail-item {
      margin-bottom: 8px;
      font-size: 12px;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-size: 10px;
      font-weight: 500;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 2px;
    }

    .detail-value {
      font-size: 12px;
      font-weight: 500;
      color: #1f2937;
    }

    .amount-breakdown {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 15px;
    }

    .breakdown-header {
      background: #f9fafb;
      padding: 12px 15px;
      border-bottom: 1px solid #e5e7eb;
    }

    .breakdown-table {
      width: 100%;
      border-collapse: collapse;
    }

    .breakdown-table th {
      background: #f9fafb;
      padding: 10px 15px;
      text-align: left;
      font-size: 10px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .breakdown-table th:last-child {
      text-align: right;
    }

    .breakdown-table td {
      padding: 8px 15px;
      border-bottom: 1px solid #f3f4f6;
      font-size: 12px;
    }

    .breakdown-table td:last-child {
      text-align: right;
      font-weight: 500;
    }

    .subtotal-row {
      background: #f9fafb;
      font-weight: 500;
    }

    .total-row {
      background: #2563eb;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }

    .total-row td {
      border-bottom: none;
    }

    .payment-info {
      background: #ecfdf5;
      border: 1px solid #d1fae5;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .payment-details-grid {
      width: 100%;
    }

    .payment-details-grid table {
      width: 100%;
      border-collapse: collapse;
    }

    .payment-details-grid td {
      width: 50%;
      vertical-align: top;
      padding: 0 7.5px 0 0;
    }

    .payment-details-grid td:last-child {
      padding: 0 0 0 7.5px;
    }

    .payment-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 15px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .status-paid {
      background: #dcfce7;
      color: #166534;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-failed {
      background: #fecaca;
      color: #991b1b;
    }

    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #f3f4f6;
      text-align: center;
    }

    .footer p {
      color: #6b7280;
      font-size: 10px;
      margin-bottom: 4px;
    }

    .footer .company-name {
      color: #2563eb;
      font-weight: 600;
    }

    @media print {
      .invoice-container {
        padding: 15px;
        height: auto;
      }

      body {
        font-size: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Letterhead -->
    <div class="letterhead">
      <div class="company-info">
        <table>
          <tr>
            <td class="company-logo">
              <h1>CUMMA</h1>
            </td>
            <td class="company-details">
              <p><strong>Coworking & Startup Facilities</strong></p>
              <p>Email: support@cumma.in</p>
              <p>Website: www.cumma.in/affiliate/user/signIn</p>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Invoice Title -->
    <div class="invoice-title">
      <h2>INVOICE</h2>
    </div>

    <!-- Invoice Meta Information -->
    <div class="invoice-meta">
      <table>
        <tr>
          <td>
            <div class="invoice-details">
              <div class="section-title">Invoice Details</div>
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">Invoice Number:</td>
                    <td class="info-value">${invoiceNumber}</td>
                  </tr>
                </table>
              </div>
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">Date Issued:</td>
                    <td class="info-value">${formatDate(invoiceDate)}</td>
                  </tr>
                </table>
              </div>
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">Booking ID:</td>
                    <td class="info-value">${booking._id}</td>
                  </tr>
                </table>
              </div>
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">Payment Status:</td>
                    <td class="info-value"><span class="payment-status ${booking.paymentStatus === "paid" ? "status-paid" : booking.paymentStatus === "pending" ? "status-pending" : "status-failed"}">${booking.paymentStatus || "N/A"}</span></td>
                  </tr>
                </table>
              </div>
            </div>
          </td>
          <td>
            <div class="billing-info">
              <div class="section-title">Billed To</div>
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">Company:</td>
                    <td class="info-value">${startup.contactName || "N/A"}</td>
                  </tr>
                </table>
              </div>
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">Email:</td>
                    <td class="info-value">${startup.mailId || "N/A"}</td>
                  </tr>
                </table>
              </div>
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">WhatsApp:</td>
                    <td class="info-value">${booking.whatsappNumber || "N/A"}</td>
                  </tr>
                </table>
              </div>
              ${serviceProvider
            ? `
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">serviceProvider:</td>
                    <td class="info-value">${serviceProvider?.serviceName || "N/A"}</td>
                  </tr>
                </table>
              </div>
              `
            : ""
        }
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Facility and Startup Information -->
    <div class="facility-startup-info">
      <table>
        <tr>
          <td>
            <div class="facility-info">
              <div class="section-title">Facility Information</div>
              <div class="detail-item">
                <div class="detail-label">Facility Name</div>
                <div class="detail-value">${facility.details?.name || "N/A"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Type</div>
                <div class="detail-value">${facility.facilityType || "N/A"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value">${facility.address?.formatted || facility.address || "N/A"}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="startup-info">
              <div class="section-title">Booking Summary</div>
              <div class="detail-item">
                <div class="detail-label">Rental Plan</div>
                <div class="detail-value">${booking.rentalPlan || "N/A"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Unit Count</div>
                <div class="detail-value">${booking.unitCount || 1}</div>
              </div>
                <div class="detail-item">
                <div class="detail-label">Seat Count</div>
                <div class="detail-value">${bookingSeats || 1}</div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Amount Breakdown -->
    <div class="amount-breakdown">
      <div class="breakdown-header">
        <div class="section-title">Payment Breakdown</div>
      </div>
      <table class="breakdown-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base Amount</td>
            <td>${formatCurrency(originalBaseAmount)}</td>
          </tr>
          
          <tr>
            <td>GST (${gstAmount > 0 ? "18%" : "0%"})</td>
            <td>${formatCurrency(gstAmount)}</td>
          </tr>
          <tr class="subtotal-row">
            <td><strong>Calculated Total</strong></td>
            <td><strong>${formatCurrency(totalAmount)}</strong></td>
          </tr>
          <tr class="total-row">
            <td><strong>GRAND TOTAL</strong></td>
            <td><strong>${formatCurrency(totalAmount)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Information -->
    ${booking.paymentDetails
            ? `
    <div class="payment-info">
      <div class="section-title">Payment Information</div>
      <div class="payment-details-grid">
        <table>
          <tr>
            <td>
              <div class="detail-item">
                <div class="detail-label">Payment ID</div>
                <div class="detail-value">${booking.paymentDetails.razorpay_payment_id || "N/A"}</div>
              </div>
            </td>
            <td>
              <div class="detail-item">
                <div class="detail-label">Payment Method</div>
                <div class="detail-value">${booking.paymentDetails.method || "N/A"}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="detail-item">
                <div class="detail-label">Payment Date</div>
                <div class="detail-value">${formatDateTime(booking.paymentDetails.receivedAt)}</div>
              </div>
            </td>
            <td>
              <div class="detail-item">
                <div class="detail-label">Transaction Status</div>
                <div class="detail-value">${booking.paymentDetails.status || "N/A"}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    `
            : ""
        }

    <!-- Footer -->
    <div class="footer">
      <p>Thank you for choosing <span class="company-name">CUMMA</span> for your workspace needs!</p>
      <p>This is a computer-generated invoice and does not require a physical signature.</p>
      <p>For any queries, please contact us at support@cumma.in</p>
      <p><em>Generated on ${formatDateTime(new Date())}</em></p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateTemplate1InvoiceHTML(data) {
    const {
        booking,
        facility,
        startup,
        serviceProvider,
        invoiceNumber,
        invoiceDate,
    } = data;

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return "₹0.00";
        return `₹${Number(amount).toFixed(2)}`;
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        try {
            return new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return "N/A";
        }
    };

    const formatDateTime = (date) => {
        if (!date) return "N/A";
        try {
            return new Date(date).toLocaleString("en-IN", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "N/A";
        }
    };

    const originalBaseAmount = booking?.originalBaseAmount || 0;
    const serviceFee = booking?.serviceFee || 0;
    const bookingSeats = booking?.bookingSeats || 1;
    const gstAmount = booking?.gstAmount || 0;
    const totalAmount =
        booking?.amount || originalBaseAmount + serviceFee + gstAmount;
    const gstPercentage =
        gstAmount > 0
            ? Math.round((gstAmount / (originalBaseAmount + serviceFee)) * 100)
            : 0;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice</title>
  <style>
  @page {
    size: A4;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Arial, sans-serif;
    font-size: 20px;
    line-height: 1.4;
    color: #333;
    background: white;
  }

  .invoice-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 5mm;
    background: white;
    position: relative;
  }

  .header {
    width: 100%;
    border-bottom: 2px solid #000;
    padding-bottom: 15px;
    margin-bottom: 20px;
    position: relative;
    min-height: 120px;
  }

  .header-content {
    width: 65%;
    float: left;
  }

  .header-content h2 {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #000;
  }

  .header-content p {
    font-size: 15px;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .logo-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
  }

  .logo {
    max-width: 140px;
    max-height: 140px;
    object-fit: contain;
    display: block;
    margin-left: auto;
  }

  .clearfix::after {
    content: "";
    display: table;
    clear: both;
  }

  .addresses-container {
    width: 100%;
    margin-top: 20px;
  }

  .address-row {
    width: 100%;
  }

  .bill-to,
  .invoice-details {
    width: 48%;
    float: left;
    vertical-align: top;
  }

  .invoice-details {
    float: right;
  }

  .bill-to strong,
  .invoice-details strong {
    font-size: 20px;
    font-weight: bold;
    display: block;
    margin-bottom: 12px;
    color: #000;
  }

  .bill-to p,
  .invoice-details p {
    font-size: 16px;
    margin-bottom: 6px;
    line-height: 1.5;
  }

  .services-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 30px;
    font-size: 14px;
  }

  .services-table th,
  .services-table td {
    border: 1px solid #000;
    padding: 10px 8px;
    text-align: left;
    vertical-align: top;
  }

  .services-table th {
    background-color: #f5f5f5;
    font-weight: bold;
    color: #000;
  }

  .services-table .text-right {
    text-align: right;
  }

  .services-table .text-center {
    text-align: center;
  }

  .services-table td small {
    font-size: 15px;
    color: #666;
    display: block;
    margin-top: 3px;
  }

  .footer-section {
    width: 100%;
    margin-top: 30px;
  }

  .payment-summary-container {
    width: 100%;
  }

  .bank-details {
    width: 48%;
    float: left;
    font-size: 13px;
    vertical-align: top;
  }

  .bank-details strong {
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-bottom: 8px;
    color: #000;
  }

  .bank-details p {
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .summary-section {
    width: 48%;
    float: right;
  }

  .summary-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .summary-table tr td {
    padding: 6px 0;
    border: none;
  }

  .summary-table .label {
    text-align: left;
    width: 60%;
  }

  .summary-table .value {
    text-align: right;
    font-weight: bold;
    width: 40%;
  }

  .summary-table .total-row td {
    border-top: 2px solid #000;
    font-size: 16px;
    font-weight: bold;
    padding-top: 8px;
  }

  .notes {
    clear: both;
    margin-top: 40px;
    font-size: 13px;
    color: #555;
    line-height: 1.6;
  }

  .notes strong {
    font-size: 14px;
    color: #000;
  }

  .payment-status {
    color: #28a745;
    font-weight: bold;
  }
.notes1{
      margin-top: 200px;
      text-align: center;
}
.notes2
{     
font:smaller;
text-align: center;
}
  @media print {
    body {
      background: white;
    }

    .invoice-container {
      box-shadow: none;
      padding: 5mm;
    }

    .header,
    .addresses-container,
    .footer-section {
      page-break-inside: avoid;
    }
  }
</style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header Section -->
    <div class="header clearfix">
      <div class="header-content">
        <h2>${serviceProvider?.serviceName || "Service Provider Name"}</h2>
        <p>${serviceProvider?.address || "Address Line 1"}</p>
        <p>${serviceProvider?.city || "City"},-${serviceProvider.zipPostalCode} ${serviceProvider?.state || ""} ${serviceProvider?.country || ""}</p>
        <p>Email: ${serviceProvider?.primaryEmailId || "[E-MAIL]"}</p>
        <p>Phone: ${serviceProvider?.primaryContactNumber || "[PHONE]"}</p>
        ${serviceProvider?.website ? `<p>Website: ${serviceProvider.website}</p>` : ""}
      </div>
      <div class="logo-container">
        <img class="logo" src="${serviceProvider?.logoUrl || "/Frame 12.png"}" alt="Company Logo" />
      </div>
    </div>

    <!-- Address Section -->
    <div class="addresses-container clearfix">
      <div class="bill-to">
        <strong>Bill To:</strong>
        <p>${startup?.contactName || "Client Name"}</p>
        <p>Email: ${startup?.mailId || startup?.email || "[E-MAIL]"}</p>
        <p>Phone: ${startup?.contactNumber || booking?.whatsappNumber || "[PHONE]"}</p>
      </div>
      
      <div class="invoice-details">
        <strong>Invoice Details:</strong>
        <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
        <p><strong>Date:</strong> ${formatDate(invoiceDate)}</p>
        <p><strong>Facility:</strong> ${facility?.details?.name || "[Facility Name]"}</p>
        <p><strong>Booking Period:</strong> ${formatDate(booking?.startDate)} - ${formatDate(booking?.endDate)}</p>
        <p><strong>Seats:</strong> ${bookingSeats}</p>
      </div>
    </div>

    <!-- Services Table -->
    <table class="services-table">
      <thead>
        <tr>
          <th style="width: 40%;">Description</th>
          <th class="text-center" style="width: 10%;">Total Qty</th>
          <th class="text-right" style="width: 15%;">Overall Rate</th>
          <th class="text-center" style="width: 10%;">GST %</th>
        
          <th class="text-right" style="width: 15%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${facility?.details?.name || "Workspace Booking"}</strong>
            <small>Booking ID: ${booking?._id || "N/A"}</small>
            <small>Plan: ${booking?.rentalPlan || "N/A"}</small>
          </td>
          <td class="text-center">${bookingSeats}</td>
          <td class="text-right">${formatCurrency(originalBaseAmount)}</td>
          <td class="text-center">18%</td>
        
          <td class="text-right">${formatCurrency(totalAmount)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Footer Section -->
    <div class="footer-section clearfix">
      <div class="bank-details">
        <strong>Payment Instructions:</strong>
        ${serviceProvider?.bankDetails
            ? `
          <p><strong>Bank:</strong> ${serviceProvider.bankDetails.bankName || "N/A"}</p>
          <p><strong>Account No:</strong> ${serviceProvider.bankDetails.accountNumber || "N/A"}</p>
          <p><strong>IFSC Code:</strong> ${serviceProvider.bankDetails.ifsc || "N/A"}</p>
          ${serviceProvider.bankDetails.accountHolderName ? `<p><strong>Account Holder:</strong> ${serviceProvider.bankDetails.accountHolderName}</p>` : ""}
        `
            : `
          <p>Please contact us for payment details.</p>
        `
        }
      </div>

      <div class="summary-section">
        <table class="summary-table">
          <tr>
            <td class="label">Subtotal:</td>
            <td class="value">${formatCurrency(originalBaseAmount)}</td>
          </tr>
          
          <tr>
            <td class="label">GST (18%):</td>
            <td class="value">${formatCurrency(gstAmount)}</td>
          </tr>
          <tr class="total-row">
            <td class="label">Total Amount:</td>
            <td class="value">${formatCurrency(totalAmount)}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Notes Section -->
    <div class="notes">
      
      ${booking?.paymentStatus === "paid" ? `<br><br><strong>Payment Status:</strong> <span class="payment-status">PAID</span> on ${formatDateTime(booking?.paymentDetails?.receivedAt)}` : ""}
    </div>
   <p class="notes1">
      <strong>Notes:</strong>Thank you for choosing us for your workspace needs!
<div class="notes2">

            This is a computer-generated invoice and does not require a physical signature.
            
            For any queries, please contact us at support@cumma.in
            
            Generated on ${formatDateTime(new Date())}
</div>
    </p>
  </div>
</body>
</html>
  `;
}

function generateTemplate2InvoiceHTML(data) {
  const {
    booking,
    facility,
    startup,
    serviceProvider,
    invoiceNumber,
    invoiceDate,
  } = data;

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return `₹${Number(amount).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const originalBaseAmount = booking?.originalBaseAmount || 0;
  const serviceFee = booking?.serviceFee || 0;
  const bookingSeats = booking?.bookingSeats || 1;
  const gstAmount = booking?.gstAmount || 0;
  const totalAmount =
  booking?.amount || originalBaseAmount + serviceFee + gstAmount;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Invoice</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        background: white;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #333;
      }

      .invoice-container {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: white;
      }

      .main-content {
        padding: 5mm;
      }

      .header {
        width: 100%;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #000;
        display: table;
        table-layout: fixed;
      }

      .header-left, .header-right {
        display: table-cell;
        vertical-align: top;
      }

      .header-left {
        width: 70%;
      }

      .header-right {
        width: 30%;
        text-align: right;
      }

      .logo img {
        width: 140px;
        height: auto;
        max-height: 140px;
      }

      h1 {
        font-size: 36px;
        color: #555;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .invoice-number,
      .invoice-date {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .company-details {
        font-size: 14px;
        line-height: 1.4;
        color: #666;
      }

      .section {
        margin-top: 25px;
      }

      .addresses {
        margin: 30px 0;
        width: 100%;
        display: table;
        table-layout: fixed;
      }

      .from, .to {
        display: table-cell;
        vertical-align: top;
        width: 50%;
        font-size: 16px;
        line-height: 1.8;
      }

      .from strong, .to strong {
        font-size: 18px;
        display: block;
        margin-bottom: 10px;
        color: #333;
      }

      .table {
        margin-top: 40px;
        border-collapse: collapse;
        width: 100%;
        font-size: 16px;
      }

      .table th, .table td {
        border: 2px solid #000;
        padding: 15px 12px;
        text-align: left;
        vertical-align: top;
      }

      .table th {
        background: #000;
        color: #fff;
        font-weight: bold;
      }

      .right {
        text-align: right;
      }

      .center {
        text-align: center;
      }

      .total {
        margin-top: 30px;
        border-top: 3px solid #000;
        padding-top: 15px;
        font-size: 20px;
        font-weight: bold;
        text-align: right;
      }

      .bank-details {
        margin-top: 40px;
        font-size: 15px;
      }

      .bank-details strong {
        font-size: 18px;
        display: block;
        margin-bottom: 15px;
      }

      .bank-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      .bank-table td {
        padding: 8px 12px;
        border: none;
        font-size: 15px;
      }

      .bank-label {
        width: 25%;
        font-weight: bold;
      }

      .note {
        margin-top: 150px;
        font-size: 15px;
        line-height: 1.8;
      }

      .note strong {
        font-size: 16px;
      }

      .stamp-signature {
        margin-top: 40px;
        text-align: right;
      }

      .stamp-signature img {
        height: 80px;
        vertical-align: middle;
        margin-right: 20px;
      }

      .signature-text {
        display: inline-block;
        font-weight: bold;
        font-size: 16px;
        vertical-align: middle;
      }

      hr {
        border: none;
        border-top: 2px solid #000;
        margin: 30px 0;
      }
          .notes1{
            text-align: center;
            margin-top: 10px;
            font-size: smaller;
      }
            .notes{
      margin-top: 150px;

}
.notes{
      text-align: center;
}
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="main-content">
        <div class="header">
          <div class="header-left">
            <h1>Invoice</h1>
            <div class="invoice-number">${invoiceNumber}</div>
            <div class="invoice-date"><strong>Date:</strong> ${formatDate(invoiceDate)}</div>
            ${
              serviceProvider &&
              (serviceProvider.cin ||
                serviceProvider.tan ||
                serviceProvider.pan)
                ? `
              <div class="company-details">
                ${serviceProvider.cin ? `CIN - ${serviceProvider.cin}<br />` : ""}
                ${serviceProvider.tan ? `TAN - ${serviceProvider.tan}<br />` : ""}
                ${serviceProvider.pan ? `PAN - ${serviceProvider.pan}` : ""}
              </div>`
                : ""
            }
          </div>
          <div class="header-right">
            <div class="logo">
              <img src=${serviceProvider.logoUrl} alt="Logo" />
            </div>
          </div>
        </div>

        <div class="addresses section">
          <div class="from">
            <strong>From</strong>
            <p>
              ${serviceProvider?.serviceName || "Service Provider Name"}<br />
              ${serviceProvider?.address || "Address Line 1"}<br />
              ${serviceProvider?.city ? `${serviceProvider.city}, ${serviceProvider.state || ""} - ${serviceProvider.zipPostalCode || ""}` : "City, State - Postal Code"}<br />
              ${serviceProvider?.country || "India"}<br />
              ${serviceProvider?.primaryContactNumber || "Phone Number"}
            </p>
          </div>
          <div class="to">
            <strong>To</strong>
            <p>
              ${startup?.startupName || "CLIENT COMPANY NAME"}<br />
              ${startup?.address || "Client Address Line 1"}<br />
              ${startup?.city ? `${startup.city}, ${startup.state || ""} - ${startup.pincode || ""}` : "City, State - Postal Code"}<br />
              ${startup?.country || "Country"}
            </p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 50%;">Description</th>
              <th style="width: 10%;" class="center">Qty</th>
              <th style="width: 16%;" class="right">Price</th>
              <th style="width: 10%;" class="center">GST</th>
              <th style="width: 24%;" class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                ${facility?.details?.name || "Workspace Service"}<br />
                <small>Booking Period: ${formatDate(booking?.startDate)} - ${formatDate(booking?.endDate)}</small><br />
                <small>Facility Type: ${facility?.facilityType || "N/A"}</small><br />
                <small>Location: ${facility?.address?.formatted || facility?.address || "N/A"} , ${facility?.city}, ${facility?.pincode}</small>
               
              </td>
              <td class="center">${bookingSeats}</td>
              <td class="right">${formatCurrency(originalBaseAmount)}</td>
              <td class="center">18%</td>
              <td class="right">${formatCurrency(totalAmount)}</td>
            </tr>
          </tbody>
        </table>
        
        

        <div class="total">TOTAL: ${formatCurrency(totalAmount)}</div>

        ${
          serviceProvider?.bankDetails
            ? `
        <div class="bank-details">
          <strong>Bank Details:</strong>
          <table class="bank-table">
            <tr><td class="bank-label">Name:</td><td>${serviceProvider.name || serviceProvider.bankDetails.accountHolderName || "N/A"}</td></tr>
            <tr><td class="bank-label">Bank:</td><td>${serviceProvider.bankDetails.bankName || "N/A"}</td></tr>
            <tr><td class="bank-label">Branch:</td><td>${serviceProvider.bankDetails.branch || "N/A"}</td></tr>
            <tr><td class="bank-label">A/c No:</td><td>${serviceProvider.bankDetails.accountNumber || "N/A"}</td></tr>
            <tr><td class="bank-label">IFSC:</td><td>${serviceProvider.bankDetails.ifsc || "N/A"}</td></tr>
          </table>
        </div>`
            : ""
        }

        ${
          serviceProvider?.serviceName
            ? `
        <div class="stamp-signature">
          <div class="signature-text">${serviceProvider.serviceName}</div>
        </div>`
            : ""
        }

        <div class="note">
        ${booking?.paymentStatus === "paid" ? `<br><strong>Payment Status:</strong> <span style="color: green;">PAID</span> on ${formatDateTime(booking?.requestedAt)}` : ""}
        </div>
        </div>
        <div class="notes">
            <strong>Notes:</strong> Thank you for choosing us for your workspace needs!
            <div class="notes1">This is a computer-generated invoice and does not require a physical signature.

For any queries, please contact us at support@cumma.in

Generated on ${formatDateTime(new Date())}</div>
      </div>
        </div>
  </body>
</html>`;
}





