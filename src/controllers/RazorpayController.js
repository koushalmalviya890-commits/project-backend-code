const mongoose = require("mongoose");
// controllers/paymentController.js
const Razorpay = require('razorpay');
const Booking = require('../models/Booking'); 
const Facility = require('../models/Facility');
const Startup = require('../models/Startup');
const ServiceProvider = require('../models/ServiceProvider'); // or User model if that's where providers are
const Notification = require('../models/Notification'); // Ensure y
const { generateAndStoreInvoice } = require("../../services/invoiceService");
const { verifyPaymentSignature } = require("../../utils/razorpay");


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

    const userId = user._id || user.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in request' });
    }

    // 2. Extract Data from Request Body
    // Note: We ignore 'bookingId' from body because we will create/find it here
const {
      facilityId, rentalPlan, unitCount, unitLabel,
      bookingSeats, bookingUnitLabel, startDate, endDate,
      contactNumber, originalBaseAmount, baseAmount,
      perUnitPrice, serviceFee, gstAmount, totalBeforeDiscount,
      discount, amount, couponApplied
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
      startupId: userId,
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
      startupId: userId,
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
    } else {
      // Create new
      finalBookingDoc = await Booking.create(bookingData);
    }

    // ✅ FIX 2: Ensure doc exists before accessing _id
    if (!finalBookingDoc || !finalBookingDoc._id) {
      throw new Error("Failed to save booking to database");
    }
    
    bookingId = finalBookingDoc._id.toString();

    // 7. Generate Razorpay Order
    const amountInPaise = Math.round(amount * 100); 

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise, 
      currency: 'INR',
      receipt: bookingId, 
      notes: {
        bookingId: bookingId,
        facilityId: facilityId,
        startupId: userId.toString(),
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ isValid: false, message: 'Missing signature data' });
    }

    const booking = await Booking.findOne({ 
      _id: bookingId, 
      razorpayOrderId: razorpay_order_id 
    });

    if (!booking) {
      return res.status(404).json({ isValid: false, message: 'Booking not found or order ID mismatch' });
    }

    const isValid = await verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      console.error(`Signature verification failed for booking ${bookingId}`);
      
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'failed',
        paymentDetails: {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          verificationError: 'Signature verification failed',
          errorTimestamp: new Date()
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Allow retry for 24 hours
        updatedAt: new Date()
      });

      return res.status(400).json({ isValid: false, message: 'Invalid signature' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          paymentStatus: 'completed',
          status: 'pending', // Auto-approve logic
          expiresAt: null,    // Remove expiration
          paymentDetails: {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            verifiedAt: new Date(),
            status: 'captured'
          },
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    setImmediate(async () => {
      try {
        console.log("🧾 Generating invoice for booking:", bookingId);

        const result = await generateAndStoreInvoice(bookingId);

        if (result.success) {
          console.log("✅ Invoice Generated:", result.invoiceUrl);
        } else {
          console.log("❌ Invoice Failed:", result.message);
        }
      } catch (err) {
        console.error("❌ Invoice generation error:", err);
      }
    }).unref();

    return res.status(200).json({
      isValid: true,
      success: true,
      message: "Signature verified",
      booking: updatedBooking,
    });

  // runPostBookingTasks(updatedBooking).catch(err => 
  //     console.error(`Background task error for booking ${bookingId}:`, err)
  //   );

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    
    // Attempt to record the error in the booking if possible
    if (req.body.bookingId) {
      await Booking.findByIdAndUpdate(req.body.bookingId, {
        paymentStatus: 'verification_failed',
        'paymentDetails.verificationError': error.message
      }).catch(() => {});
    }

    return res.status(500).json({ isValid: false, message: 'Verification failed', error: error.message });
  }
};