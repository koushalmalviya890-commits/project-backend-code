const express = require('express');
const { getStartupProfile, updateStartupProfile } = require('../controllers/startupController');
const { protect } = require('../middleware/authMiddleware.js'); // The middleware we wrote earlier

const router = express.Router();

// Routes are now protected by our JWT cookie verification
router.get('/profile', protect, getStartupProfile);
router.patch('/profile', protect, updateStartupProfile);

module.exports = router;