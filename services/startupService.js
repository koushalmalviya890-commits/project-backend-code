const mongoose = require("mongoose");
const Startup = require("../src/models/Startup");
const { connectDB } = require("../src/config/database");

async function getProfile(id) {
  const objectId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(String(id))
    : null;

  return Startup.findOne({
    $or: [
      { _id: objectId },
      { userId: objectId },
      { userId: id }, // in case stored as string
    ],
  }).lean();
}

async function updateProfile(id, data) {
  const objectId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(String(id))
    : null;

  return Startup.findOneAndUpdate(
    {
      $or: [{ _id: objectId }, { userId: objectId }, { userId: id }],
    },
    { $set: data },
    { new: true },
  ).lean();
}

async function getStartupBookings(userId) {
  const objectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : null;

  // 1. Find startup by userId
  const startup = await Startup.findOne({
    $or: [{ userId: objectId }, { userId }],
  }).lean();

  if (!startup) {
    return [];
  }

  // 2. Use mongoose native connection
  const db = mongoose.connection.db;

  const bookings = await db
    .collection("Bookings")
    .find({ startupId: startup._id }) // IMPORTANT
    .sort({ createdAt: -1 })
    .toArray();

  return bookings;
}

module.exports = {
  getProfile,
  updateProfile,
  getStartupBookings,
};
