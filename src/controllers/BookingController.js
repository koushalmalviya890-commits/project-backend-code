// const { updateBookingStatus } = require("../../services/BookingService");

// // ----------------------------------------
// // POST /api/bookings/update-status
// // ----------------------------------------

// async function updateBookingStatusController(req, res) {
//   try {
//     const { bookingId, status, previousStatus, timestamp } = req.body;

//     console.log("Incoming update-status request:", req.body);

//     // Basic validation
//     if (!bookingId || !status) {
//       return res.status(400).json({
//         success: false,
//         message: "bookingId and status are required",
//       });
//     }

//     // Optional stale request detection (same logic as Next.js)
//     if (timestamp) {
//       const timeDiff = Date.now() - timestamp;

//       if (timeDiff > 20000) {
//         console.warn(`Old request detected (${timeDiff}ms old)`);
//       }
//     }

//     // Call service
//     const result = await updateBookingStatus(
//       bookingId,
//       status,
//       previousStatus
//     );

//     if (!result.success) {
//       return res.status(404).json({
//         success: false,
//         message: result.message,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: result.message,
//       webhookSent: result.webhookSent || false,
//     });

//   } catch (error) {
//     console.error("Update booking status error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// }

// module.exports = {
//   updateBookingStatusController,
// };


const BookingService = require("../../services/BookingService");


async function createBooking(req, res) {

  try {

    // Block service provider from creating booking
    if (req.user.userType === "Service Provider") {
      return res.status(403).json({
        success: false,
        message: "Service Providers are not allowed to create bookings"
      });
    }

    const result = await BookingService.createBooking(req.body, req.user);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);

  } catch (error) {

    console.error("Create booking controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

async function getBookings(req, res) {

  try {

    const result = await BookingService.getBookings(req.query, req.user);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {

    console.error("Get bookings controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

async function getBookingById(req, res) {

  try {

    const bookingId = req.params.id;

    const result = await BookingService.getBookingById(bookingId, req.user);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {

    console.error("Get booking by id controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

async function getFailedBooking(req, res) {

  try {

    const { facilityId } = req.query;

    const result = await BookingService.getFailedBooking(facilityId, req.user);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {

    console.error("Get failed booking controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}


async function updateBookingStatus(req, res) {

  try {

    const { bookingId, status, previousStatus } = req.body;

    // Basic validation
    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "bookingId and status are required"
      });
    }

    const result = await BookingService.updateBookingStatus(
      bookingId,
      status,
      previousStatus
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    // 202 Accepted is correct for async webhook-type operations
    return res.status(202).json(result);

  } catch (error) {

    console.error("Update booking status controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}


module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getFailedBooking,
  updateBookingStatus
};

