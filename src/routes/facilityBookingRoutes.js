const express = require('express');
const router = express.Router();
const RazorpayController = require('../controllers/RazorpayController');

// Route to create Razorpay order
router.post('/payments/create-order', RazorpayController.createRazorpayOrder);
router.post('/payments/create-retry-order', RazorpayController.createRetryRazorpayOrder);
router.post('/payments/verify-signature',RazorpayController.verifyPaymentSignatureFacilityBooking);

module.exports = router;