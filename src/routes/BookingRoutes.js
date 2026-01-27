const express = require("express");
const router = express.Router();

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


router.post("/update-status", updateBookingStatusController);

router.post("/", createBookingController);

router.get("/" , getBookingsController);

router.get("/:id", authMiddleware, getBookingByIdController);

router.get("/failed", authMiddleware, getFailedBookingController);

module.exports = router;
