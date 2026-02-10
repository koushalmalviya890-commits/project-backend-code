// const express = require("express");
// const router = express.Router();

// const {
//   createExtentBooking,
//   getExtentBooking,
//   updateExtentBooking,
// } = require("../controllers/bookingExtensionController");

// router.post("/extent-booking", createExtentBooking);
// router.get("/extent-booking/:bookingId", getExtentBooking);
// router.patch("/extent-booking/:extensionId", updateExtentBooking);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createExtentBooking, 
  getExtentBookings, 
  updateExtentStatus ,
  getExtensionStatusForBooking // <--- Import the new function
} = require('../controllers/bookingExtensionController');

// POST /api/extent-booking - Create Request
router.post('/', protect, createExtentBooking);

// GET /api/extent-booking - Get requests for the logged-in Provider
router.get('/', protect, getExtentBookings);

// PATCH /api/extent-booking/:id - Approve/Reject
router.patch('/:id', protect, updateExtentStatus);

router.get('/status/:bookingId', protect, getExtensionStatusForBooking);

module.exports = router;