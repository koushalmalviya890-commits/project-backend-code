const express = require("express");
const router = express.Router();

const {
  createExtentBooking,
  getExtentBooking,
  updateExtentBooking,
} = require("../controllers/bookingExtensionController");

router.post("/extent-booking", createExtentBooking);
router.get("/extent-booking/:bookingId", getExtentBooking);
router.patch("/extent-booking/:extensionId", updateExtentBooking);

module.exports = router;
