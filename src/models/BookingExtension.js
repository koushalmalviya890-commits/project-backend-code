const mongoose = require("mongoose");

const bookingExtensionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Bookings", 
    },

    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Startups",
    },

    requestedEndDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: "BookingExtensions",
  },
);

module.exports =
  mongoose.models.BookingExtensions ||
  mongoose.model("BookingExtensions", bookingExtensionSchema);
