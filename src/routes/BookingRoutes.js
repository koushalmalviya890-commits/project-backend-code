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


router.post("/update-status", updateBookingStatusController);

router.post("/", createBookingController);

router.get("/" , getBookingsController);



module.exports = router;
