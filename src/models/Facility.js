const mongoose = require('mongoose');

const labEquipmentSchema = new mongoose.Schema({
  labName: { type: String, required: true },
  equipmentName: { type: String, required: true },
  capacityAndMake: { type: String, required: true },
});

const softwareEquipmentSchema = new mongoose.Schema({
  softwareName: { type: String, required: true },
  version: { type: String, required: true },
});

const saasEquipmentSchema = new mongoose.Schema({
  equipmentName: { type: String, required: true },
  capacityAndMake: { type: String, required: true }, 
});

const areaDetailsSchema = new mongoose.Schema({
  area: { type: Number, required: true },
  type: { type: String, enum: ['Covered', 'Uncovered'], required: true },
  furnishing: { type: String, enum: ['Furnished', 'Not Furnished'], required: true },
  customisation: { type: String, enum: ['Open to Customisation', 'Cannot be Customised'], required: true },
});

const rentalPlanSchema = new mongoose.Schema({
  name: { 
    type: String, 
    enum: ['Annual', 'Monthly', 'Weekly', 'One Day (24 Hours)', 'Hourly'],
    required: true 
  },
  price: { type: Number, required: true },
  duration: { 
    type: String, 
    enum: ['Annual', 'Monthly', 'Weekly', 'One Day (24 Hours)', 'Hourly'],
    required: true 
  },
});

// New schema for studio equipment details
const studioEquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  picture: { type: String, required: true },
  quantity: { type: Number, required: true },
  model: { type: String, required: true },
});

// New schema for studio details
const studioDetailsSchema = new mongoose.Schema({
  facilityName: { type: String, required: true },
  description: { type: String, required: true },
  suitableFor: { 
    type: [String], 
    enum: ['video', 'podcast', 'audio', 'others'],
    required: true 
  },
  isSoundProof: { type: Boolean, required: true },
  equipmentDetails: { type: [studioEquipmentSchema], required: true },
  hasAmpleLighting: { type: Boolean, required: true },
  rentalPlanTypes: { 
    type: [String], 
    enum: ['Hourly', 'One-Day'],
    required: true 
  },
});

const baseDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  videoLink: { type: String, default: '' },
  rentalPlans: { 
    type: [rentalPlanSchema], 
    // required: true, 
    validate: [array => array.length > 0, 'At least one rental plan is required'] 
  },
});

// Timings schema for facility operating hours
const dayTimingSchema = new mongoose.Schema({
  isOpen: { type: Boolean, required: true },
  openTime: { type: String },
  closeTime: { type: String }
});

const timingsSchema = new mongoose.Schema({
  monday: { type: dayTimingSchema, required: true },
  tuesday: { type: dayTimingSchema, required: true },
  wednesday: { type: dayTimingSchema, required: true },
  thursday: { type: dayTimingSchema, required: true },
  friday: { type: dayTimingSchema, required: true },
  saturday: { type: dayTimingSchema, required: true },
  sunday: { type: dayTimingSchema, required: true }
});

const facilitySchema = new mongoose.Schema({
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'Service Provider',
    ref: 'ServiceProvider',
    required: true,
  },
  facilityType: {
    type: String,
    enum: [
      'individual-cabin',
      'coworking-spaces',
      'meeting-rooms',
      'bio-allied-labs',
      'manufacturing-labs',
      'prototyping-labs',
      'software',
      'saas-allied',
      'raw-space-office',
      'raw-space-lab',
      'studio',
      'event-workspace',
    ],
    required: true,
  },
  privacyType: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'inactive'],
    default: 'pending',
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(details) {
        const doc = this;
        if (!doc.facilityType) return true; // Skip if context missing (fallback)

        // Basic checks
        if (!details.name || !details.description || !Array.isArray(details.images)) return false;
        if (!Array.isArray(details.rentalPlans) || details.rentalPlans.length === 0) return false;

        // Switch Logic (Keep your existing switch logic here for Creates)
        switch (doc.facilityType) {
          case 'individual-cabin':
            return typeof details.totalCabins === 'number' && 
                   typeof details.availableCabins === 'number';

          case 'coworking-spaces':
            return typeof details.totalSeats === 'number' && 
                   typeof details.availableSeats === 'number';

          case 'meeting-rooms':
            return typeof details.totalRooms === 'number' && 
                   typeof details.seatingCapacity === 'number' && 
                   typeof details.totalTrainingRoomSeaters === 'number';

          case 'bio-allied-labs':
          case 'manufacturing-labs':
          case 'prototyping-labs':
            return Array.isArray(details.equipment) && 
                   details.equipment.length > 0 &&
                   details.equipment.every(eq => 
                     eq.labName && eq.equipmentName && eq.capacityAndMake);

          case 'software':
            return Array.isArray(details.equipment) && 
                   details.equipment.length > 0 &&
                   details.equipment.every(eq => 
                     eq.softwareName && eq.version);

          case 'saas-allied':
            return Array.isArray(details.equipment) && 
                   details.equipment.length > 0 &&
                   details.equipment.every(eq => 
                     eq.equipmentName && eq.capacityAndMake);

          case 'raw-space-office':
          case 'raw-space-lab':
            return Array.isArray(details.areaDetails) && 
                   details.areaDetails.length > 0 &&
                   details.areaDetails.every(area => 
                     typeof area.area === 'number' && 
                     ['Covered', 'Uncovered'].includes(area.type) &&
                     ['Furnished', 'Not Furnished'].includes(area.furnishing) &&
                     ['Open to Customisation', 'Cannot be Customised'].includes(area.customisation));
          
          case 'studio':
            // Validate studio details
            return details.studioDetails && 
                   details.studioDetails.facilityName &&
                   details.studioDetails.description &&
                   Array.isArray(details.studioDetails.suitableFor) &&
                   details.studioDetails.suitableFor.length > 0 &&
                   details.studioDetails.suitableFor.every(type => 
                     ['video', 'podcast', 'audio', 'others'].includes(type)) &&
                   typeof details.studioDetails.isSoundProof === 'boolean' &&
                   Array.isArray(details.studioDetails.equipmentDetails) &&
                   details.studioDetails.equipmentDetails.length > 0 &&
                   details.studioDetails.equipmentDetails.every(eq => 
                     eq.name && eq.picture && typeof eq.quantity === 'number' && eq.model) &&
                   typeof details.studioDetails.hasAmpleLighting === 'boolean' &&
                   Array.isArray(details.studioDetails.rentalPlanTypes) &&
                   details.studioDetails.rentalPlanTypes.length > 0 &&
                   details.studioDetails.rentalPlanTypes.every(type => 
                     ['Hourly', 'One-Day'].includes(type));

          case 'event-workspace':
            return typeof details.totalRooms === 'number' && 
                   typeof details.seatingCapacity === 'number';
                   
          default:
            return true;
        }
      },
      message: 'Invalid facility details for the specified facility type',
    },
  },
  timings: {
    type: timingsSchema,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  relevantSectors: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length <= 3;
      },
      message: 'A maximum of 3 relevant sectors are allowed',
    },
    default: [],
  },
}, {
  collection: 'Facilities',
  timestamps: true
});

// Update timestamps on save
// facilitySchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

module.exports = mongoose.models.Facility || mongoose.model('Facility', facilitySchema, 'Facilities');