const mongoose = require("mongoose");
const BookingExtension = require("../models/BookingExtension");
const Startup = require("../models/Startup");

async function createExtension(userId, payload) {
  const objectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : null;

  // 1. Find startup
  const startup = await Startup.findOne({
    $or: [{ userId: objectId }, { userId }],
  });

  if (!startup) {
    throw new Error("Startup not found");
  }

  // 2. Create extension request
  const extension = await BookingExtension.create({
    bookingId: payload.bookingId,
    startupId: startup._id,
    requestedEndDate: payload.requestedEndDate,
    reason: payload.reason || null,
  });

  return extension;
}

async function getExtensionsByBooking(bookingId) {
  return BookingExtension.find({ bookingId }).sort({ createdAt: -1 }).lean();
}

module.exports = {
  createExtension,
  getExtensionsByBooking,
};
