const mongoose = require("mongoose");

const EventFeedbackSchema = new mongoose.Schema({
      eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EventDetail",
            required: true,
      },
      serviceProviderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceProvider",
            required: true,
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comments: { type: String },
      createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EventFeedback", EventFeedbackSchema);