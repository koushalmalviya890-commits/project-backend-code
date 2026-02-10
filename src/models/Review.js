const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true },
    incubatorId: { type: String, required: true },
    startupId: { type: String, required: true },

    // Index this for faster lookups since you query by facilityId often
    facilityId: { type: String, required: true, index: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Default to approved so they show up immediately
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
