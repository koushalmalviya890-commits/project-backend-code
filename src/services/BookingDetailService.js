const { ObjectId } = require("mongodb");
const connectDB = require("../src/config/mongoClient");

// --------------------------------------------
// Get Single Booking Service
// --------------------------------------------

async function getBookingById(bookingId, user) {
  try {
    const { db } = await connectDB();

    if (!ObjectId.isValid(bookingId)) {
      return {
        success: false,
        message: "Invalid booking ID",
      };
    }

    const userObjectId = new ObjectId(user.id);

    const bookings = await db.collection("bookings").aggregate([
      {
        $match: {
          _id: new ObjectId(bookingId),
          $or: [
            { startupId: userObjectId },
            { incubatorId: userObjectId },
          ],
        },
      },

      {
        $lookup: {
          from: "Facilities",
          localField: "facilityId",
          foreignField: "_id",
          as: "facility",
        },
      },

      { $unwind: "$facility" },

      {
        $project: {
          _id: 1,

          facilityId: { $toString: "$facilityId" },
          facilityName: "$facility.details.name",
          facilityType: "$facility.facilityType",

          startDate: 1,
          endDate: 1,

          amount: 1,
          baseAmount: 1,
          gstAmount: 1,

          unitCount: 1,
          rentalPlan: 1,

          paymentStatus: 1,
          paymentDetails: 1,

          status: 1,
          serviceFee: 1,

          requestedAt: 1,
          bookingSeats: 1,
          processedAt: 1,

          address: "$facility.address",
          city: "$facility.city",
          state: "$facility.state",
          country: "$facility.country",

          serviceProviderId: {
            $toString: "$facility.serviceProviderId",
          },

          bookedBy: {
            $toString: "$startupId",
          },

          whatsappNumber: 1,
          invoiceUrl: 1,
          invoiceEmailHistory: 1,
        },
      },
    ]).toArray();

    if (!bookings || bookings.length === 0) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    return {
      success: true,
      booking: bookings[0],
    };
  } catch (error) {
    console.error("Get booking by id service error:", error);

    return {
      success: false,
      message: "Failed to fetch booking details",
      error,
    };
  }
}

module.exports = {
  getBookingById,
};
