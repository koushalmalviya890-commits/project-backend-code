const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility', // Links to your Facility model
    required: true
  },
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Based on your aggregation, this links to the User (Startup)
    required: true
  },
  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The Service Provider/Incubator User ID
    required: true
  },
  
  // Booking Details
  rentalPlan: {
    type: String, // e.g., "Hourly", "Monthly"
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
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
  
  // Financials
  amount: { type: Number, required: true }, // Final amount paid
  baseAmount: { type: Number }, // Amount before tax/fees
  originalBaseAmount: { type: Number },
  perUnitPrice: { type: Number },
  serviceFee: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  totalBeforeDiscount: { type: Number },
  discount: { type: Number, default: 0 },
  
  // Payment Info
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayOrderId: { type: String },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed, // Flexible field for any Razorpay response data
    default: {}
  },
  
  // User Contact
  whatsappNumber: { type: String },
  
  // Invoice & Processing
  invoiceUrl: { type: String },
  invoiceGeneratedAt: { type: Date },
  invoiceEmailHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
  processedAt: { type: Date },
  
  // Metadata / Optional Fields (seen as null in your image)
  unitCount: { type: Number, default: null },
  unitLabel: { type: String, default: null },
  label: { type: String, default: null },
  couponApplied: { type: String, default: null },
  requestedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null }

}, { 
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Indexes for faster queries (e.g., fetching earnings)
bookingSchema.index({ incubatorId: 1 });
bookingSchema.index({ startupId: 1 });
bookingSchema.index({ facilityId: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);