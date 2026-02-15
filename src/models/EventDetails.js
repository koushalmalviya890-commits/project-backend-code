// Updated Backend Model: models/EventDetail.js
const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  name: { type: String },
  files: [{ type: String }] // Array of file URLs
});

const chiefGuestSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String } // URL to image
});

const collectPersonalInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, enum: ['required', 'optional'] },
  phoneNumber: { type: String, enum: ['required', 'optional'] },
});

const collectIdentityProofSchema = new mongoose.Schema({
  idProof: { type: String, enum: ['required', 'optional', 'off'] },
  idProofType: { type: String, enum: ['Aadhar Card', 'PAN Card', 'Driving License', 'Passport'] },
  idNumber: { type: String, enum: ['required', 'optional', 'off'] },
  websiteLink: { type: String, enum: ['required', 'optional', 'off'] },
});

const customQuestionsSchema = new mongoose.Schema({
  questionType: { type: String, enum: ['text', 'radio', 'checkbox', 'options', 'website'] },
  question: { type: String },
  options: [{ type: String }], // For 'radio', 'checkbox', 'options' types
  isRequired: { type: String, enum: ['required', 'optional'], default: 'optional' },
});

const couponThingsSchema = new mongoose.Schema({
  couponCode: { type: String },
  minimumValue: { type: Number }, // minimum ticket price to apply coupon
  discount: { type: Number }, // percentage discount
  validFrom: { type: Date },
  validTo: { type: Date },

});

const postEventFeedbackSchema = new mongoose.Schema({
  scheduledDateTime: { type: Date },
  bodyContent: { type: String },
  sent: { type: Boolean, default: false }, // Track if feedback was sent
  sentAt: { type: Date }, // When it was sent
  recipientCount: { type: Number, default: 0 } // How many emails were sent
});

const socialMediaLinksSchema = new mongoose.Schema({
  socialLink: { type: String }
});

const eventDetailSchema = new mongoose.Schema({

  //Event details Tab
  // Service Provider Link
  // serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service Provider', required: true },
  serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  serviceProviderName: { type: String },

  bookedTicketsCount: { type: Number, default: 0 }, // To track number of booked tickets

  // Event Details
  title: { type: String, required: true },
  status: { type: String, enum: ['public', 'private'], default: 'public' },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  venue: { type: String, required: true },
  venueStatus: { type: String, enum: ['offline', 'online'], default: 'offline' },
  description: { type: String },
  category: { type: String },
  sectors: [{ type: String }],
  amenities: [{ type: String }],
  coverImage: { type: String }, // URL to cover image
  features: [featureSchema],
  chiefGuests: [chiefGuestSchema],
  hasChiefGuest: { type: Boolean, default: false },
  hasFeatures: { type: Boolean, default: false },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  activeStatus: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false },

  // Ticket registration details Tab
  ticketType: { type: String, enum: ['free', 'paid'], default: 'free', trim: true },
  applyGst: { type: String, enum: ['yes', 'no'], default: "no", trim: true },
  applyPlatformFee: { type: String, enum: ['yes', 'no'], default: "no", trim: true },
  tickets: { type: String, enum: ['limited', 'unlimited'], default: 'unlimited' },
  ticketCapacity: { type: Number },
  ticketPrice: { type: Number },
  bulkRegistration: { type: Boolean, default: false },
  bulkTickets: { type: Number },
  registrationStartDateTime: { type: Date, required: true },
  registrationEndDateTime: { type: Date, required: true },
  customizeTicketEmail: { type: Boolean, default: false },
  ticketEmailContent: { type: String },
  bulkEmailFile: { type: String },
  limitedEventAccess: { type: Boolean, default: false },
  // Array of email addresses
  // limited

  //Registration form Tab

  collectPersonalInfo: [collectPersonalInfoSchema],
  collectIdentityProof: [collectIdentityProofSchema],
  customQuestions: [customQuestionsSchema],
  customizeRegistrationEmail: { type: Boolean, default: false },
  registrationEmailBodyContent: { type: String },

  //Terms and Conditions Tab

  termsAndConditions: { type: String },
  refundPolicy: { type: String },
  couponAvailability: { type: Boolean, default: false },
  couponDetails: [couponThingsSchema],
  eventReminder: { type: Boolean, default: false },
  postEventFeedback: { type: Boolean, default: false },
  postEventFeedbackDetails: [postEventFeedbackSchema],
  socialMediaLinks: [socialMediaLinksSchema],

});

const EventDetail = mongoose.model('EventDetail', eventDetailSchema);
module.exports = EventDetail;
