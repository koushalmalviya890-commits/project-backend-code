const mongoose = require("mongoose");
const { verifyPaymentSignature } = require("../../utils/razorpay");


// controllers/paymentController.js
const Razorpay = require('razorpay');
const Booking = require('../models/Booking'); 
const Facility = require('../models/Facility');


// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a Razorpay order for a facility booking
 * Called by Next.js after session validation and DB booking creation
 */
// exports.createRazorpayOrder = async (req, res) => {
//   try {
//     const { bookingId, totalAmount, currency = 'INR', receipt, notes = {} } = req.body;

//     // 🔹 Validation
//     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//       return res.status(400).json({ message: 'Invalid booking ID' });
//     }

//     if (!totalAmount || totalAmount <= 0) {
//       return res.status(400).json({ message: 'Valid totalAmount is required' });
//     }

//     // 🔹 Generate Razorpay Order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(totalAmount * 100), // INR to paise
//       currency,
//       receipt: receipt || bookingId,
//       notes: {
//         source: 'nextjs-facility-booking',
//         ...notes,
//       },
//     });

//     if (!razorpayOrder) {
//       return res.status(500).json({ message: 'Failed to create Razorpay order' });
//     }

//     // 🔹 Structured response
//     res.status(201).json({
//       message: 'Razorpay order created successfully',
//       order: {
//         id: razorpayOrder.id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         receipt: razorpayOrder.receipt,
//         status: razorpayOrder.status,
//       },
//     });
//   } catch (error) {
//     console.error('❌ Error creating Razorpay order:', error);
//     res.status(500).json({
//       message: 'Error creating payment order',
//       error: error.message,
//     });
//   }
// };




// /**
//  * Creates a Razorpay order for a booking retry
//  * Called by Next.js after validation and retry eligibility check
//  */
// exports.createRetryRazorpayOrder = async (req, res) => {
//   try {
//     const { bookingId, amount, currency = 'INR', receipt, notes = {} } = req.body;

//     // 🔹 Validation
//     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//       return res.status(400).json({ message: 'Invalid booking ID' });
//     }

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: 'Valid amount is required' });
//     }

//     // 🔹 Generate Razorpay Order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(amount * 100), // INR to paise
//       currency,
//       receipt: receipt || bookingId,
//       notes: {
//         source: 'nextjs-booking-retry',
//         ...notes,
//       },
//     });

//     if (!razorpayOrder) {
//       return res.status(500).json({ message: 'Failed to create retry order' });
//     }

//     // 🔹 Structured response
//     res.status(201).json({
//       message: 'Razorpay retry order created successfully',
//       order: {
//         id: razorpayOrder.id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         receipt: razorpayOrder.receipt,
//         status: razorpayOrder.status,
//       },
//     });
//   } catch (error) {
//     console.error('❌ Error creating retry Razorpay order:', error);
//     res.status(500).json({
//       message: 'Error creating retry payment order',
//       error: error.message,
//     });
//   }
// };




// /**
//  * Verifies Razorpay payment signature
//  * Called by Next.js during payment verification
//  */
// exports.verifyPaymentSignatureFacilityBooking= async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ isValid: false, message: 'Missing signature data' });
//     }

//     const isValid = await verifyPaymentSignature({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     });

//     if (!isValid) {
//       return res.status(400).json({ isValid: false, message: 'Invalid signature' });
//     }

//     return res.status(200).json({ isValid: true, message: 'Signature verified' });
//   } catch (error) {
//     console.error('❌ Error verifying payment signature:', error);
//     return res.status(500).json({ isValid: false, message: 'Verification failed', error: error.message });
//   }
// };

/**
 * Creates a Booking AND Razorpay Order
 * (Upgraded to handle full booking logic)
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    // 1. Auth Check (Assumes you are using the 'protect' middleware)
    const user = req.user;
    
    // Safety check: ensure middleware populated user
    if (!user || user.userType !== 'startup') {
      return res.status(401).json({ message: 'Unauthorized: Only startups can book facilities' });
    }

    // 2. Extract Data from Request Body
    // Note: We ignore 'bookingId' from body because we will create/find it here
    const {
      facilityId, rentalPlan, unitCount, unitLabel,
      bookingSeats, bookingUnitLabel, startDate, endDate,
      contactNumber, originalBaseAmount, baseAmount,
      perUnitPrice, serviceFee, gstAmount, gstOnServiceFee,
      totalBeforeDiscount, discount, amount, couponApplied
    } = req.body;

    // 3. Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(facilityId)) {
      return res.status(400).json({ message: 'Invalid Facility ID' });
    }

    // 4. Find Facility (to get Incubator ID)
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // 5. Construct Booking Data
    const bookingData = {
      facilityId: facility._id,
      startupId: user.id, 
      incubatorId: facility.serviceProviderId,
      rentalPlan,
      unitCount: unitCount || 1,
      unitLabel,
      bookingSeats,
      bookingUnitLabel,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'pending',
      paymentStatus: 'pending',
      originalBaseAmount, 
      baseAmount, 
      perUnitPrice,
      serviceFee, 
      gstAmount, 
      totalBeforeDiscount,
      discount, 
      amount,
      whatsappNumber: contactNumber,
      couponApplied: couponApplied || null,
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins expiry
    };

    // 6. Idempotency: Reuse existing pending booking if user retries
    let bookingId;
    let finalBookingDoc;

    const existingBooking = await Booking.findOne({
      startupId: user._id,
      facilityId: facility._id,
      paymentStatus: 'pending',
      amount: amount,
      // Optional: Strict date matching
      startDate: new Date(startDate) 
    });

    if (existingBooking) {
      // Update existing
      Object.assign(existingBooking, bookingData);
      existingBooking.updatedAt = new Date();
      finalBookingDoc = await existingBooking.save();
      bookingId = finalBookingDoc._id.toString();
    } else {
      // Create new
      finalBookingDoc = await Booking.create(bookingData);
      bookingId = finalBookingDoc._id.toString();
    }

    // 7. Generate Razorpay Order
    const amountInPaise = Math.round(amount * 100); 

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise, 
      currency: 'INR',
      receipt: bookingId, 
      notes: {
        bookingId: bookingId,
        facilityId: facilityId,
        startupId: user._id.toString(),
        source: 'express-payment-controller',
        rentalPlan: rentalPlan
      },
    });

    if (!razorpayOrder) {
      throw new Error('Failed to create Razorpay order');
    }

    // 8. Update Booking with Order ID
    await Booking.findByIdAndUpdate(bookingId, {
      razorpayOrderId: razorpayOrder.id,
      updatedAt: new Date()
    });

    // 9. Return Response (Compatible with your Frontend)
    // We explicitly map the response to match what your frontend expects
    res.status(201).json({
      message: 'Razorpay order created successfully',
      // Return these top-level fields for your frontend convenience
      orderId: razorpayOrder.id,
      bookingId: bookingId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      
      // Keep existing structure for backward compatibility if needed
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
      },
    });

  } catch (error) {
    console.error('❌ Error creating booking/order:', error);
    res.status(500).json({
      message: 'Error creating payment order',
      error: error.message,
    });
  }
};

/**
 * Creates a Razorpay order for a booking retry
 * (Kept mostly as-is, just ensures IDs are valid)
 */
exports.createRetryRazorpayOrder = async (req, res) => {
  try {
    const { bookingId, amount, currency = 'INR', receipt, notes = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || bookingId,
      notes: {
        source: 'booking-retry',
        ...notes,
      },
    });

    if (!razorpayOrder) {
      return res.status(500).json({ message: 'Failed to create retry order' });
    }

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
 */
exports.verifyPaymentSignatureFacilityBooking = async (req, res) => {
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