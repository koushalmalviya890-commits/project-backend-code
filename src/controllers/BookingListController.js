const { getBookings } = require("../../services/BookingListService");

// --------------------------------------------
// GET /api/bookings
// --------------------------------------------

async function getBookingsController(req, res) {
  try {
    const user = req.user;
    const query = req.query;

    const result = await getBookings(query, user);

    if (!result.success) {
      return res.status(500).json(result);
    }

    // Detailed dashboard response
    if (result.metrics) {
      return res.status(200).json({
        bookings: result.bookings,
        metrics: result.metrics,
      });
    }

    // Normal list response
    return res.status(200).json(result.bookings);
  } catch (error) {
    console.error("Get bookings controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getBookingsController,
};
