const Notification = require('../src/models/Notification'); // 🆕 Same model as facility notifications
const ServiceProvider = require('../src/models/ServiceProvider');

/**
 * Store event booking notifications using the same Notification model
 */
const storeEventBookingNotifications = async (bookingData, eventData) => {
  try {
    console.log('🔔 Storing event booking notifications in same collection...');
    
    // Extract user info from PersonalInfo array
    const userInfo = {
      name: bookingData.PersonalInfo?.[0]?.userfullName || 'Customer',
      email: bookingData.PersonalInfo?.[0]?.useremail || 'N/A',
      phone: bookingData.PersonalInfo?.[0]?.userphoneNumber || 'N/A'
    };

    const notifications = [];

    // 1. Create user booking confirmation notification
    const userNotification = new Notification({
      userId: 'user_' + bookingData._id.toString(), // Create a unique user identifier
      type: 'event-booking-confirmed', // 🆕 New type in same enum
      title: 'Event Booking Confirmed',
      message: `Your booking for "${eventData.title}" has been confirmed successfully.`,
      relatedId: bookingData._id.toString(),
      relatedType: 'event-booking', // 🆕 New relatedType in same enum
      isRead: false,
      metadata: {
        // Event-specific metadata in same metadata field
        eventTitle: eventData.title,
        eventDate: new Date(eventData.startDateTime).toLocaleDateString(undefined, {
          timeZone: "Asia/Kolkata"
        }),
        eventTime: new Date(eventData.startDateTime).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
         timeZone:"Asia/Kolkata"
        }),
        venue: eventData.venue,
        customerName: userInfo.name,
        customerEmail: userInfo.email,
        ticketCount: bookingData.bookingTickets,
        totalAmount: bookingData.totalAmount,
        bookingRefNumber: bookingData.bookingRefNumber,
        paymentStatus: bookingData.paymentStatus
      }
    });

    notifications.push(userNotification);

    // 2. Create service provider notification
    if (eventData.serviceProviderId) {
      try {
        const serviceProvider = await ServiceProvider.findOne({
          userId: eventData.serviceProviderId
        });

        if (serviceProvider) {
          const serviceProviderNotification = new Notification({
            userId: eventData.serviceProviderId.toString(),
            type: 'event-booking-received', // 🆕 New type in same enum
            title: 'New Event Booking Received',
            message: `${userInfo.name} has booked "${eventData.title}" for ${bookingData.bookingTickets} ticket(s).`,
            relatedId: bookingData._id.toString(),
            relatedType: 'event-booking', // 🆕 New relatedType in same enum
            isRead: false,
            metadata: {
              // Event-specific metadata in same metadata field
              eventTitle: eventData.title,
              eventDate: new Date(eventData.startDateTime).toLocaleDateString(undefined, {
                timeZone: "Asia/Kolkata"
              }),
              eventTime: new Date(eventData.startDateTime).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone:"Asia/Kolkata"
              }),
              venue: eventData.venue,
              customerName: userInfo.name,
              customerEmail: userInfo.email,
              ticketCount: bookingData.bookingTickets,
              totalAmount: bookingData.totalAmount,
              bookingRefNumber: bookingData.bookingRefNumber,
              serviceProviderName: serviceProvider.companyName || serviceProvider.primaryEmailId
            }
          });

          notifications.push(serviceProviderNotification);
        }
      } catch (error) {
        console.error('❌ Error getting service provider for notification:', error);
      }
    }

    // 3. Create payment completion notification (for paid events)
    if (bookingData.paymentStatus === 'completed' && bookingData.totalAmount > 0) {
      const paymentNotification = new Notification({
        userId: 'user_' + bookingData._id.toString(),
        type: 'event-payment-completed', // 🆕 New type in same enum
        title: 'Payment Completed Successfully',
        message: `Your payment for "${eventData.title}" has been processed successfully.`,
        relatedId: bookingData._id.toString(),
        relatedType: 'payment', // 🆕 New relatedType in same enum
        isRead: false,
        metadata: {
          eventTitle: eventData.title,
          eventDate: new Date(eventData.startDateTime).toLocaleDateString(undefined, {
            timeZone: "Asia/Kolkata"
          }),
          venue: eventData.venue,
          totalAmount: bookingData.totalAmount,
          bookingRefNumber: bookingData.bookingRefNumber,
          paymentStatus: 'completed'
        }
      });

      notifications.push(paymentNotification);
    }

    // Save all notifications to the same collection
    await Promise.all(notifications.map(notification => notification.save()));
    
    console.log(`✅ Stored ${notifications.length} event notifications in same Notification collection`);
    return { success: true, count: notifications.length };

  } catch (error) {
    console.error('❌ Error storing event notifications:', error);
    // Don't throw - this shouldn't break the booking process
    return { success: false, error: error.message };
  }
};

module.exports = {
  storeEventBookingNotifications
};
