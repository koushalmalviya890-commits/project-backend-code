const mongoose = require('mongoose')
// const { ENTITY_TYPES, LOOKING_FOR } = require('@/lib/constants') // Uncomment if used
const { ENTITY_TYPES, LOOKING_FOR } = require("../constants");

const startupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true
    },
    startupName: {
      type: String,
      required: false,
      default: null,
    },
    contactName: {
      type: String,
      required: false,
      default: null,
    },
    isNewUser: {
      type: Boolean,
      required: false,
      default: true,
    },
    contactNumber: {
      type: String,
      required: false,
      default: null,
    },
    founderName: {
      type: String,
      required: false,
      default: null,
    },
    founderDesignation: {
      type: String,
      required: false,
      default: null,
    },
    entityType: {
      type: String,
      required: false,
      default: null,
    },
    teamSize: {
      type: Number,
      required: false,
      default: null,
      min: 0,
      get: (v) => (v === null ? null : Math.round(v)),
      set: (v) => (v === null ? null : Math.round(v)),
    },
    dpiitNumber: {
      type: String,
      required: false,
      default: null,
    },
    cin: {
      type: String,
      required: false,
      default: null,
    },
    gstnumber: {
      type: String,
      required: false,
      default: null,
    },
    secondarycontactname: {
      type: String,
      required: false,
      default: null,
    },
    secondarycontactdesignation: {
      type: String,
      required: false,
      default: null,
    },
    secondarycontactnumber: {
      type: String,
      required: false,
      default: null,
    },
    industry: {
      type: String,
      required: false,
      default: null,
    },
    sector: {
      type: String,
      required: false,
      default: null,
    },
    stagecompleted: {
      type: String,
      required: false,
      default: null,
    },
    startupMailId: {
      type: String,
      required: false,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true // Allow null
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
        },
        message: 'Invalid email format',
      },
    },
    website: {
      type: String,
      required: false,
      default: null,
    },
    linkedinStartupUrl: {
      type: String,
      required: false,
      default: null,
    },
    linkedinFounderUrl: {
      type: String,
      required: false,
      default: null,
    },
    instagramurl: {
      type: String,
      required: false,
      default: null,
    },
    twitterurl: {
      type: String,
      required: false,
      default: null,
    },
    lookingFor: {
      type: [String],
      default: [],
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    city: {
      type: String,
      required: false,
      default: null,
    },
    state: {
      type: String,
      required: false,
      default: null,
    },
    pincode: {
      type: String,
      required: false,
      default: null,
    },
    country: {
      type: String,
      required: false,
      default: null,
    },
    category: {
      type: String,
      required: false,
      default: null,
    },
    logoUrl: {
      type: String,
      required: false,
      default: null,
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
    confirmAccountNumber: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
   timestamps: true, // Auto-manages createdAt and updatedAt
    collection: 'Startups', // Forces specific collection name
    toJSON: { getters: true }, // Ensures teamSize getter runs on JSON output
    toObject: { getters: true }
  }
)

// Update timestamps on save
startupSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

// Export the model (prevents OverwriteModelError)
module.exports =
  mongoose.models.Startups ||
  mongoose.model("Startup", startupSchema, "Startups");
