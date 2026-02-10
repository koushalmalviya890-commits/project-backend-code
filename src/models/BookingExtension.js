const mongoose = require('mongoose');

const bookingExtensionSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, index: true },
    startupId: { type: String, required: true, index: true },
    incubatorId: { type: String, required: true, index: true },
    facilityId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    extentDays: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    requestedAt: { type: Date, required: true, default: Date.now },
    processedAt: { type: Date },
    serviceProviderNotes: { type: String, trim: true },
    newEndDate: { type: Date }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Check if model exists to prevent OverwriteModelError
module.exports = mongoose.models.BookingExtension || mongoose.model('BookingExtension', bookingExtensionSchema);