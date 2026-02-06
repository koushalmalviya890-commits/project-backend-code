const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "NewsletterSubscribers",
  },
);

module.exports =
  mongoose.models.NewsletterSubscribers ||
  mongoose.model("NewsletterSubscribers", newsletterSchema);
