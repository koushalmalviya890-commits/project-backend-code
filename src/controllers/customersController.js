
const { getCustomersForProvider } = require("../../services/customersService");

const FacilityStartups = require("../models/FacilityStartups");
const Startup = require("../models/Startup"); // Ensure you have this model
const mongoose = require("mongoose");


// --- 1. GET MY CUSTOMERS (Mapped Startups) ---
// Matches the first Next.js file logic
exports.getCustomers = async (req, res) => {
  try {
    const incubatorId = new mongoose.Types.ObjectId(req.user.id);

    // Aggregation pipeline to join FacilityStartups with Startups
    const startups = await FacilityStartups.aggregate([
      {
        $match: { incubatorId: incubatorId }
      },
      {
        $lookup: {
          from: 'Startups', // Check DB: usually 'startups' (lowercase)
          localField: 'startupId',
          foreignField: 'userId', // Linking via userId
          as: 'startup'
        }
      },
      {
        $unwind: '$startup'
      },
      {
        $replaceRoot: { newRoot: '$startup' }
      }
    ]);

    res.json(startups);
  } catch (error) {
    console.error("Fetch startups error:", error);
    res.status(500).json({ message: "Failed to fetch startups" });
  }
};

// --- 2. SEARCH STARTUPS (By Email Domain) ---
// Matches the second Next.js file logic
exports.searchStartups = async (req, res) => {
  try {
    const { emailDomain } = req.query;

    if (!emailDomain) {
      return res.status(400).json({ error: 'emailDomain query parameter is required' });
    }

    // Find startups matching the mail ID
    // Note: Assuming 'startupMailId' is the field name in your Startup model
    const customers = await Startup.find({ startupMailId: emailDomain });

    res.json(customers);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to search customers" });
  }
};

// --- 3. ADD CUSTOMER ---
exports.addCustomer = async (req, res) => {
  try {
    const incubatorId = req.user.id;
    const { startupId } = req.body;

    if (!startupId) {
      return res.status(400).json({ message: "Startup ID is required" });
    }

    await FacilityStartups.findOneAndUpdate(
      { incubatorId, startupId },
      { incubatorId, startupId },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Added successfully" });
  } catch (error) {
    console.error("Add startup error:", error);
    res.status(500).json({ message: "Failed to add startup" });
  }
};

// --- 4. REMOVE CUSTOMER ---
exports.removeCustomer = async (req, res) => {
  try {
    const incubatorId = req.user.id;
    const { startupId } = req.body;

    if (!startupId) {
      return res.status(400).json({ message: "Startup ID is required" });
    }

    const result = await FacilityStartups.deleteOne({
      incubatorId,
      startupId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Startup not found in your list" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Remove startup error:", error);
    res.status(500).json({ message: "Failed to remove startup" });
  }
};
