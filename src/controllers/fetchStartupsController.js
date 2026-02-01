const FacilityStartups = require("../models/FacilityStartups");
const Startup = require("../models/Startup");
const mongoose = require("mongoose");


exports.getCustomers = async (req, res) => {
  try {
    const incubatorId = new mongoose.ObjectId(req.user.id);

    const mappings = await FacilityStartups.find({ incubatorId })
      .populate({
        path: "startupId",
        select: "-__v",
      })
      .lean();

    const startups = mappings.map((m) => m.startupId).filter(Boolean);

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

    res.json({ success: true });
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

    await FacilityStartups.deleteOne({
      incubatorId,
      startupId,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Remove startup error:", error);
    res.status(500).json({ message: "Failed to remove startup" });
  }
};



//trislllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
// lllllllllllllllllllllll"?