const mongoose = require("mongoose");
const Startup = require("../models/Startup");
const ServiceProvider = require("../models/ServiceProvider"); // if exists

async function checkUser(userId, email) {
  const objectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : null;

  // 1. Check Startup
  const startup = await Startup.findOne({
    $or: [{ userId: objectId }, { userId }, { email }],
  }).lean();

  if (startup) {
    return {
      exists: true,
      role: "startup",
      redirectTo: "/dashboard/startup",
    };
  }

  // 2. Check Service Provider (if model exists)
  if (ServiceProvider) {
    const provider = await ServiceProvider.findOne({
      $or: [{ userId: objectId }, { userId }, { email }],
    }).lean();

    if (provider) {
      return {
        exists: true,
        role: "provider",
        redirectTo: "/dashboard/provider",
      };
    }
  }

  // 3. New user
  return {
    exists: false,
    redirectTo: "/onboarding",
  };
}

module.exports = { checkUser };
