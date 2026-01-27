const { ObjectId } = require("mongodb");
const connectDB = require("../src/config/mongoClient");

// --------------------------------------------
// Failed Payment Lookup Service
// --------------------------------------------

async function getFailedBooking(facilityId, user) {
  try {
    const { db } = await connectDB();

    if (!ObjectId.isValid(facilityId)) {
      return {
        success: false,
        message: "Invalid facility ID",
      };
    }

    const failedBooking = await db.collection("bookings").findOne(
      {
        facilityId: new ObjectId(facilityId),
        startupId: new ObjectId(user.id),
        paymentStatus: "failed",
        expiresAt: { $gt: new Date() },
      },
      {
        sort: { updatedAt: -1 },
        projection: { _id: 1 },
      }
    );

    if (!failedBooking) {
      return {
        success: true,
        bookingId: null,
      };
    }

    return {
      success: true,
      bookingId: failedBooking._id.toString(),
    };
  } catch (error) {
    console.error("Failed booking service error:", error);

    return {
      success: false,
      message: "Failed to check failed payments",
      error,
    };
  }
}

module.exports = {
  getFailedBooking,
};
