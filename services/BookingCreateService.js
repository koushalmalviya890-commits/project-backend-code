const { ObjectId } = require("mongodb");
const connectDB = require("../src/config/mongoClient");

// --------------------------------------------
// Create Booking Service
// --------------------------------------------

async function createBooking(data, user) {
  try {
    const { db } = await connectDB();

    const {
      facilityId,
      rentalPlan,
      unitCount,
      unitLabel,
      bookingSeats,
      label,
      startDate,
      endDate,
      contactNumber,
      originalBaseAmount,
      baseAmount,
      perUnitPrice,
      serviceFee,
      gstAmount,
      totalBeforeDiscount,
      discount,
      amount,
      couponApplied,
    } = data;

    // ----------------------------
    // Validation
    // ----------------------------

    if (
      !facilityId ||
      !rentalPlan ||
      !startDate ||
      !endDate ||
      !contactNumber ||
      !amount
    ) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }

    if (!ObjectId.isValid(facilityId)) {
      return {
        success: false,
        message: "Invalid Facility ID",
      };
    }

    // ----------------------------
    // Facility Lookup
    // ----------------------------

    const facilityDoc = await db.collection("Facilities").findOne({
      _id: new ObjectId(facilityId),
    });

    if (!facilityDoc) {
      return {
        success: false,
        message: "Facility not found",
      };
    }

    // ----------------------------
    // Coupon Usage Update
    // ----------------------------

    if (couponApplied && couponApplied.couponId) {
      try {
        const serviceProvider = await db.collection("Service Provider").findOne({
          $or: [
            { _id: facilityDoc.serviceProviderId },
            { userId: facilityDoc.serviceProviderId },
          ],
        });

        if (serviceProvider && serviceProvider.coupons) {
          const couponIndex = serviceProvider.coupons.findIndex(
            (c) => c._id.toString() === couponApplied.couponId
          );

          if (couponIndex !== -1) {
            await db.collection("Service Provider").updateOne(
              { _id: serviceProvider._id },
              {
                $inc: {
                  [`coupons.${couponIndex}.usedCount`]: 1,
                },
              }
            );
          }
        }
      } catch (couponError) {
        console.error("Coupon update failed:", couponError);
      }
    }

    // ----------------------------
    // Booking Object Creation
    // ----------------------------

    const booking = {
      startupId: new ObjectId(user.id),
      facilityId: new ObjectId(facilityId),

      incubatorId: facilityDoc.serviceProviderId
        ? new ObjectId(facilityDoc.serviceProviderId)
        : null,

      rentalPlan,
      unitCount,
      unitLabel,

      bookingSeats,
      label,

      startDate: new Date(startDate),
      endDate: new Date(endDate),

      whatsappNumber: contactNumber,

      originalBaseAmount,
      baseAmount,
      perUnitPrice,
      serviceFee,
      gstAmount,
      totalBeforeDiscount,
      discount,
      amount,

      couponApplied: couponApplied || null,

      status: "pending",
      paymentStatus: "pending",

      requestedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ----------------------------
    // Insert Booking
    // ----------------------------

    const result = await db.collection("bookings").insertOne(booking);

    if (!result.insertedId) {
      return {
        success: false,
        message: "Booking insertion failed",
      };
    }

    return {
      success: true,
      bookingId: result.insertedId.toString(),
      data: {
        ...booking,
        _id: result.insertedId,
      },
    };
  } catch (error) {
    console.error("Create booking error:", error);

    return {
      success: false,
      message: "Internal server error",
      error,
    };
  }
}

module.exports = {
  createBooking,
};
