const mongoose = require('mongoose');
const { Schema } = mongoose;

// Contact Details Schema (copied from Facility.js)
const contactSchema = new Schema({
  pemail: { type: String },
  pname: { type: String },
  pmobile: { type: String },
  semail: { type: String },
  sname: { type: String },
  smobile: { type: String },
}, { _id: false });

// Timing Schema for each day
const dayTimingSchema = new Schema({
  isOpen: { type: Boolean },
  openTime: { type: String },
  closeTime: { type: String },
}, { _id: false });

const timingsSchema = new Schema({
  monday: dayTimingSchema,
  tuesday: dayTimingSchema,
  wednesday: dayTimingSchema,
  thursday: dayTimingSchema,
  friday: dayTimingSchema,
  saturday: dayTimingSchema,
  sunday: dayTimingSchema,
}, { _id: false });

// Service Provider Schema (merged)
const serviceProviderSchema = new Schema({
  id: { type: String, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  facilityTypes: { type: [String] },
  serviceName: { type: String },
  address: { type: String },
  features: { type: [String] },
  images: { type: [String] },
  city: { type: String },
  stateProvince: { type: String },
  zipPostalCode: { type: String },
  primaryContact1Name: { type: String },
  primaryContact1Designation: { type: String },
  contact2Name: { type: String },
  contact2Designation: { type: String },
  primaryContactNumber: { type: String },
  alternateContactNumber: { type: String },
  primaryEmailId: { type: String },
  alternateEmailId: { type: String },
  logoUrl: { type: String },
  websiteUrl: { type: String },
  timings: timingsSchema,
  joinedDate: { type: Date },
  totalFacilities: { type: Number },
  earnings: { type: Number, default: 0 },
  serviceProviderType: {
    type: String,
    enum: [
      'Incubator',
      'Accelerator', 
      'Institution/University',
      'Private Coworking Space',
      'Community Space',
      'Studio'
    ],
    required: false,
    default: null,
  },
  agreementUrl: {
    type: String,
    default: null,
  },
  gstNumber: {
    type: String,
    default: null,
  },
  invoiceType: {
    type: String,
    enum: ['self', 'cumma'],
    default: 'self',
  },
  settlementType: {
    type: String,
    enum: ['monthly', 'weekly'],
    default: 'monthly',
  },
  invoiceTemplate: {
    type: String,
    enum: ['template1', 'template2'],
    default: 'template1',
  },
  bankName: {
    type: String,
    required: false,
    default: null,
  },
  accountNumber: {
    type: String,
    required: false,
    default: null,
  },
  ifscCode: {
    type: String,
    required: false,
    default: null,
  },
  accountHolderName: {
    type: String,
    required: false,
    default: null,
  },
  bankBranch: {
    type: String,
    required: false,
    default: null,
  },
  completedBookings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.ServiceProvider || mongoose.model('Service Provider', serviceProviderSchema, 'Service Provider');
// module.exports = mongoose.models.Facilities || mongoose.model('Facilities', facilitySchema, 'Facilities');

//   facilityTypes: { type: [String] },
// contact: contactSchema,

