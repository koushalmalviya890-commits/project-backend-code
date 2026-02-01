const FacilityStartups = require("../models/FacilityStartups");
const Startup = require("../models/Startup");
const mongoose = require("mongoose");

exports.getCustomers = async (req, res) => {
  try {
    const incubatorId = new mongoose.ObjectId(req.user.id);
    const startups = await FacilityStartups.aggregate([
      {
        $match: { incubatorId: incubatorId },
      },
      {
        $lookup: {
          from: "startups", // Ensure this matches your DB collection name (lowercase usually)
          localField: "startupId",
          foreignField: "userId", // The critical link field
          as: "startup",
        },
      },
      {
        $unwind: "$startup", // Flattens the array
      },
      {
        $replaceRoot: { newRoot: "$startup" }, // Promotes startup details to top level
      },
    ]);

    res.json(startups);
  } catch (error) {
    console.error("Fetch startups error:", error);
    res.status(500).json({ message: "Failed to fetch startups" });
  }
};

/**
 * ADD startup to incubator
 */
exports.addCustomer = async (req, res) => {
  try {
    const incubatorId = req.user.id;
    const { startupId } = req.body;

    if (!startupId) {
      return res.status(400).json({ message: "Startup ID is required" });
    }

    await FacilityStartups.findOneAndUpdate(
      {
        incubatorId,
        startupId,
      },
      {
        incubatorId,
        startupId,
      },
      { upsert: true, new: true },
    );

    res.json({ success: true, message: "Added successfully" });
  } catch (error) {
    console.error("Add startup error:", error);
    res.status(500).json({ message: "Failed to add startup" });
  }
};

/**
 * REMOVE startup from incubator
 */
exports.removeCustomer = async (req, res) => {
  try {
    const incubatorId = req.user.id;
    const { startupId } = req.body;

    if (!startupId) {
      return res.status(400).json({ message: "Startup ID is required" });
    }

    const result = await FacilityStartups.deleteOne({
      incubatorId,
      startupId,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Startup not found in your list" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Remove startup error:", error);
    res.status(500).json({ message: "Failed to remove startup" });
  }
};
