const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createReview, getReviews } = require('../controllers/reviewsController');

// POST /api/reviews - Submit a review
router.post('/', protect, createReview);

// GET /api/reviews - Get reviews for a facility
// Keep 'protect' if you only want logged-in users to see reviews
router.get('/', getReviews);

module.exports = router;