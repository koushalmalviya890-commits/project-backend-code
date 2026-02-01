const { updateBookingStatus } = require("../../services/BookingService");

// ----------------------------------------
// POST /api/bookings/update-status
// ----------------------------------------

async function updateBookingStatusController(req, res) {
  try {
    const { bookingId, status, previousStatus, timestamp } = req.body;

    console.log("Incoming update-status request:", req.body);

    // Basic validation
    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "bookingId and status are required",
      });
    }

    // Optional stale request detection (same logic as Next.js)
    if (timestamp) {
      const timeDiff = Date.now() - timestamp;

      if (timeDiff > 20000) {
        console.warn(`Old request detected (${timeDiff}ms old)`);
      }
    }

    // Call service
    const result = await updateBookingStatus(
      bookingId,
      status,
      previousStatus
    );

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      webhookSent: result.webhookSent || false,
    });

  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  updateBookingStatusController,
};
