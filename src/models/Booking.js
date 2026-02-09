const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

  // -------------------------
  // Relations
  // -------------------------

  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },

  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


  // -------------------------
  // Booking Details
  // -------------------------

  rentalPlan: {
    type: String,
    required: true
  },

  startDate: {
    type: Date
  },

  endDate: {
    type: Date
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },

  bookingSeats: {
    type: Number,
    default: 1
  },


  // -------------------------
  // Financial Details
  // -------------------------

  amount: {
    type: Number,
    required: true
  },

  baseAmount: Number,
  originalBaseAmount: Number,
  perUnitPrice: Number,

  serviceFee: {
    type: Number,
    default: 0
  },

  gstAmount: {
    type: Number,
    default: 0
  },

  totalBeforeDiscount: Number,

  discount: {
    type: Number,
    default: 0
  },


  // -------------------------
  // Payment Information
  // -------------------------

  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },


  // -------------------------
  // User Contact
  // -------------------------

  whatsappNumber: String,


  // -------------------------
  // Invoice & Processing
  // -------------------------

  invoiceUrl: String,

  invoiceGeneratedAt: Date,

  invoiceEmailHistory: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },

  processedAt: Date,


  // -------------------------
  // Optional Metadata
  // -------------------------

  unitCount: Number,
  unitLabel: String,
  label: String,

  couponApplied: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  requestedAt: {
    type: Date,
    default: Date.now
  },

  expiresAt: Date


}, {
  timestamps: true
});


// -------------------------
// Indexes (Performance Boost)
// -------------------------

bookingSchema.index({ incubatorId: 1 });
bookingSchema.index({ startupId: 1 });
bookingSchema.index({ facilityId: 1 });
bookingSchema.index({ status: 1 });

// Important for failed payment lookup
bookingSchema.index({ paymentStatus: 1, expiresAt: 1 });


// -------------------------
// Virtual Alias (Optional)
// -------------------------

bookingSchema.virtual('serviceProviderId').get(function () {
  return this.incubatorId;
});


// -------------------------
// Export Model
// -------------------------

module.exports =
  mongoose.models.Bookings || mongoose.model("Bookings", bookingSchema);
