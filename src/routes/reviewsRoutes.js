const express = require("express");
const router = express.Router();

const { getReviews } = require("../controllers/reviewsController");
const { protect } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);
router.get("/reviews", getReviews);

module.exports = router;
