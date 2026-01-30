const { ObjectId } = require("mongodb");
const connectDB = require("../src/config/mongoClient");

// --------------------------------------------
// Get Bookings Service
// --------------------------------------------

async function getBookings(query, user) {
  try {
    const { db } = await connectDB();

    const detailed = query.detailed === "true";
    const startDateParam = query.startDate;
    const endDateParam = query.endDate;

    const userId = new ObjectId(user.id);

    // ----------------------------
    // Build Match Pipeline
    // ----------------------------

    const matchPipeline = {
      incubatorId: userId,
    };

    // Date filters
    if (startDateParam || endDateParam) {
      matchPipeline.startDate = {};

      if (startDateParam) {
        const startDate = new Date(startDateParam);
        startDate.setUTCHours(0, 0, 0, 0);
        matchPipeline.startDate.$gte = startDate;
      }

      if (endDateParam) {
        const endDate = new Date(endDateParam);
        endDate.setUTCHours(23, 59, 59, 999);
        matchPipeline.startDate.$lte = endDate;
      }
    }

    // ----------------------------
    // Pre-count for verification
    // ----------------------------

    const totalMatchingBookings = await db
      .collection("bookings")
      .countDocuments(matchPipeline);

    // ----------------------------
    // Aggregation Pipeline
    // ----------------------------

    const bookings = await db.collection("bookings").aggregate([
      { $match: matchPipeline },

      // Join Startups
      {
        $lookup: {
          from: "Startups",
          let: { startupId: "$startupId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$startupId"] },
              },
            },
          ],
          as: "startup",
        },
      },

      // Join Facilities
      {
        $lookup: {
          from: "Facilities",
          let: { facilityId: "$facilityId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$facilityId"] },
              },
            },
          ],
          as: "facility",
        },
      },

      // Remove broken relations
      {
        $match: {
          startup: { $ne: [] },
          facility: { $ne: [] },
        },
      },

      // Flatten arrays
      { $unwind: "$facility" },
      { $unwind: "$startup" },

      // Shape response
      {
        $project: {
          _id: 1,
          bookingId: { $toString: "$_id" },

          startupDetails: {
            logoUrl: { $ifNull: ["$startup.logoUrl", "/placeholder-logo.png"] },
            startupName: {
              $ifNull: ["$startup.startupName", "Unknown Startup"],
            },
          },

          facilityType: {
            $ifNull: ["$facility.facilityType", "Unknown Type"],
          },

          facilityName: {
            $ifNull: ["$facility.details.name", "Unknown Facility"],
          },

          bookedOn: { $ifNull: ["$requestedAt", "$createdAt"] },

          startDate: 1,
          endDate: 1,
          rentalPlan: 1,
          amount: 1,
          baseAmount: 1,
          gstAmount: 1,
          status: 1,
          paymentStatus: 1,
          whatsappNumber: 1,
          invoiceUrl: 1,
          bookingSeats: 1,
        },
      },

      // Latest first
      { $sort: { bookedOn: -1 } },
    ]).toArray();

    // ----------------------------
    // Metrics Calculation (Optional)
    // ----------------------------

    if (detailed) {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayBookings = bookings.filter((b) => {
        return new Date(b.startDate) >= startOfToday;
      }).length;

      const totalBookingsThisMonth = bookings.filter((b) => {
        return new Date(b.startDate) >= startOfMonth;
      }).length;

      const completedBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === "approved"
      ).length;

      const rejectedCancelledBookings = bookings.filter(
        (b) =>
          b.status?.toLowerCase() === "rejected" ||
          b.status?.toLowerCase() === "cancelled"
      ).length;

      const pendingBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === "pending"
      ).length;

      return {
        success: true,
        bookings,
        metrics: {
          totalBookingsThisMonth,
          todayBookings,
          completedBookings,
          rejectedCancelledBookings,
          pendingBookings,
        },
      };
    }

    return {
      success: true,
      bookings,
      totalMatchingBookings,
    };
  } catch (error) {
    console.error("Get bookings service error:", error);

    return {
      success: false,
      message: "Failed to fetch bookings",
      error,
    };
  }
}

module.exports = {
  getBookings,
};
