// const { ObjectId } = require("mongodb");
// const connectDB = require("../src/config/mongoClient");
// const { sendSignedWebhook, logWebhookDelivery } = require("./webhookService");

// // --------------------------------------------
// // Update Booking Status Service
// // --------------------------------------------

// async function updateBookingStatus(bookingId, newStatus, previousStatus) {
//   try {
//     console.log(`[BookingService] Updating booking ${bookingId} status from ${previousStatus} to ${newStatus}`);

//     const { db } = await connectDB();

//     // Fetch booking
//     const booking = await db.collection("bookings").findOne({
//       _id: new ObjectId(bookingId),
//     });

//     if (!booking) {
//       console.error(`[BookingService] Booking not found`);
//       return { success: false, message: "Booking not found" };
//     }

//     // Update fields
//     booking.status = newStatus;
//     booking.updatedAt = new Date();
//     booking.processedAt = new Date();

//     // Replace booking document
//     const result = await db.collection("bookings").replaceOne(
//       { _id: new ObjectId(bookingId) },
//       booking
//     );

//     if (result.matchedCount === 0) {
//       return { success: false, message: "Booking not found" };
//     }

//     if (result.modifiedCount === 0) {
//       return { success: true, message: "No changes required" };
//     }

//     console.log(`[BookingService] Booking status updated successfully`);

//     // --------------------------------------------
//     // Trigger webhook ONLY on pending → approved
//     // --------------------------------------------

//     if (
//       newStatus.toLowerCase() === "approved" &&
//       previousStatus.toLowerCase() === "pending"
//     ) {
//       console.log(`[BookingService] Approval detected — preparing webhook`);

//       const bookingDetails = await fetchBookingDetails(bookingId, db);

//       // Fallback values
//       bookingDetails.facilityName = bookingDetails.facilityName || "Unknown Facility";
//       bookingDetails.startupName = bookingDetails.startupName || "Unknown Startup";

//       // Ensure endDate exists
//       if (!bookingDetails.endDate && bookingDetails.startDate) {
//         const endDate = new Date(bookingDetails.startDate);
//         const rentalPlan = bookingDetails.rentalPlan || "Monthly";

//         if (rentalPlan === "Annual") endDate.setFullYear(endDate.getFullYear() + 1);
//         else if (rentalPlan === "Monthly") endDate.setMonth(endDate.getMonth() + 1);
//         else if (rentalPlan === "Weekly") endDate.setDate(endDate.getDate() + 7);
//         else if (rentalPlan.includes("Day")) endDate.setDate(endDate.getDate() + 1);

//         bookingDetails.endDate = endDate;
//       }

//       // Create notification (non-blocking)
//       try {
//         await createBookingApprovalNotification(bookingId, bookingDetails, db);
//       } catch (err) {
//         console.error(`[BookingService] Notification creation failed`, err);
//       }

//       // Webhook payload
//       const webhookPayload = {
//         bookingId,
//         status: newStatus,
//         previousStatus,
//         serviceProviderId:
//           bookingDetails.incubatorId || bookingDetails.serviceProviderId,
//         facilityName: bookingDetails.facilityName,
//         startupName: bookingDetails.startupName,
//         startDate: bookingDetails.startDate,
//         endDate: bookingDetails.endDate,
//         facilityType: bookingDetails.facilityType,
//       };

//       const webhookUrl =
//         process.env.BOOKING_WEBHOOK_URL ||
//         "https://your-main-app-url.com/api/webhooks/booking-status";

//       const webhookSecret = process.env.WEBHOOK_SECRET;

//       if (!webhookSecret) {
//         console.error("WEBHOOK_SECRET missing");
//         return {
//           success: true,
//           webhookSent: false,
//           message: "Booking updated but webhook secret missing",
//         };
//       }

//       const webhookSent = await sendSignedWebhook({
//         url: webhookUrl,
//         payload: webhookPayload,
//         secret: webhookSecret,
//       });

//       await logWebhookDelivery(
//         "booking-status-change",
//         webhookPayload,
//         webhookSent,
//         webhookSent ? null : "Webhook delivery failed"
//       );

//       return {
//         success: true,
//         webhookSent,
//         message: webhookSent
//           ? "Booking updated and webhook sent"
//           : "Booking updated but webhook failed",
//       };
//     }

//     // No webhook case
//     return {
//       success: true,
//       webhookSent: false,
//       message: "Booking status updated",
//     };
//   } catch (error) {
//     console.error(`[BookingService] Error:`, error);
//     return {
//       success: false,
//       message: "Booking status update failed",
//       error,
//     };
//   }
// }

// // --------------------------------------------
// // Notification Creator
// // --------------------------------------------

// async function createBookingApprovalNotification(bookingId, bookingDetails, db) {
//   const formatDate = (date) =>
//     new Date(date).toISOString().split("T")[0];

//   const notification = {
//     userId: bookingDetails.startupId?.toString() || "unknown",
//     type: "booking-approved",
//     title: "New Booking Approved",
//     message: `${bookingDetails.facilityName} was booked by ${
//       bookingDetails.startupName
//     } from ${formatDate(bookingDetails.startDate)} to ${formatDate(
//       bookingDetails.endDate
//     )}`,
//     relatedId: bookingId,
//     relatedType: "booking",
//     isRead: false,
//     createdAt: new Date(),
//     metadata: {
//       facilityName: bookingDetails.facilityName,
//       startupName: bookingDetails.startupName,
//       facilityType: bookingDetails.facilityType,
//       startDate: formatDate(bookingDetails.startDate),
//       endDate: formatDate(bookingDetails.endDate),
//     },
//   };

//   await db.collection("notifications").insertOne(notification);
// }

// // --------------------------------------------
// // Booking Details Fetcher
// // --------------------------------------------

// async function fetchBookingDetails(bookingId, db) {
//   const booking = await db.collection("bookings").findOne({
//     _id: new ObjectId(bookingId),
//   });

//   if (!booking) throw new Error("Booking not found");

//   const facility = await db.collection("Facilities").findOne({
//     _id: new ObjectId(booking.facilityId),
//   });

//   let startup = null;

//   if (booking.startupId) {
//     startup = await db.collection("Startups").findOne({
//       _id: new ObjectId(booking.startupId),
//     });
//   }

//   return {
//     ...booking,
//     facilityName: facility?.details?.name || "Unknown Facility",
//     facilityType: facility?.facilityType || "unknown",
//     startupName: startup?.startupName || "Unknown Startup",
//     startDate: booking.requestedAt,
//     endDate: booking.requestedAt,
//   };
// }

// // --------------------------------------------

// module.exports = {
//   updateBookingStatus,
// };

const mongoose = require("mongoose");

const Booking = require("../src/models/Booking");
const Facility = require("../src/models/Facility");
const Startup = require("../src/models/Startup");
const ServiceProvider = require("../src/models/ServiceProvider");
const { generateAndStoreInvoice } = require("./invoiceService");
const Notification = require("../src/models/Notification"); // Ensure you import the model

const { sendSignedWebhook, logWebhookDelivery } = require("./webhookService");

async function createBooking(data, user) {
  try {
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


      if (!facilityId || !rentalPlan || !contactNumber || !amount) {
        // -------------------
        // Validation
        // -------------------

        throw new Error("Missing required fields");
      }

    // -------------------
    // Facility Lookup
    // -------------------

    const facility = await Facility.findById(facilityId);

    if (!facility) {
      throw new Error("Facility not found");
    }

    // -------------------
    // Coupon Update (Safe)
    // -------------------

    if (couponApplied?.couponId) {
      const provider = await ServiceProvider.findOne({
        $or: [
          { _id: facility.serviceProviderId },
          { userId: facility.serviceProviderId },
        ],
      });

      if (provider?.coupons?.length) {
        const index = provider.coupons.findIndex(
          (c) => c._id.toString() === couponApplied.couponId,
        );

        if (index !== -1) {
          provider.coupons[index].usedCount += 1;
          await provider.save();
        }
      }
    }

    // -------------------
    // Create Booking
    // -------------------

    const booking = await Booking.create({
      startupId: user.id,
      facilityId,
      incubatorId: facility.serviceProviderId,

      rentalPlan,
      unitCount,
      unitLabel,

      bookingSeats,
      label,

      startDate,
      endDate,

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
    });

    return {
      success: true,
      bookingId: booking._id,
      data: booking,
    };
  } catch (error) {
    console.error("Create booking error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
}

async function getBookings(query, user) {
  try {
    const detailed = query.detailed === "true";
    const startDateParam = query.startDate;
    const endDateParam = query.endDate;

    // -------------------------
    // Build Filter
    // -------------------------

    const filter = {
      incubatorId: user.id,
    };

    if (startDateParam || endDateParam) {
      filter.startDate = {};

      if (startDateParam) {
        const start = new Date(startDateParam);
        start.setUTCHours(0, 0, 0, 0);
        filter.startDate.$gte = start;
      }

      if (endDateParam) {
        const end = new Date(endDateParam);
        end.setUTCHours(23, 59, 59, 999);
        filter.startDate.$lte = end;
      }
    }

    // -------------------------
    // Fetch Bookings
    // -------------------------

    const bookings = await Booking.find(filter)
      .populate({
        path: "facilityId",
        select: "facilityType details.name",
      })
      .populate({
        path: "startupId",
        select: "startupName logoUrl",
      })
      .sort({ requestedAt: -1 })
      .lean();

    // -------------------------
    // Shape Response
    // -------------------------

    const formattedBookings = bookings.map((b) => ({
      bookingId: b._id,

      startupDetails: {
        logoUrl: b.startupId?.logoUrl || "/placeholder-logo.png",
        startupName: b.startupId?.startupName || "Unknown Startup",
      },

      facilityType: b.facilityId?.facilityType || "Unknown Type",
      facilityName: b.facilityId?.details?.name || "Unknown Facility",

      bookedOn: b.requestedAt || b.createdAt,

      startDate: b.startDate,
      endDate: b.endDate,

      rentalPlan: b.rentalPlan,

      amount: b.amount,
      baseAmount: b.baseAmount,
      gstAmount: b.gstAmount,

      status: b.status,
      paymentStatus: b.paymentStatus,

      whatsappNumber: b.whatsappNumber,
      invoiceUrl: b.invoiceUrl,

      bookingSeats: b.bookingSeats,
    }));

    // -------------------------
    // Metrics Calculation
    // -------------------------

    if (detailed) {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayBookings = formattedBookings.filter(
        (b) => new Date(b.startDate) >= startOfToday,
      ).length;

      const totalBookingsThisMonth = formattedBookings.filter(
        (b) => new Date(b.startDate) >= startOfMonth,
      ).length;

      const completedBookings = formattedBookings.filter(
        (b) => b.status?.toLowerCase() === "approved",
      ).length;

      const rejectedCancelledBookings = formattedBookings.filter(
        (b) =>
          b.status?.toLowerCase() === "rejected" ||
          b.status?.toLowerCase() === "cancelled",
      ).length;

      const pendingBookings = formattedBookings.filter(
        (b) => b.status?.toLowerCase() === "pending",
      ).length;

      return {
        success: true,
        bookings: formattedBookings,
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
      bookings: formattedBookings,
    };
  } catch (error) {
    console.error("Get bookings error:", error);

    return {
      success: false,
      message: "Failed to fetch bookings",
    };
  }
}

async function getBookingById(bookingId, user) {
  try {
    // -------------------------
    // Authorization Filter
    // -------------------------

    const booking = await Booking.findOne({
      _id: bookingId,
      $or: [{ startupId: user.id }, { incubatorId: user.id }],
    })
      .populate({
        path: "facilityId",
        select:
          "details.name facilityType address city state country serviceProviderId",
      })
      .populate({
        path: "startupId",
        select: "startupName",
      })
      .lean();

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    // -------------------------
    // Shape Response
    // -------------------------

    const response = {
      _id: booking._id,

      facilityId: booking.facilityId?._id,
      facilityName: booking.facilityId?.details?.name,
      facilityType: booking.facilityId?.facilityType,

      startDate: booking.startDate,
      endDate: booking.endDate,

      amount: booking.amount,
      baseAmount: booking.baseAmount,
      gstAmount: booking.gstAmount,

      unitCount: booking.unitCount,
      rentalPlan: booking.rentalPlan,

      paymentStatus: booking.paymentStatus,
      paymentDetails: booking.paymentDetails,

      status: booking.status,
      serviceFee: booking.serviceFee,

      requestedAt: booking.requestedAt,
      bookingSeats: booking.bookingSeats,
      processedAt: booking.processedAt,

      address: booking.facilityId?.address,
      city: booking.facilityId?.city,
      state: booking.facilityId?.state,
      country: booking.facilityId?.country,

      serviceProviderId: booking.facilityId?.serviceProviderId,

      bookedBy: booking.startupId?._id,

      whatsappNumber: booking.whatsappNumber,
      invoiceUrl: booking.invoiceUrl,
      invoiceEmailHistory: booking.invoiceEmailHistory,
    };

    return {
      success: true,
      booking: response,
    };
  } catch (error) {
    console.error("Get booking by id error:", error);

    return {
      success: false,
      message: "Failed to fetch booking details",
    };
  }
}

async function getFailedBooking(facilityId, user) {
  try {
    if (!facilityId) {
      return {
        success: false,
        message: "Facility ID is required",
      };
    }

    const booking = await Booking.findOne({
      facilityId: facilityId,
      startupId: user.id,
      paymentStatus: "failed",
      expiresAt: { $gt: new Date() },
    })
      .sort({ updatedAt: -1 })
      .select("_id")
      .lean();

    return {
      success: true,
      bookingId: booking ? booking._id : null,
    };
  } catch (error) {
    console.error("Get failed booking error:", error);

    return {
      success: false,
      message: "Failed to check failed payments",
    };
  }
}

async function updateBookingStatus(bookingId, newStatus, previousStatus) {
  try {
    // -------------------------
    // Fetch Booking
    // -------------------------

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    // -------------------------
    // Update Status
    // -------------------------

    booking.status = newStatus;
    booking.updatedAt = new Date();
    booking.processedAt = new Date();

    await booking.save();

    // -------------------------
    // Webhook Trigger Condition
    // -------------------------

    let webhookSent = false;

    if (
      newStatus.toLowerCase() === "approved" &&
      previousStatus.toLowerCase() === "pending"
    ) {
      // Fetch enriched booking details
      const bookingDetails = await fetchBookingDetailsForWebhook(bookingId);

      // Generate Invoice & Save URL
      try {
        const invoiceUrl = await generateAndStoreInvoice(bookingId);

        if (invoiceUrl) {
          await Booking.findByIdAndUpdate(
            bookingId,
            {
              invoiceUrl,
              invoiceGeneratedAt: new Date(),
            },
            { new: true },
          );

          console.log("✅ Invoice generated and saved:", invoiceUrl);
        }
      } catch (err) {
        console.error("❌ Invoice generation failed:", err.message);
      }

      // Fallbacks
      bookingDetails.facilityName =
        bookingDetails.facilityName || "Unknown Facility";

      bookingDetails.startupName =
        bookingDetails.startupName || "Unknown Startup";

      // Auto calculate endDate if missing
      if (!bookingDetails.endDate && bookingDetails.startDate) {
        const endDate = new Date(bookingDetails.startDate);
        const rentalPlan = bookingDetails.rentalPlan || "Monthly";

        if (rentalPlan === "Annual")
          endDate.setFullYear(endDate.getFullYear() + 1);
        else if (rentalPlan === "Monthly")
          endDate.setMonth(endDate.getMonth() + 1);
        else if (rentalPlan === "Weekly")
          endDate.setDate(endDate.getDate() + 7);
        else if (rentalPlan.includes("Day"))
          endDate.setDate(endDate.getDate() + 1);

        bookingDetails.endDate = endDate;
      }

      // -------------------------
      // Create Notification (Non Blocking)
      // -------------------------

      try {
        await createBookingApprovalNotification(bookingId, bookingDetails);
      } catch (err) {
        console.error("Notification creation failed:", err);
      }

      // -------------------------
      // Prepare Webhook Payload
      // -------------------------

      const webhookPayload = {
        bookingId,
        status: newStatus,
        previousStatus,

        serviceProviderId:
          bookingDetails.incubatorId || bookingDetails.serviceProviderId,

        facilityName: bookingDetails.facilityName,
        startupName: bookingDetails.startupName,

        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,

        facilityType: bookingDetails.facilityType,
      };

      const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
      const webhookSecret = process.env.WEBHOOK_SECRET;

      if (webhookSecret) {
        webhookSent = await sendSignedWebhook({
          url: webhookUrl,
          payload: webhookPayload,
          secret: webhookSecret,
        });

        await logWebhookDelivery(
          "booking-status-change",
          webhookPayload,
          webhookSent,
          webhookSent ? null : "Webhook delivery failed",
        );
      }
    }

    // -------------------------
    // Commit Transaction
    // -------------------------

    return {
      success: true,
      webhookSent,
      message: "Booking status updated",
    };
  } catch (error) {
    console.error("Update booking status error:", error);

    return {
      success: false,
      message: "Booking status update failed",
    };
  }
}

async function createBookingApprovalNotification(bookingId, bookingDetails) {
  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  const notification = {
    userId: bookingDetails.startupId,

    type: "booking-approved",

    title: "New Booking Approved",

    message: `${bookingDetails.facilityName} was booked by ${bookingDetails.startupName}
              from ${formatDate(bookingDetails.startDate)}
              to ${formatDate(bookingDetails.endDate)}`,

    relatedId: bookingId,
    relatedType: "booking",

    isRead: false,
    createdAt: new Date(),

    metadata: {
      facilityName: bookingDetails.facilityName,
      startupName: bookingDetails.startupName,
      facilityType: bookingDetails.facilityType,
      startDate: formatDate(bookingDetails.startDate),
      endDate: formatDate(bookingDetails.endDate),
    },
  };

  await mongoose.connection.collection("notifications").insertOne(notification);
}

async function fetchBookingDetailsForWebhook(bookingId) {
  const booking = await Booking.findById(bookingId)
    .populate("facilityId")
    .populate("startupId")
    .lean();

  if (!booking) {
    throw new Error("Booking not found");
  }

  return {
    ...booking,

    facilityName: booking.facilityId?.details?.name,
    facilityType: booking.facilityId?.facilityType,

    startupName: booking.startupId?.startupName,

    startDate: booking.startDate || booking.requestedAt,
    endDate: booking.endDate,
  };
}

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getFailedBooking,
  updateBookingStatus,
};
