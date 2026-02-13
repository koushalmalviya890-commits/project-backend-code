const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const verifyWebhookSignature = require("../middleware/verifyWebhookSignature");

const {
  createBooking,
  getBookings,
  getBookingById,
  getFailedBooking,
  updateBookingStatus,
} = require("../controllers/BookingController");

//router.post("/update-status", verifyWebhookSignature, updateBookingStatus);

router.post("/update-status", protect, updateBookingStatus);

// ----------------------------
// Booking CRUD Routes
// ----------------------------

// Create Booking
router.post("/", protect, createBooking);

// List Bookings
router.get("/", protect, getBookings);

// Failed Payments (STATIC route MUST come before :id)
router.get("/failed", protect, getFailedBooking);

// Booking Details (Dynamic route LAST)
router.get("/:id", protect, getBookingById);

module.exports = router;

// const {
//   updateBookingStatusController,
// } = require("../controllers/BookingController");

// const {
//   createBookingController,
// } = require("../controllers/BookingCreateController");

// const {
//   getBookingsController,
// } = require("../controllers/BookingListController");

// const {
//   getBookingByIdController,
// } = require("../controllers/BookingDetailController");

// const {
//   getFailedBookingController,
// } = require("../controllers/BookingFailedController");

// // ---------------- ROUTES ----------------

// // console.log("authMiddleware:", protect);
// // console.log("updateBookingStatusController:", updateBookingStatusController);
// // console.log("createBookingController:", createBookingController);
// // console.log("getBookingsController:", getBookingsController);
// // console.log("getBookingByIdController:", getBookingByIdController);
// // console.log("getFailedBookingController:", getFailedBookingController);

// console.log("authMiddleware:", protect);
// console.log("updateBookingStatusController:", updateBookingStatusController);
// console.log("createBookingController:", createBookingController);
// console.log("getBookingsController:", getBookingsController);
// console.log("getBookingByIdController:", getBookingByIdController);
// console.log("getFailedBookingController:", getFailedBookingController);

// // Status update
// router.post("/update-status", protect, updateBookingStatusController);

// // Create booking
// router.post("/", protect, createBookingController);

// // List bookings
// router.get("/", protect, getBookingsController);

// // Failed payments (MUST COME BEFORE :id)
// router.get("/failed", protect, getFailedBookingController);

// // Booking detail (LAST)
// router.get("/:id", protect, getBookingByIdController);

// module.exports = router;

//debugging purpose
// console.log("authMiddleware:", protect);
// console.log("updateBookingStatusController:", updateBookingStatus);
// console.log("createBookingController:", createBooking);
// console.log("getBookingsController:", getBookings);
// console.log("getBookingByIdController:", getBookingById);
// console.log("getFailedBookingController:", getFailedBooking);

// ----------------------------
// Booking Status Webhook Route
// (NO JWT, Only Signature Verification)
//
