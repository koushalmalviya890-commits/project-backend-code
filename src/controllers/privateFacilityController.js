const mongoose = require('mongoose');
const Facility = require('../models/Facility');
const ServiceProvider = require('../models/ServiceProvider');

const ITEMS_PER_PAGE = 6;

// ==========================================
// 1. CREATE FACILITY (POST /api/private-facilities)
// ==========================================
exports.createFacility = async (req, res) => {
  try {
    // Auth Check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = req.body;
    
    const facilityData = {
      ...data,
      serviceProviderId: req.user.id,
      status: data.status || 'pending',
      isFeatured: data.isFeatured || false,
      privacyType: data.privacyType || 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newFacility = await Facility.create(facilityData);
    
    res.status(201).json({ id: newFacility._id });

  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create facility',
      details: error.errors || {} 
    });
  }
};

// ==========================================
// 2. GET MY PRIVATE FACILITIES (GET /api/private-facilities)
// ==========================================
exports.getPrivateFacilities = async (req, res) => {
  try {
    // Note: Your Next.js example had a hardcoded ID. 
    // In production, this should be the logged-in user or passed via query.
    // Assuming logged-in user for safety:
    
    // const serviceProviderId = new mongoose.Types.ObjectId('686947db9db93388ec987db6'); // Hardcoded in Next.js example
    // BETTER: Use logged-in user
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
    const serviceProviderId = new mongoose.Types.ObjectId(req.user.id);

    const facilities = await Facility.find({
      serviceProviderId,
      privacyType: 'private' // ✅ Only fetch private listings
    }).sort({ updatedAt: -1 });

    res.json(facilities);

  } catch (error) {
    console.error('Error in GET private facilities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ==========================================
// 3. SEARCH PRIVATE (GET /api/private-facilities/search-private)
// ==========================================
exports.searchPrivateFacilities = async (req, res) => {
  try {
    const userId = req.query.id; // Provider ID to filter by
    const page = parseInt(req.query.page || '1');
    const search = req.query.search || '';
    const searchScope = req.query.searchScope || 'full';
    const listingStatus = req.query.listingStatus || 'All';
    const propertyTypesParam = req.query.propertyTypes || 'All';
    const minPrice = parseInt(req.query.minPrice || '0');
    const maxPrice = parseInt(req.query.maxPrice || '100000');
    const location = req.query.location || '';
    const sortBy = req.query.sortBy || 'newest';
    const isFeatured = req.query.isFeatured === 'true';
    const city = req.query.city || '';
    const state = req.query.state || '';
    const facilityType = req.query.facilityType || '';
    
    // ... [Reuse filters for listingStatus, minPrice, etc.] ...
    // Assuming standard filters are passed
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Valid Provider ID required' });
    }

    const query = {
      serviceProviderId: new mongoose.Types.ObjectId(userId),
      status: 'active',
      // privacyType: 'private' // Optional: Enforce private only? Next.js code didn't strictly enforce it here.
    };

    if (isFeatured) query.isFeatured = true;

    // Search Logic
    if (search) {
      if (searchScope === 'header') {
        query['$or'] = [
          { 'details.name': { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { pincode: { $regex: search, $options: 'i' } }
        ];
      } else {
        query['$or'] = [
          { 'details.name': { $regex: search, $options: 'i' } },
          { 'details.description': { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { pincode: { $regex: search, $options: 'i' } },
          { facilityType: { $regex: search.toLowerCase().replace(/\s+/g, '-'), $options: 'i' } },
        ];
      }
    }

    if (location) {
      const locationQuery = [
        { address: { $regex: location, $options: 'i' } },
        { city: { $regex: location, $options: 'i' } },
        { state: { $regex: location, $options: 'i' } },
        { country: { $regex: location, $options: 'i' } },
        { pincode: { $regex: location, $options: 'i' } }
      ];
      query['$and'] = query['$and'] || [];
      query['$and'].push({ $or: locationQuery });
    }

    if (city) query.city = { $regex: city, $options: 'i' };
    if (state) query.state = { $regex: state, $options: 'i' };

    // --- Facility Types ---
    const propertyTypes = propertyTypesParam.split(',');
    if (!propertyTypes.includes('All')) {
      const typeMap = {
        'Individual Cabin': 'individual-cabin',
        'Coworking space': 'coworking-spaces',
        'Meeting Room': 'meeting-rooms',
        'Bio Allied': 'bio-allied-labs',
        'Manufacturing': 'manufacturing-labs',
        'Prototype Labs': 'prototyping-labs',
        'Software': 'software',
        'SaaS Allied': 'saas-allied',
        'Raw Space Office': 'raw-space-office',
        'Raw Space Lab': 'raw-space-lab',
        'Studio': 'studio'
      };
      const mappedTypes = propertyTypes.map(type => typeMap[type]).filter(Boolean);
      if (mappedTypes.length > 0) {
        query.facilityType = { $in: mappedTypes };
      }
    }

    if (facilityType) {
      const facilityTypes = facilityType.split(',');
      query.facilityType = { $in: facilityTypes };
    }

    // --- Rental Plan Logic ---
    if (listingStatus !== 'All') {
      query['details.rentalPlans'] = {
        $elemMatch: {
          name: listingStatus,
          price: { $gte: minPrice, $lte: maxPrice }
        }
      };
    } else {
      query['details.rentalPlans'] = {
        $elemMatch: {
          price: { $gte: minPrice, $lte: maxPrice }
        }
      };
    }

    // --- Sorting ---
    let sortOptions = {};
    switch (sortBy) {
      case 'newest': sortOptions = { isFeatured: -1, createdAt: -1 }; break;
      case 'oldest': sortOptions = { isFeatured: -1, createdAt: 1 }; break;
      default: sortOptions = { isFeatured: -1, createdAt: -1 };
    }


    const skip = (page - 1) * ITEMS_PER_PAGE;
    const totalCount = await Facility.countDocuments(query);

    const facilities = await Facility.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'Service Provider',
          localField: 'serviceProviderId',
          foreignField: 'userId',
          as: 'serviceProvider'
        }
      },
      { $unwind: { path: '$serviceProvider', preserveNullAndEmptyArrays: true } },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: ITEMS_PER_PAGE }
    ]);

    // Transform
    const transformed = facilities.map(f => ({
      _id: f._id,
      details: f.details,
      features: f.serviceProvider?.features || [],
      address: f.address,
      city: f.city,
      state: f.state,
      country: f.country,
      isFeatured: f.isFeatured,
      facilityType: f.facilityType,
      serviceProvider: f.serviceProvider ? { serviceName: f.serviceProvider.serviceName } : null,
      timings: f.timings
    }));

    res.json({
      facilities: transformed,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        totalItems: totalCount,
        itemsPerPage: ITEMS_PER_PAGE
      }
    });

  } catch (error) {
    console.error('Error in searchPrivateFacilities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ==========================================
// 4. UPDATE STATUS (PATCH /api/private-facilities/status/:id)
// ==========================================
exports.updateFacilityStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus || !['active', 'inactive'].includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status. Must be active or inactive.' });
    }

    const serviceProviderId = req.user.id;

    // 1. Find Facility
    const facility = await Facility.findOne({ _id: id, serviceProviderId });

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found or unauthorized' });
    }

    // 2. Validate Current Status
    if (!['active', 'inactive'].includes(facility.status)) {
      return res.status(403).json({ error: 'Cannot change status of pending/rejected facilities' });
    }

    // 3. Update
    facility.status = newStatus;
    facility.updatedAt = new Date();
    await facility.save();

    res.json({
      success: true,
      message: `Facility ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      status: newStatus
    });

  } catch (error) {
    console.error('Error updating facility status:', error);
    res.status(500).json({ error: 'Failed to update facility status' });
  }
};

// ==========================================
// 5. GET BY PROVIDER (GET /api/private-facilities/by-provider/:id)
// ==========================================
exports.getFacilitiesByProvider = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).send('Service Provider ID is required');

    const serviceProviderId = new mongoose.Types.ObjectId(id);

    const facilities = await Facility.aggregate([
      {
        $match: {
          serviceProviderId,
          status: 'active'
        }
      },
      {
        $lookup: {
          from: 'Service Provider',
          localField: 'serviceProviderId',
          foreignField: 'userId',
          as: 'serviceProviderDetails'
        }
      },
      {
        $addFields: {
          serviceProvider: {
            serviceName: { $arrayElemAt: ['$serviceProviderDetails.serviceName', 0] },
            serviceProviderType: { $arrayElemAt: ['$serviceProviderDetails.serviceProviderType', 0] },
            features: { $ifNull: [{ $arrayElemAt: ['$serviceProviderDetails.features', 0] }, []] }
          }
        }
      },
      {
        $project: {
          serviceProviderDetails: 0 // Remove raw lookup array
        }
      },
      {
        $sort: { isFeatured: -1, updatedAt: -1 }
      }
    ]);

    res.json(facilities);

  } catch (error) {
    console.error('Error in getFacilitiesByProvider:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ==========================================
// 6. DELETE FACILITY (DELETE /api/private-facilities/:id)
// ==========================================
exports.deleteFacility = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const serviceProviderId = req.user.id;

    const result = await Facility.deleteOne({ _id: id, serviceProviderId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    res.json({ message: 'Facility deleted successfully' });

  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ==========================================
// 7. UPDATE FACILITY DETAILS (PATCH /api/private-facilities/:id)
// ==========================================
exports.updateFacilityDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const body = req.body;
    const serviceProviderId = req.user.id;

    const result = await Facility.findOneAndUpdate(
      { _id: id, serviceProviderId },
      {
        $set: {
          details: body,
          status: 'pending', // Reset status on edit
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!result) return res.status(404).json({ error: 'Facility not found' });

    res.json({ message: 'Facility updated successfully' });

  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// ==========================================
// 8. GET SINGLE FACILITY (GET /api/private-facilities/:id)
// ==========================================
exports.getPrivateFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    // Fetch facility
    const facility = await Facility.findById(id).lean();

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    // Fetch Service Provider
    // Logic: Try matching userId first (standard), fallback to _id
    let serviceProvider = await ServiceProvider.findOne({ userId: facility.serviceProviderId }).lean();
    
    if (!serviceProvider) {
      serviceProvider = await ServiceProvider.findById(facility.serviceProviderId).lean();
    }

    // Transform Data (Matching Next.js response structure)
    const transformedFacility = {
      ...facility,
      _id: facility._id.toString(),
      serviceProviderId: facility.serviceProviderId.toString(),
      serviceProvider: serviceProvider ? {
        serviceName: serviceProvider.serviceName,
        _id: serviceProvider._id.toString(),
        logoUrl: serviceProvider.logoUrl || null,
      } : null,
    };

    res.json(transformedFacility);

  } catch (error) {
    console.error('Error fetching private facility:', error);
    res.status(500).json({ error: 'Failed to fetch facility' });
  }
};

// ==========================================
// 9. UPDATE FACILITY (PATCH /api/private-facilities/:id)
// ==========================================
exports.updatePrivateFacility = async (req, res) => {
  try {
    // Auth Check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const data = req.body;

    if (!data) return res.status(400).json({ error: 'No data provided' });

    // 1. Find Facility & Verify Ownership
    const facility = await Facility.findOne({ 
      _id: id,
      serviceProviderId: req.user.id 
    }).lean();

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    // 2. Deep Merge Logic (Crucial for Mixed Types like details)
    const updatePayload = {
      ...facility,
      ...data,
      status: 'pending', // Force status reset on edit
      details: {
        ...facility.details,
        ...(data.details || {})
      },
      timings: {
        ...facility.timings,
        ...(data.timings || {})
      },
      updatedAt: new Date()
    };

    // Handle Arrays specifically to ensure replacement if provided
    if (data.details?.rentalPlans) updatePayload.details.rentalPlans = data.details.rentalPlans;
    if (data.details?.images) updatePayload.details.images = data.details.images;
    if (data.details?.equipment) updatePayload.details.equipment = data.details.equipment;
    if (data.details?.areaDetails) updatePayload.details.areaDetails = data.details.areaDetails;
    if (data.details?.studioDetails) {
        updatePayload.details.studioDetails = {
            ...facility.details.studioDetails,
            ...data.details.studioDetails
        };
    }

    // 3. Validation (Reusing the helper from facilityController logic)
    const validationError = validateFacilityData(updatePayload);
    if (validationError) {
      return res.status(400).json({ 
        error: 'Document validation failed', 
        message: validationError 
      });
    }

    // 4. Update
    const updatedFacility = await Facility.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: false } // Disable Schema validators to prevent context issues
    );

    res.json(updatedFacility);

  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({ error: 'Failed to update facility', details: error.message });
  }
};

// ==========================================
// 10. DELETE FACILITY (DELETE /api/private-facilities/:id)
// ==========================================
exports.deletePrivateFacility = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    
    const result = await Facility.deleteOne({ 
      _id: id, 
      serviceProviderId: req.user.id 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    res.json({ message: 'Facility deleted successfully' });

  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// --- Validation Helper (Copy this to the bottom of the file) ---
function validateFacilityData(doc) {
  const { facilityType, details } = doc;
  if (!details || typeof details !== 'object') return 'Details must be a valid object';
  if (!details.name) return 'Facility name is required';
  if (!Array.isArray(details.images) || details.images.length === 0) return 'At least one image is required';
  
  if (!Array.isArray(details.rentalPlans) || details.rentalPlans.length === 0) return 'At least one rental plan is required';
  
  // Basic Rental Plan Check
  for (const plan of details.rentalPlans) {
    if (!plan.name || !plan.price || !plan.duration) return 'Incomplete rental plan data';
  }
  // Type-Specific Checks
  switch (facilityType) {
    case 'individual-cabin':
      if (typeof details.totalCabins !== 'number') return 'Total Cabins must be a number';
      if (typeof details.availableCabins !== 'number') return 'Available Cabins must be a number';
      break;

    case 'coworking-spaces':
      if (typeof details.totalSeats !== 'number') return 'Total Seats must be a number';
      if (typeof details.availableSeats !== 'number') return 'Available Seats must be a number';
      break;

    case 'meeting-rooms':
      if (typeof details.totalRooms !== 'number') return 'Total Rooms must be a number';
      if (typeof details.seatingCapacity !== 'number') return 'Seating Capacity must be a number';
      break;

    case 'bio-allied-labs':
    case 'manufacturing-labs':
    case 'prototyping-labs':
    case 'saas-allied':
    case 'software':
      if (!Array.isArray(details.equipment) || details.equipment.length === 0) {
        return `Equipment list is required for ${facilityType}`;
      }
      break;

    case 'raw-space-office':
    case 'raw-space-lab':
      if (!Array.isArray(details.areaDetails) || details.areaDetails.length === 0) {
        return `Area details are required for ${facilityType}`;
      }
      break;

    case 'studio':
      if (!details.studioDetails) return 'Studio details are required';
      if (!details.studioDetails.facilityName) return 'Studio facility name is required';
      if (!Array.isArray(details.studioDetails.equipmentDetails)) return 'Studio equipment details required';
      break;

    case 'event-workspace':
      if (typeof details.seatingCapacity !== 'number') return 'Seating Capacity is required';
      break;
  }

  return null;
}
