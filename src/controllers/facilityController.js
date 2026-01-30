const Facility = require('../models/Facility');
const mongoose = require('mongoose');

// POST /api/facilities
exports.createFacility = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const data = req.body;

    // Process relevant sectors (Logic from your Next.js code)
    const processedSectors = (data.relevantSectors || [])
      .slice(0, 3)
      .map(sector => sector.toLowerCase().replace(/\s+/g, '-'));

    // Construct Facility Data
    const facilityData = {
      ...data,
      serviceProviderId: userId,
      status: data.status || 'pending',
      isFeatured: data.isFeatured || false,
      privacyType: data.privacyType || 'public',
      relevantSectors: processedSectors
    };

    // Save to Database
    const facility = await Facility.create(facilityData);

    res.status(201).json({ 
      success: true, 
      id: facility._id 
    });

  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create facility',
      details: error.errors || {}
    });
  }
};

// GET /api/facilities
exports.getFacilities = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch facilities for this provider
    const facilities = await Facility.find({ 
      serviceProviderId: userId 
      // privacyType: 'public' // Uncomment if you want to filter strictly like your GET logic option
    }).sort({ updatedAt: -1 });

    res.status(200).json(facilities);

  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).send('Internal Server Error');
  }
};

// DELETE /api/facilities/:id
exports.deleteFacility = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).send('Facility ID is required');
    }

    const result = await Facility.deleteOne({
      _id: id,
      serviceProviderId: userId // Ensure ownership
    });

    if (result.deletedCount === 0) {
      return res.status(404).send('Facility not found or unauthorized');
    }

    res.status(200).send('Facility deleted successfully');

  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).send('Internal Server Error');
  }
};

// PATCH /api/facilities/:id
exports.updateFacility = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body; // In your Next.js logic, the entire body replaced 'details'

    if (!id) {
      return res.status(400).send('Facility ID is required');
    }

    // Logic from your Next.js PATCH: 
    // 1. Update 'details' with the body content
    // 2. Reset status to 'pending'
    // 3. Update 'updatedAt'
    const facility = await Facility.findOneAndUpdate(
      { _id: id, serviceProviderId: userId },
      {
        $set: {
          details: updates,
          status: 'pending',
          updatedAt: new Date()
        }
      },
      { new: true } // Return the updated document
    );

    if (!facility) {
      return res.status(404).send('Facility not found or unauthorized');
    }

    res.status(200).send('Facility updated successfully');

  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).send('Internal Server Error');
  }
};