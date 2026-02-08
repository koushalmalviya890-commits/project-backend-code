const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  incubatorId: { type: String, required: true },
  startupId: { type: String, required: true },
  facilityId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if model exists to prevent OverwriteModelError during hot-reloads
module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);