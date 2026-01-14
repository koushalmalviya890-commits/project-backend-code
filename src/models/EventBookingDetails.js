// Updated Backend Model: models/EventDetail.js
const mongoose = require("mongoose");


const PersonalInfoSchema = new mongoose.Schema({
  userfullName: { type: String, required: true },
  useremail: { type: String },
  userphoneNumber: { type: String },
});

const IdentityProofSchema = new mongoose.Schema({
  useridProof: { type: String },
  useridNumber: { type: String },
  userwebisteLink: { type: String },
});

const customQuestionsSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
});

const eventBookingDetailSchema = new mongoose.Schema({
  //Event details Tab
  // Service Provider Link

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventDetail",
    required: true,
  },

  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },


  bookingRefNumber: { type: String },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed" , "free"],
    default: "pending",
  },
  razorpayOrderId: { type: String },
  paymentMethod: { type: String  , default:'pending'},
  bookingTickets: { type: Number, default: 1 },
  gstAmount: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  PersonalInfo: [PersonalInfoSchema],
  IdentityProof: [IdentityProofSchema],
  customQuestions: [customQuestionsSchema],

  invoiceUrl: { type: String, default: null },
});

const EventBookingDetail = mongoose.model(
  "EventBookingDetail",
  eventBookingDetailSchema
);
module.exports = EventBookingDetail;
