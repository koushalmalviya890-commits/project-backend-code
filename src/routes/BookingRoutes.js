const express = require("express");
const router = express.Router();

const {protect} = require("../middleware/authMiddleware");

const {
  updateBookingStatusController,
} = require("../controllers/BookingController");

const {
  createBookingController,
} = require("../controllers/BookingCreateController");

const {
  getBookingsController,
} = require("../controllers/BookingListController");

const {
  getBookingByIdController,
} = require("../controllers/BookingDetailController");

const {
  getFailedBookingController,
} = require("../controllers/BookingFailedController");

// ---------------- ROUTES ----------------




// Status update
router.post("/update-status", protect, updateBookingStatusController);

// Create booking
router.post("/", protect, createBookingController);

// List bookings
router.get("/", protect, getBookingsController);

// Failed payments (MUST COME BEFORE :id)
router.get("/failed", protect, getFailedBookingController);

// Booking detail (LAST)
router.get("/:id", protect, getBookingByIdController);

module.exports = router;
