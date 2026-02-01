const { getBookingById } = require("../../services/BookingDetailService");

// --------------------------------------------
// GET /api/bookings/:id
// --------------------------------------------

async function getBookingByIdController(req, res) {
  try {
    const bookingId = req.params.id;
    const user = req.user;

    const result = await getBookingById(bookingId, user);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json(result.booking);
  } catch (error) {
    console.error("Booking detail controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getBookingByIdController,
};
