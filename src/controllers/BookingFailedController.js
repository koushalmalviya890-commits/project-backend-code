const { getFailedBooking } = require("../../services/BookingFailedService");

// --------------------------------------------
// GET /api/bookings/failed
// --------------------------------------------

async function getFailedBookingController(req, res) {
  try {
    const { facilityId } = req.query;
    const user = req.user;

    if (!facilityId) {
      return res.status(400).json({
        success: false,
        message: "facilityId is required",
      });
    }

    const result = await getFailedBooking(facilityId, user);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      bookingId: result.bookingId,
    });
  } catch (error) {
    console.error("Failed booking controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getFailedBookingController,
};
