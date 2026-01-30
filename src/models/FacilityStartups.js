const mongoose = require("mongoose");

const FacilityStartupsSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Startups",
    },
    incubatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users", // or ServiceProvider if that's your model
    },
  },
  {
    timestamps: true,
    collection: "FacilityStartups",
  },
);

module.exports =
  mongoose.models.FacilityStartups ||
  mongoose.model("FacilityStartups", FacilityStartupsSchema);
