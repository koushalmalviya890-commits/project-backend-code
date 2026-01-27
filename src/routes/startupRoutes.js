const express = require("express");
const router = express.Router();

// const authMiddleware = require("../middlewares/authmiddleware");
const {
  getProfile,
  updateProfile,
  getStartupBookings,
} = require("../controllers/startupController");

router.get("/profile/:userId", getProfile);
router.patch("/profile/:userId", updateProfile);
router.get("/bookings/:userId", getStartupBookings);

module.exports = router;
