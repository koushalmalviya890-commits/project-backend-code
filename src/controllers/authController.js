// import bcrypt from 'bcryptjs';
const bcrypt = require('bcryptjs');
//  import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken';
const User = require("../models/User"); // Ensure you copy your User model from Nextjs to here
const ServiceProvider = require("../models/ServiceProvider"); // Copy this model too
const Startup = require("../models/Startup");
// import AffiliateLinkUser from '../models/AffiliateLinkUsers.js';
// import crypto from 'crypto';
// 3. REGISTER STARTUP (Detailed Signup)


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // In authController.js, add validation at the top of login function
if (!process.env.JWT_SECRET) {
  return res.status(500).json({ 
    message: 'Server configuration error: JWT_SECRET not configured' 
  });
}
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Check Approval Status
    if (user.userType === 'Service Provider' || user.role === 'enabler') {
      const profile = await ServiceProvider.findOne({ userId: user._id });
      if (!profile?.isApproved) return res.status(403).json({ message: "Pending approval" });
    }

    const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // or 'none' if backend/frontend are on different domains in prod
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path:'/',
    });

    res.json({ user: { id: user._id, email: user.email, name: user.name, userType: user.userType } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... imports (User model)

exports.updateUserType = async (req, res) => {
  const { email, userType } = req.body;

  try {
    // 1. Validate Input
    if (!['startup', 'Service Provider'].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // 2. Find and Update User
    // We use findOneAndUpdate to get the result back
    const user = await User.findOneAndUpdate(
      { email: email }, 
      { $set: { userType: userType } },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Return Success
    res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Update User Type Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
};



exports.completeProfile = async (req, res) => {
  // 1. Get user ID from the authenticated session (req.user)
  // Note: Your auth middleware must set req.user
  const userId = req.user._id || req.user.id; 
  
  const { userType, ...profileData } = req.body;

  try {
    // --- Step A: Update the User Model (Set User Type) ---
    const user = await User.findByIdAndUpdate(
      userId, 
      { userType },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // --- Step B: Create/Update the Specific Profile ---
    let profile;

    if (userType === 'startup') {
      // Logic adapted from your updateStartupProfile
      profile = await Startup.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { 
            ...profileData,
            email: user.email, // Ensure email links correctly
            updatedAt: new Date() 
        },
        { new: true, upsert: true } // 'upsert' creates it if it doesn't exist
      );
    } 
    else if (userType === 'Service Provider' || userType === 'Incubator' || userType === 'Accelerator') {
      // Note: Your frontend sends specific types like 'Incubator' as serviceProviderType, 
      // but the main userType is usually 'Service Provider'.
      // If your frontend sends "Service Provider" as the main type:
      
      const updateData = {
        ...profileData,
        userId: userId,
        // Ensure arrays are initialized
        features: Array.isArray(profileData.features) ? profileData.features : [],
        images: Array.isArray(profileData.images) ? profileData.images : [],
        timings: profileData.timings || {
          monday: { isOpen: false },
          tuesday: { isOpen: false },
          wednesday: { isOpen: false },
          thursday: { isOpen: false },
          friday: { isOpen: false },
          saturday: { isOpen: false },
          sunday: { isOpen: false }
        },
        updatedAt: new Date()
      };

      profile = await ServiceProvider.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        updateData,
        { new: true, upsert: true }
      );
    } else {
        return res.status(400).json({ message: "Invalid user type selected" });
    }

    // --- Step C: Return Success ---
    res.status(200).json({ 
        success: true, 
        user, 
        profile 
    });

  } catch (error) {
    console.error("Complete Profile Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





// exports.completeProfile = async (req, res) => {
//   const { userType, ...profileData } = req.body;
//   const userId = req.user.id; // Assumes your auth middleware sets req.user

//   try {
//     // 1. Update the User Model to set the userType
//     await User.findByIdAndUpdate(userId, { userType });

//     // 2. Update/Create the specific Profile
//     if (userType === 'startup') {
//        // Logic from updateStartupProfile
//        await Startup.findOneAndUpdate(
//          { userId: new mongoose.Types.ObjectId(userId) },
//          { ...profileData, updatedAt: new Date() },
//          { new: true, upsert: true } // 'upsert: true' creates it if it doesn't exist
//        );
//     } 
//     else if (userType === 'Service Provider') {
//        // Logic from updateServiceProviderProfile
//        const updateData = {
//           ...profileData,
//           features: Array.isArray(profileData.features) ? profileData.features : [],
//           images: Array.isArray(profileData.images) ? profileData.images : [],
//           // ... mapping timings ...
//           updatedAt: new Date()
//        };

//        await ServiceProvider.findOneAndUpdate(
//          { userId: new mongoose.Types.ObjectId(userId) },
//          updateData,
//          { new: true, upsert: true }
//        );
//     }

//     res.status(200).json({ success: true, message: "Profile completed" });

//   } catch (error) {
//     console.error("Complete Profile Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };