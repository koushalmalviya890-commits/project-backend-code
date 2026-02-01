const mongoose = require("mongoose");
const Startup = require("../src/models/Startup");

async function getReviewsByFacility(facilityId) {
  if (!facilityId) return [];

  const db = mongoose.connection.db;

  const facilityObjectId = mongoose.Types.ObjectId.isValid(facilityId)
    ? new mongoose.Types.ObjectId(facilityId)
    : facilityId;

  // 1. Fetch reviews for facility
  const reviews = await db
    .collection("Reviews")
    .find({ facilityId: facilityObjectId })
    .sort({ createdAt: -1 })
    .toArray();

  if (!reviews.length) return [];

  // 2. Extract unique startupIds
  const startupIds = [
    ...new Set(reviews.map((r) => r.startupId?.toString()).filter(Boolean)),
  ].map((id) => new mongoose.Types.ObjectId(id));

  // 3. Fetch startup names
  const startups = await Startup.find({
    _id: { $in: startupIds },
  })
    .select("_id startupName")
    .lean();

  const startupMap = {};
  startups.forEach((s) => {
    startupMap[s._id.toString()] = s.startupName;
  });

  // 4. Shape response for frontend
  return reviews.map((r) => ({
    startupName: startupMap[r.startupId?.toString()] || "Unknown Startup",
    rating: r.rating,
    comment: r.comment,
  }));
}

module.exports = { getReviewsByFacility };
