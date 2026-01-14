const mongoose = require("mongoose");
const { verifyPaymentSignature } = require("../../utils/razorpay");


// controllers/paymentController.js
const Razorpay = require('razorpay');


// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a Razorpay order for a facility booking
 * Called by Next.js after session validation and DB booking creation
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { bookingId, totalAmount, currency = 'INR', receipt, notes = {} } = req.body;

    // 🔹 Validation
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Valid totalAmount is required' });
    }

    // 🔹 Generate Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // INR to paise
      currency,
      receipt: receipt || bookingId,
      notes: {
        source: 'nextjs-facility-booking',
        ...notes,
      },
    });

    if (!razorpayOrder) {
      return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }

    // 🔹 Structured response
    res.status(201).json({
      message: 'Razorpay order created successfully',
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
      },
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({
      message: 'Error creating payment order',
      error: error.message,
    });
  }
};




/**
 * Creates a Razorpay order for a booking retry
 * Called by Next.js after validation and retry eligibility check
 */
exports.createRetryRazorpayOrder = async (req, res) => {
  try {
    const { bookingId, amount, currency = 'INR', receipt, notes = {} } = req.body;

    // 🔹 Validation
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // 🔹 Generate Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // INR to paise
      currency,
      receipt: receipt || bookingId,
      notes: {
        source: 'nextjs-booking-retry',
        ...notes,
      },
    });

    if (!razorpayOrder) {
      return res.status(500).json({ message: 'Failed to create retry order' });
    }

    // 🔹 Structured response
    res.status(201).json({
      message: 'Razorpay retry order created successfully',
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
      },
    });
  } catch (error) {
    console.error('❌ Error creating retry Razorpay order:', error);
    res.status(500).json({
      message: 'Error creating retry payment order',
      error: error.message,
    });
  }
};




/**
 * Verifies Razorpay payment signature
 * Called by Next.js during payment verification
 */
exports.verifyPaymentSignatureFacilityBooking= async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ isValid: false, message: 'Missing signature data' });
    }

    const isValid = await verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return res.status(400).json({ isValid: false, message: 'Invalid signature' });
    }

    return res.status(200).json({ isValid: true, message: 'Signature verified' });
  } catch (error) {
    console.error('❌ Error verifying payment signature:', error);
    return res.status(500).json({ isValid: false, message: 'Verification failed', error: error.message });
  }
};
