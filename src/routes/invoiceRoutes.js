const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  generateInvoice,
  sendInvoiceByEmail,
} = require("../controllers/invoiceController");

// Generate Invoice PDF + upload
router.post("/generate/:bookingId", protect, generateInvoice);

// Send Invoice Email
router.post("/email", protect, sendInvoiceByEmail);

module.exports = router;
