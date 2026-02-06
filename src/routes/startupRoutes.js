const express = require('express');
const { getStartupProfile, updateStartupProfile, getStartupBookings } = require('../controllers/startupController');
const { protect } = require('../middleware/authMiddleware.js'); 
const router = express.Router();

router.get('/profile', protect, getStartupProfile);
router.patch('/profile', protect, updateStartupProfile);
router.get("/bookings/:userId", getStartupBookings);

module.exports = router;
