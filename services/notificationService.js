const Notification = require('../models/Notification');

// Usage: await notificationService.createBookingApprovedNotification(...)
exports.createBookingApprovedNotification = async (
  serviceProviderId,
  bookingId,
  facilityName,
  startupName,
  startDate,
  endDate,
  facilityType
) => {
  try {
    const notification = await Notification.create({
      userId: serviceProviderId,
      type: 'booking-approved',
      title: 'New Booking Approved',
      message: `${facilityName} was booked by ${startupName} from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
      relatedId: bookingId,
      relatedType: 'booking',
      isRead: false,
      metadata: {
        facilityName,
        startupName,
        facilityType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString()
      }
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

exports.createFacilityApprovedNotification = async (
  serviceProviderId,
  facilityId,
  facilityName,
  facilityType
) => {
  try {
    const notification = await Notification.create({
      userId: serviceProviderId,
      type: 'facility-approved',
      title: 'Facility Approved',
      message: `${facilityName} is live and open for bookings.`,
      relatedId: facilityId,
      relatedType: 'facility',
      isRead: false,
      metadata: {
        facilityName,
        facilityType
      }
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};