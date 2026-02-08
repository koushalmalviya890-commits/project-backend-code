const express = require('express');
const { getStartupProfile, updateStartupProfile, getStartupBookings, getStartupByUserId } = require('../controllers/startupController');
const { protect } = require('../middleware/authMiddleware.js'); 
const router = express.Router();

router.get('/profile', protect, getStartupProfile);
router.patch('/profile', protect, updateStartupProfile);
router.get("/bookings/:userId", getStartupBookings);
router.get('/startup_by_userid', protect, getStartupByUserId);

module.exports = router;
