const ServiceProvider = require("../models/ServiceProvider");
const mongoose = require("mongoose");

// --- GET PROFILE ---
exports.getServiceProviderProfile = async (req, res) => {
  try {
    // 1. Get User ID from Middleware
    const userId = req.user._id || req.user.id;

    // 2. Find Profile
    const profile = await ServiceProvider.findOne({ userId }).lean();

    if (!profile) {
      // If no profile exists yet, return empty data or 404
      // Returning 404 might trigger error handling in frontend, 
      // returning null/empty allows the form to start fresh.
      return res.status(200).json({ data: null });
    }

    // 3. Format Data (Match the structure your Frontend expects)
    const formattedProfile = {
      ...profile,
      userId: profile.userId.toString(),
      features: profile.features || [],
      images: profile.images || [],
      invoiceType: profile.invoiceType || 'cumma',
      applyGst: profile.applyGst || 'no',
      invoiceTemplate: profile.invoiceTemplate || 'template1',
      settlementType: profile.settlementType || 'monthly',
      gstNumber: profile.gstNumber || '',
      timings: profile.timings || {
        monday: { isOpen: false },
        tuesday: { isOpen: false },
        wednesday: { isOpen: false },
        thursday: { isOpen: false },
        friday: { isOpen: false },
        saturday: { isOpen: false },
        sunday: { isOpen: false }
      }
    };

    // Return in the format your frontend expects { data: ... }
    res.status(200).json({ success: true, data: formattedProfile });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- UPDATE PROFILE ---
exports.updateServiceProviderProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const data = req.body;

    // 1. Prepare Update Data (Clean arrays and nested objects)
    const updateData = {
      ...data,
      userId: userId, // Ensure ID stays linked
      features: Array.isArray(data.features) ? data.features : [],
      images: Array.isArray(data.images) ? data.images : [],
      invoiceType: data.invoiceType || 'cumma',
      gstNumber: data.gstNumber === '' ? '' : data.gstNumber,
      applyGst: data.applyGst || "no",
      settlementType: data.settlementType || "monthly",
      invoiceTemplate: data.invoiceTemplate || "template1",
      // Ensure timings object is structured correctly
      timings: {
        monday: { ...data.timings?.monday },
        tuesday: { ...data.timings?.tuesday },
        wednesday: { ...data.timings?.wednesday },
        thursday: { ...data.timings?.thursday },
        friday: { ...data.timings?.friday },
        saturday: { ...data.timings?.saturday },
        sunday: { ...data.timings?.sunday },
      },
      updatedAt: new Date()
    };

    // 2. Update or Create (Upsert)
    const updatedProfile = await ServiceProvider.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      { new: true, upsert: true, runValidators: true }
    ).lean();

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Failed to update profile' });
    }

    res.status(200).json({ success: true, data: updatedProfile });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
};