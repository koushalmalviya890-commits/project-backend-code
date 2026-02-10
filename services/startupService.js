const mongoose = require("mongoose");
const Startup = require("../src/models/Startup");
const { connectDB } = require("../src/config/database");
const Booking = require("../src/models/Booking");
const Facility = require("../src/models/Facility");
const ServiceProvider = require("../src/models/ServiceProvider");

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
  try {
    const objectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;

    // 1. Find the startup
    const startup = await Startup.findOne({
      $or: [{ userId: objectId }, { userId }],
    }).lean();

    if (!startup) {
      return [];
    }

    // 2. Fetch the raw bookings
    const bookings = await Booking.find({
      startupId: startup.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!bookings.length) return [];

    // ---------------------------------------------------------
    // MANUAL LOOKUP (Safe replacement for .populate)
    // ---------------------------------------------------------

    // A. Collect all unique IDs from the bookings
    const facilityIds = [...new Set(bookings.map((b) => b.facilityId))];
    const providerIds = [...new Set(bookings.map((b) => b.incubatorId))];

    // B. Fetch all related Facilities and Service Providers in one go
const facilities = await Facility.find({ _id: { $in: facilityIds } })
      .select("details.name details.images facilityType address city state") 
      .lean();

const providers = await ServiceProvider.find({ userId: { $in: providerIds } })
      .select("userId serviceName logoUrl primaryEmailId") 
      .lean();

    // C. Create lookup maps for faster access
    const facilityMap = {};
    facilities.forEach((f) => {
      facilityMap[f._id.toString()] = f;
    });

 const providerMap = {};
    providers.forEach((p) => {
      // ✅ FIX: Safely convert to string to match the lookup key
      if (p.userId) {
        providerMap[p.userId.toString()] = p;
      }
    });

    // D. Attach the details to each booking object
   const enrichedBookings = bookings.map((booking) => {
      // Handle missing IDs gracefully
      const fId = booking.facilityId ? booking.facilityId.toString() : "";
      const pId = booking.incubatorId ? booking.incubatorId.toString() : "";

      const facility = facilityMap[fId] || {};
      const provider = providerMap[pId] || {};

      // Helper to safely access nested details
      const fDetails = facility.details || {};

      return {
        ...booking,
        facilityDetails: {
          name: fDetails.name || "Unknown Facility", // Accessing details.name
          location: facility.city 
            ? `${facility.city}, ${facility.state}` 
            : (facility.address || "Unknown Location"),
          type: facility.facilityType || "Workspace", // Accessing facilityType
          images: fDetails.images || [], // Accessing details.images
        },
        serviceProviderDetails: {
          name: provider.serviceName || "Unknown Provider", // Accessing serviceName
          logoUrl: provider.logoUrl || "",
          email: provider.primaryEmailId || "", // Accessing primaryEmailId
        },
      };
    });
    return enrichedBookings;
  } catch (error) {
    console.error("Error in getStartupBookings Service:", error);
    throw error;
  }
}


module.exports = {
  getProfile,
  updateProfile,
  getStartupBookings,
};
