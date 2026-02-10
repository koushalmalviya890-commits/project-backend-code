const mongoose = require("mongoose");
const BookingExtension = require("../models/BookingExtension"); // Ensure model is imported
const Booking = require("../models/Booking");
const Startup = require("../models/Startup");
const Facility = require("../models/Facility");
const ServiceProvider = require("../models/ServiceProvider");
const { sendBookingExtensionNotificationToProvider } = require("../../lib/email"); // You need to migrate this email function

// ==========================================
// 1. CREATE EXTENSION REQUEST (POST /api/extent-booking)
// ==========================================
exports.createExtentBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { bookingId, extentDays, facilityId, incubatorId, startupId } = req.body;

    // 1. Validate Input
    if (!bookingId || !extentDays || extentDays <= 0 || !incubatorId || !facilityId || !startupId) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // 2. Check for Existing Request (Restored from Next.js)
    const existingExtension = await BookingExtension.findOne({
      bookingId,
      userId: req.user.id,
      status: "pending",
    });

    if (existingExtension) {
      return res.status(409).json({ error: "Extension request already exists for this booking" });
    }

    // 3. Fetch Data for Email (Restored from Next.js)
    const startup = await Startup.findOne({ userId: new mongoose.Types.ObjectId(startupId) }).lean();
    const facility = await Facility.findById(facilityId).lean();
    const serviceProvider = await ServiceProvider.findOne({ userId: new mongoose.Types.ObjectId(incubatorId) }).lean();

    // 4. Send Email Notification
    if (startup?.startupName && facility?.details?.name && serviceProvider?.primaryEmailId) {
      try {
        await sendBookingExtensionNotificationToProvider({
          to: serviceProvider.primaryEmailId,
          startupName: startup.startupName,
          facilityName: facility.details.name,
          extentDays,
        });
      } catch (emailErr) {
        console.error("Failed to send extension email:", emailErr);
        // Continue execution even if email fails
      }
    }

    // 5. Create Extension Record
    const extensionRequest = await BookingExtension.create({
      bookingId,
      startupId,
      incubatorId,
      facilityId,
      userId: req.user.id,
      extentDays,
      status: "pending",
      requestedAt: new Date(),
    });

    res.status(201).json({
      message: "Extension request sent successfully",
      extensionId: extensionRequest._id,
    });

  } catch (error) {
    console.error("Error creating extension request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==========================================
// 2. GET EXTENSIONS FOR PROVIDER (GET /api/extent-booking)
// ==========================================
exports.getExtentBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const providerId = req.user.id;

    // 1. Fetch extensions for this provider
    const extensions = await BookingExtension.find({
      incubatorId: providerId,
    }).sort({ createdAt: -1 }).lean();

    // 2. Enrich with Names (Restored from Next.js logic)
    // This is crucial for the frontend to show "Startup Name" and "Facility Name"
    const enrichedExtensions = await Promise.all(
      extensions.map(async (ext) => {
        const startup = await Startup.findOne({ userId: new mongoose.Types.ObjectId(ext.startupId) }).select('startupName').lean();
        const facility = await Facility.findById(ext.facilityId).select('details.name').lean();

        return {
          ...ext,
          startupName: startup?.startupName || "Unknown Startup",
          facilityName: facility?.details?.name || "Unknown Facility",
        };
      })
    );

    res.json(enrichedExtensions);

  } catch (error) {
    console.error("Error fetching extension requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==========================================
// 3. UPDATE STATUS (PATCH /api/extent-booking/:id)
// ==========================================
exports.updateExtentStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await BookingExtension.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Extension request not found" });
    }

    res.json({ message: "Status updated successfully", updated });

  } catch (error) {
    console.error("Error updating extension status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==========================================
// 4. GET STATUS FOR SPECIFIC BOOKING (GET /api/extent-booking/status/:bookingId)
// ==========================================
exports.getExtensionStatusForBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { bookingId } = req.params;

    // ✅ CHANGE: Use 'find' instead of 'findOne' to get ALL history
    const extensions = await BookingExtension.find({ 
      bookingId: bookingId 
    }).sort({ createdAt: -1 }); // Newest first

    // Return empty array if none found, instead of null
    res.json(extensions || []); 
  } catch (error) {
    console.error("Error fetching extension status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};