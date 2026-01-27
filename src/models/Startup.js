const mongoose = require("mongoose");
const { ENTITY_TYPES, LOOKING_FOR } = require("../constants");

const startupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    startupName: { type: String, default: null },
    contactName: { type: String, default: null },
    contactEmail: { type: String, default: null },
    contactPhone: { type: String, default: null },

    entityType: {
      type: String,
      enum: ENTITY_TYPES,
      default: null,
    },

    lookingFor: {
      type: [String],
      enum: LOOKING_FOR,
      default: [],
    },

    website: { type: String, default: null },
    linkedIn: { type: String, default: null },
    description: { type: String, default: null },
    logoUrl: { type: String, default: null },

    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },

    isProfileCompleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Startups" },
);

startupSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports =
  mongoose.models.Startups ||
  mongoose.model("Startups", startupSchema, "Startups");
