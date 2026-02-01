const express = require('express');
const router = express.Router();
const { 
  getServiceProviderProfile, 
  updateServiceProviderProfile,
  getEarnings
} = require('../controllers/serviceProviderController');
const { protect } = require('../middleware/authMiddleware'); // The middleware using JWT_SECRET

// Profile routes
router.get('/profile', protect, getServiceProviderProfile);
router.patch('/profile', protect, updateServiceProviderProfile);
router.get('/earnings', protect, getEarnings);

module.exports = router;