const express = require('express');
const router = express.Router();
const { calculateFinalPrice } = require('../controllers/pricingController');
// Use optionalAuth if you want to allow guests, or protect if login is mandatory
const { protect, optionalProtect } = require('../middleware/authMiddleware'); 

// If you want to allow guests (no login), you might need a middleware 
// that checks for token but doesn't crash if missing.
// For now, let's assume 'protect' is okay, or you can create 'optionalProtect'.
router.post('/calculate-detail', optionalProtect, calculateFinalPrice);

module.exports = router;