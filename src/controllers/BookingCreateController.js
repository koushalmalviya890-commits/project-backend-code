const { createBooking } = require("../../services/BookingCreateService");

// --------------------------------------------
// POST /api/bookings
// --------------------------------------------

async function createBookingController(req, res) {
  try {
    const user = req.user; // from auth middleware
    const body = req.body;

    // Block Service Provider role
    if (user.userType === "Service Provider") {
      return res.status(403).json({
        success: false,
        message: "Service Providers cannot create bookings",
      });
    }

    const result = await createBooking(body, user);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      bookingId: result.bookingId,
      data: result.data,
    });
  } catch (error) {
    console.error("Create booking controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createBookingController,
};
