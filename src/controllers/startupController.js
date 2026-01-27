// import Startup from '../models/Startup.js';
// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const Startup = require('../models/Startup');

// GET PROFILE
exports.getStartupProfile = async (req, res) => {
  try {
    // req.user is populated by our 'protect' middleware
    const profile = await Startup.findOne({ 
      userId: new mongoose.Types.ObjectId(req.user.id) 
    }).select('-__v').lean();

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching startup profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
        updatedAt: new Date()
      },
      { new: true }
    ).select('-__v').lean();

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating startup profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};