const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    userId: { 
      type: String, 
      required: true, 
      index: true 
    },
    type: { 
      type: String, 
      required: true, 
      enum: [
        'booking-approved',           // Original facility booking
        'facility-approved',          // Original facility approved
        'event-booking-confirmed',    // 🆕 User event booking confirmed
        'event-booking-received',     // 🆕 Service provider received event booking
        'event-payment-completed'     // 🆕 Event payment completed
      ]
    },
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    relatedId: { 
      type: String, 
      required: true 
    },
    relatedType: { 
      type: String, 
      required: true, 
      enum: [
        'booking',           // Original facility booking
        'facility',          // Original facility
        'event-booking',     // 🆕 Event booking
        'event',            // 🆕 Event
        'payment'           // 🆕 Payment
      ]
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    createdAt: { 
      type: Date, 
      default: Date.now
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
      // This will contain:
      // For facility: facilityName, startupName, facilityType, startDate, endDate
      // For events: eventTitle, eventDate, eventTime, venue, customerName, customerEmail, ticketCount, totalAmount, bookingRefNumber, etc.
    }
  },
  { timestamps: true }
);

// Create TTL index to auto-delete notifications after 30 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
