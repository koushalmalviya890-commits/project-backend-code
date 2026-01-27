const { ObjectId } = require("mongodb");
const connectDB = require("../src/config/mongoClient");
const { sendSignedWebhook, logWebhookDelivery } = require("./webhookService");

// --------------------------------------------
// Update Booking Status Service
// --------------------------------------------

async function updateBookingStatus(bookingId, newStatus, previousStatus) {
  try {
    console.log(`[BookingService] Updating booking ${bookingId} status from ${previousStatus} to ${newStatus}`);

    const { db } = await connectDB();

    // Fetch booking
    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      console.error(`[BookingService] Booking not found`);
      return { success: false, message: "Booking not found" };
    }

    // Update fields
    booking.status = newStatus;
    booking.updatedAt = new Date();
    booking.processedAt = new Date();

    // Replace booking document
    const result = await db.collection("bookings").replaceOne(
      { _id: new ObjectId(bookingId) },
      booking
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Booking not found" };
    }

    if (result.modifiedCount === 0) {
      return { success: true, message: "No changes required" };
    }

    console.log(`[BookingService] Booking status updated successfully`);

    // --------------------------------------------
    // Trigger webhook ONLY on pending → approved
    // --------------------------------------------

    if (
      newStatus.toLowerCase() === "approved" &&
      previousStatus.toLowerCase() === "pending"
    ) {
      console.log(`[BookingService] Approval detected — preparing webhook`);

      const bookingDetails = await fetchBookingDetails(bookingId, db);

      // Fallback values
      bookingDetails.facilityName = bookingDetails.facilityName || "Unknown Facility";
      bookingDetails.startupName = bookingDetails.startupName || "Unknown Startup";

      // Ensure endDate exists
      if (!bookingDetails.endDate && bookingDetails.startDate) {
        const endDate = new Date(bookingDetails.startDate);
        const rentalPlan = bookingDetails.rentalPlan || "Monthly";

        if (rentalPlan === "Annual") endDate.setFullYear(endDate.getFullYear() + 1);
        else if (rentalPlan === "Monthly") endDate.setMonth(endDate.getMonth() + 1);
        else if (rentalPlan === "Weekly") endDate.setDate(endDate.getDate() + 7);
        else if (rentalPlan.includes("Day")) endDate.setDate(endDate.getDate() + 1);

        bookingDetails.endDate = endDate;
      }

      // Create notification (non-blocking)
      try {
        await createBookingApprovalNotification(bookingId, bookingDetails, db);
      } catch (err) {
        console.error(`[BookingService] Notification creation failed`, err);
      }

      // Webhook payload
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

      const webhookUrl =
        process.env.BOOKING_WEBHOOK_URL ||
        "https://your-main-app-url.com/api/webhooks/booking-status";

      const webhookSecret = process.env.WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("WEBHOOK_SECRET missing");
        return {
          success: true,
          webhookSent: false,
          message: "Booking updated but webhook secret missing",
        };
      }

      const webhookSent = await sendSignedWebhook({
        url: webhookUrl,
        payload: webhookPayload,
        secret: webhookSecret,
      });

      await logWebhookDelivery(
        "booking-status-change",
        webhookPayload,
        webhookSent,
        webhookSent ? null : "Webhook delivery failed"
      );

      return {
        success: true,
        webhookSent,
        message: webhookSent
          ? "Booking updated and webhook sent"
          : "Booking updated but webhook failed",
      };
    }

    // No webhook case
    return {
      success: true,
      webhookSent: false,
      message: "Booking status updated",
    };
  } catch (error) {
    console.error(`[BookingService] Error:`, error);
    return {
      success: false,
      message: "Booking status update failed",
      error,
    };
  }
}

// --------------------------------------------
// Notification Creator
// --------------------------------------------

async function createBookingApprovalNotification(bookingId, bookingDetails, db) {
  const formatDate = (date) =>
    new Date(date).toISOString().split("T")[0];

  const notification = {
    userId: bookingDetails.startupId?.toString() || "unknown",
    type: "booking-approved",
    title: "New Booking Approved",
    message: `${bookingDetails.facilityName} was booked by ${
      bookingDetails.startupName
    } from ${formatDate(bookingDetails.startDate)} to ${formatDate(
      bookingDetails.endDate
    )}`,
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

  await db.collection("notifications").insertOne(notification);
}

// --------------------------------------------
// Booking Details Fetcher
// --------------------------------------------

async function fetchBookingDetails(bookingId, db) {
  const booking = await db.collection("bookings").findOne({
    _id: new ObjectId(bookingId),
  });

  if (!booking) throw new Error("Booking not found");

  const facility = await db.collection("Facilities").findOne({
    _id: new ObjectId(booking.facilityId),
  });

  let startup = null;

  if (booking.startupId) {
    startup = await db.collection("Startups").findOne({
      _id: new ObjectId(booking.startupId),
    });
  }

  return {
    ...booking,
    facilityName: facility?.details?.name || "Unknown Facility",
    facilityType: facility?.facilityType || "unknown",
    startupName: startup?.startupName || "Unknown Startup",
    startDate: booking.requestedAt,
    endDate: booking.requestedAt,
  };
}

// --------------------------------------------

module.exports = {
  updateBookingStatus,
};
