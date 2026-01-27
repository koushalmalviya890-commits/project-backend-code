const express = require('express');
const router = express.Router();
const { 
  getServiceProviderProfile, 
  updateServiceProviderProfile 
} = require('../controllers/serviceProviderController');
const { protect } = require('../middleware/authMiddleware'); // The middleware using JWT_SECRET

// Profile routes
router.get('/profile', protect, getServiceProviderProfile);
router.patch('/profile', protect, updateServiceProviderProfile);

module.exports = router;