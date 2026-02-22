function generateProfessionalInvoiceHTML(data) {
  const {
    booking,
    facility,
    startup,
    serviceProvider,
    invoiceNumber,
    invoiceDate,
    logoUrl,
  } = data;

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "Rs. 0.00";
    return `Rs. ${Number(amount).toFixed(2)}`;
  };

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

  const serviceFee = booking.serviceFee || 0;
  const originalBaseAmount = booking.baseAmount || 0;
  const gstOnServiceFee = serviceFee * 0.18;
  const gstAmount = booking.gstAmount || 0;
  const totalGst = gstAmount;

  const totalAmount = Number(booking.finalAmount ?? booking.amount ?? 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber}</title>
   <style>

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
      font-family: Arial, 'Segoe UI', -apple-system, sans-serif;
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
      font-family: Arial, 'Segoe UI', -apple-system, sans-serif;
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
      font-family: Arial, 'Segoe UI', -apple-system, sans-serif;
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
      font-family: Arial, 'Segoe UI', -apple-system, sans-serif;
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
              ${logoUrl ? `<img src="${logoUrl}" alt="Cumma Logo" style="height:50px;max-width:180px;object-fit:contain;" />` : `<h1>CUMMA</h1>`}
            </td>
            <td class="company-details">
               <p style="font-size: small; font-weight: 500;">Idamumai Technologies Private limited</p>
              <p>46A, Anna Nagar, 2nd St, Linganoor, Vadavalli, Coimbatore, Tamil Nadu 641041</p>
              <p>Email: support@cumma.in / <span>Phone: +91 87549 47666</span></p>
              <p>Website: www.cumma.in</p>
              <p>GST NO: 33AAHCI8945G1ZC</p>
              <p>CIN: U62099TZ2024PTC032779</p>
              <p>PAN: AAHCI8945G</p>
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
                    <td class="info-value">${startup.startupName || "N/A"}</td>
                  </tr>
                </table>
              </div>
              <div class="info-row">
                <table>
                  <tr>
                    <td class="info-label">Email:</td>
                    <td class="info-value">${startup.startupMailId || startup.email || "N/A"}</td>
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
                            ${
                              startup.gstnumber
                                ? `
<div class="info-row">
    <table>
      <tr>
        <td class="info-label">GST NO:</td>
        <td class="info-value">${startup.gstnumber}</td>
      </tr>
    </table>
</div>
`
                                : ""
                            }
             <div class="info-row">
    <table>
      <tr>
        <td class="info-label">Startup Address:</td>
        <td class="info-value">${startup?.address}</td>
      </tr>
    </table>
</div>
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
                <div class="detail-label">Service Provider Name</div>
                <div class="detail-value">${serviceProvider?.serviceName || "N/A"}</div>
              </div>
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
                <div class="detail-label">Duration Count</div>
                <div class="detail-value">${booking.unitCount || 1}</div>
              </div>
                <div class="detail-item">
                <div class="detail-label">Booking Count</div>
                <div class="detail-value">${booking.bookingSeats || 1}</div>
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
            <td>GST (${totalGst > 0 ? "18%" : "0%"})</td>
            <td>${formatCurrency(totalGst)}</td>
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
    ${
      booking.paymentDetails
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

module.exports = {
  generateProfessionalInvoiceHTML,
};
