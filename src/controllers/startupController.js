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


