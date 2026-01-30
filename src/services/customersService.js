const mongoose = require("mongoose");
const Startup = require("../models/Startup");
const ServiceProvider = require("../models/ServiceProvider");

async function getCustomersForProvider(providerUserId) {
  const objectId = mongoose.Types.ObjectId.isValid(providerUserId)
    ? new mongoose.Types.ObjectId(providerUserId)
    : providerUserId;

  // 1. Find service provider
  const provider = await ServiceProvider.findOne({
    $or: [{ userId: objectId }, { userId: providerUserId }],
  }).lean();

  if (!provider) return [];

  const db = mongoose.connection.db;

  // 2. Find provider facilities (NATIVE COLLECTION)
  const facilities = await db
    .collection("Facilities")
    .find({ serviceProviderId: provider._id })
    .project({ _id: 1 })
    .toArray();

  if (!facilities.length) return [];

  const facilityIds = facilities.map((f) => f._id);

  // 3. Find bookings for those facilities
  const bookings = await db
    .collection("Bookings")
    .find({ facilityId: { $in: facilityIds } })
    .toArray();

  if (!bookings.length) return [];

  // 4. Unique startupIds
  const startupIds = [
    ...new Set(bookings.map((b) => b.startupId?.toString()).filter(Boolean)),
  ].map((id) => new mongoose.Types.ObjectId(id));

  // 5. Fetch startup details
  const startups = await Startup.find({
    _id: { $in: startupIds },
  })
    .select("startupName logoUrl city state userId")
    .lean();

  return startups;
}

module.exports = { getCustomersForProvider };
