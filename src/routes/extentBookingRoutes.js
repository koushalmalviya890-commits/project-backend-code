const express = require("express");
const router = express.Router();

const {
  createExtentBooking,
  getExtentBooking,
} = require("../controllers/bookingExtensionController");

router.post("/extent-booking", createExtentBooking);
router.get("/extent-booking/:bookingId", getExtentBooking);

module.exports = router;
