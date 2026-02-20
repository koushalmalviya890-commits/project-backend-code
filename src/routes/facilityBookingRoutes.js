const express = require('express');
const router = express.Router();
const RazorpayController = require('../controllers/RazorpayController');
const { protect } = require('../middleware/authMiddleware');
// Route to create Razorpay order
router.post('/payments/create-order', protect, RazorpayController.createRazorpayOrder);
router.post('/payments/create-retry-order', protect, RazorpayController.createRetryRazorpayOrder);
router.post('/payments/verify-signature',protect, RazorpayController.verifyPaymentSignatureFacilityBooking);
router.post('/payments/mark-failed', protect, RazorpayController.markPaymentFailed);
module.exports = router;