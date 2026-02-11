const crypto = require("crypto");
const Booking = require("../models/Booking");

// Correct invoice service import
const { generateAndStoreInvoice } = require("../../services/invoiceService");

async function razorpayWebhookHandler(req, res) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET missing in env");
      return res.status(500).json({ error: "Webhook secret missing" });
    }

    const razorpaySignature = req.headers["x-razorpay-signature"];

    if (!razorpaySignature) {
      return res.status(400).json({ error: "Missing Razorpay signature" });
    }

    // req.body must be Buffer (from express.raw middleware)
    const rawBody = req.body.toString("utf8");

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret.trim())
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.error("Invalid Razorpay webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log("✅ Razorpay Webhook Received:", event);

    if (event === "payment.authorized") {
      await handlePaymentAuthorized(payload.payload.payment.entity);
    } else if (event === "payment.failed") {
      await handlePaymentFailed(payload.payload.payment.entity);
    } else if (event === "refund.created") {
      await handleRefundCreated(payload.payload.refund.entity);
    } else {
      console.log("Unhandled Razorpay webhook event:", event);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return res.status(500).json({ error: "Failed to process webhook" });
  }
}

// ------------------------------------------
// payment.authorized handler
// ------------------------------------------
async function handlePaymentAuthorized(payment) {
  try {
    const orderId = payment.order_id;

    if (!orderId) {
      console.error("payment.authorized: missing order_id");
      return;
    }

    const booking = await Booking.findOne({ razorpayOrderId: orderId });

    if (!booking) {
      console.error(
        `payment.authorized: Booking not found for order ${orderId}`,
      );
      return;
    }

    console.log(`✅ payment.authorized booking found: ${booking._id}`);

    booking.paymentStatus = "completed";
    booking.expiresAt = null;

    booking.paymentDetails = {
      razorpay_payment_id: payment.id,
      razorpay_order_id: orderId,
      method: payment.method,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      receivedAt: new Date(),
    };

    booking.updatedAt = new Date();
    await booking.save();

    // Generate invoice after payment completed
    try {
      console.log(`🧾 Generating invoice for booking ${booking._id}`);
      await generateAndStoreInvoice(booking._id.toString());
    } catch (invoiceErr) {
      console.error("Invoice generation failed:", invoiceErr);
    }
  } catch (err) {
    console.error("handlePaymentAuthorized error:", err);
  }
}

// ------------------------------------------
// payment.failed handler
// ------------------------------------------
async function handlePaymentFailed(payment) {
  try {
    const orderId = payment.order_id;

    if (!orderId) return;

    const booking = await Booking.findOne({ razorpayOrderId: orderId });

    if (!booking) {
      console.error(`payment.failed: Booking not found for order ${orderId}`);
      return;
    }

    booking.paymentStatus = "failed";
    booking.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    booking.paymentDetails = {
      razorpay_payment_id: payment.id,
      razorpay_order_id: orderId,
      method: payment.method,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      failureReason: payment.error_description || payment.error_code,
      failedAt: new Date(),
    };

    booking.updatedAt = new Date();
    await booking.save();

    console.log(`❌ payment.failed updated booking ${booking._id}`);
  } catch (err) {
    console.error("handlePaymentFailed error:", err);
  }
}

// ------------------------------------------
// refund.created handler
// ------------------------------------------
async function handleRefundCreated(refund) {
  try {
    const paymentId = refund.payment_id;

    if (!paymentId) return;

    const booking = await Booking.findOne({
      "paymentDetails.razorpay_payment_id": paymentId,
    });

    if (!booking) {
      console.error(
        `refund.created: Booking not found for payment ${paymentId}`,
      );
      return;
    }

    booking.refundStatus = "completed";

    booking.refundDetails = {
      razorpay_refund_id: refund.id,
      razorpay_payment_id: paymentId,
      amount: refund.amount / 100,
      currency: refund.currency,
      status: refund.status,
      reason: refund.notes?.reason || "Not specified",
      refundedAt: new Date(),
    };

    booking.updatedAt = new Date();
    await booking.save();

    console.log(`💰 refund.created updated booking ${booking._id}`);
  } catch (err) {
    console.error("handleRefundCreated error:", err);
  }
}

module.exports = {
  razorpayWebhookHandler,
};
