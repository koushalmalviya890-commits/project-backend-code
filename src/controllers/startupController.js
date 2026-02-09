// import Startup from '../models/Startup.js';
// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const startupService = require("../../services/startupService");
const Startup = require("../models/Startup");
exports.getStartupProfile = async (req, res) => {
  try {
    // req.user is populated by our 'protect' middleware
    const profile = await Startup.findOne({
      userId: new mongoose.Types.ObjectId(req.user.id),
    })
      .select("-__v")
      .lean();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching startup profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE PROFILE
exports.updateStartupProfile = async (req, res) => {
  try {
    const body = req.body;

    const updatedProfile = await Startup.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(req.user.id) },
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true },
    )
      .select("-__v")
      .lean();

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating startup profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getStartupBookings = async (req, res) => {
  const { userId } = req.params;
console.log("Received userId:", userId);
  try {
    const bookings = await startupService.getStartupBookings(userId);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching startup bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }

}

exports.getStartupByUserId = async (req, res) => {
  try {
    // 1. Get userId from query params (matching Next.js behavior)
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }

    // 2. Use the Service to fetch (It handles the ObjectId vs String logic)
    const startup = await startupService.getProfile(userId);

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    res.json(startup);
  } catch (error) {
    console.error('Error fetching startup by user id:', error);
    res.status(500).json({ error: 'Failed to fetch startup details' });
  }
};
