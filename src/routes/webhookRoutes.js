const express = require("express");
const router = express.Router();

const { razorpayWebhookHandler } = require("../controllers/webhookController");

// IMPORTANT: Razorpay sends raw body for signature verification
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhookHandler,
);

module.exports = router;
