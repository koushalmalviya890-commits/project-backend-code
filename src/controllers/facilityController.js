const Facility = require('../models/Facility');
const mongoose = require('mongoose');
const ServiceProvider = require('../models/ServiceProvider'); 


const ITEMS_PER_PAGE = 6;

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
      serviceProviderId: userId,
      status: { $ne: 'rejected' } // Exclude rejected facilities from frontend responses
      // privacyType: 'public' // Uncomment if you want to filter strictly like your GET logic option
    }).sort({ updatedAt: -1 });

    res.status(200).json(facilities);

  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).send('Internal Server Error');
  }
};

// GET /api/facilities/:id
exports.getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid facility ID format' });
    }

    // 1. Find Facility
    const facility = await Facility.findById(id).lean();

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    // Do not expose facilities that were rejected
    if (facility.status === 'rejected') {
      return res.status(404).json({ error: 'Facility not found' });
    }
    // 2. Get Service Provider Info
    // The model typically stores this as an ObjectId, but we handle string/ObjectId just in case
    const serviceProviderId = facility.serviceProviderId;

    // Try finding by userId (which links to the User model) or _id (if it's the ServiceProvider doc ID)
    let serviceProvider = await ServiceProvider.findOne({ userId: serviceProviderId }).lean();
    
    if (!serviceProvider) {
      serviceProvider = await ServiceProvider.findById(serviceProviderId).lean();
    }

    // 3. Transform Data
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

    res.status(200).json(transformedFacility);

  } catch (error) {
    console.error('Error fetching facility:', error);
    res.status(500).json({ error: 'Failed to fetch facility' });
  }
};

// DELETE /api/facilities/:id
exports.deleteFacility = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid facility ID format' });
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
    const { id } = req.params;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid facility ID format' });
    }

    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // 1. Find Existing Facility
    const facility = await Facility.findById(id).lean();

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }


    const updatePayload = {
      ...facility,       // Start with existing data
      ...data,           // Overwrite with top-level changes
      details: {
        ...facility.details,      // Keep existing details
        ...(data.details || {})   // Overwrite with new details
      },
      timings: {
        ...facility.timings,      // Keep existing timings
        ...(data.timings || {})   // Overwrite with new timings
      },
      updatedAt: new Date()
    };

    // Explicitly handle array replacements to prevent merging issues
    if (data.details?.rentalPlans) updatePayload.details.rentalPlans = data.details.rentalPlans;
    if (data.details?.images) updatePayload.details.images = data.details.images;
    if (data.details?.equipment) updatePayload.details.equipment = data.details.equipment;
    if (data.details?.areaDetails) updatePayload.details.areaDetails = data.details.areaDetails;
    if (data.details?.studioDetails) updatePayload.details.studioDetails = { ...facility.details.studioDetails, ...data.details.studioDetails };
    
    // 4. Run Manual Validation
    // This replaces the Mongoose Schema validator which breaks on updates
    const validationError = validateFacilityData(updatePayload);
    if (validationError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: [validationError] 
      });
    }

    const updatedFacility = await Facility.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: false } 
    );
    // Ensure details object exists
    // if (!data.details) {
    //   console.warn('Details object missing in update payload, using existing details');
    //   data.details = { ...facility.details };
    // } else {
    //   // Merge existing required fields if missing in payload
    //   if (!data.details.name) data.details.name = facility.details.name;
    //   if (!data.details.description) data.details.description = facility.details.description;
      
    //   if (!data.details.images || !Array.isArray(data.details.images) || data.details.images.length === 0) {
    //     data.details.images = facility.details.images;
    //   }
      
    //   if (!data.details.relevantSectors || !Array.isArray(data.details.relevantSectors) || data.details.relevantSectors.length === 0) {
    //     data.details.relevantSectors = facility.details.relevantSectors;
    //   }

    //   if (!data.details.rentalPlans || !Array.isArray(data.details.rentalPlans) || data.details.rentalPlans.length === 0) {
    //     data.details.rentalPlans = facility.details.rentalPlans;
    //   }
      
    //   // Facility Type Specific Checks
    //   const facilityType = data.facilityType || facility.facilityType;

    //   switch (facilityType) {
    //     case 'saas-allied':
    //     case 'software':
    //     case 'bio-allied-labs':
    //     case 'manufacturing-labs':
    //     case 'prototyping-labs':
    //       if (!data.details.equipment || !Array.isArray(data.details.equipment) || data.details.equipment.length === 0) {
    //         data.details.equipment = facility.details.equipment;
    //       }
    //       break;
          
    //     case 'individual-cabin':
    //       if (data.details.totalCabins === undefined) data.details.totalCabins = facility.details.totalCabins;
    //       if (data.details.availableCabins === undefined) data.details.availableCabins = facility.details.availableCabins;
    //       break;
          
    //     case 'coworking-spaces':
    //       if (data.details.totalSeats === undefined) data.details.totalSeats = facility.details.totalSeats;
    //       if (data.details.availableSeats === undefined) data.details.availableSeats = facility.details.availableSeats;
    //       break;
          
    //     case 'meeting-rooms':
    //       if (data.details.totalRooms === undefined) data.details.totalRooms = facility.details.totalRooms;
    //       if (data.details.seatingCapacity === undefined) data.details.seatingCapacity = facility.details.seatingCapacity;
    //       break;
          
    //     case 'raw-space-office':
    //     case 'raw-space-lab':
    //       if (!data.details.areaDetails || !Array.isArray(data.details.areaDetails) || data.details.areaDetails.length === 0) {
    //         data.details.areaDetails = facility.details.areaDetails;
    //       }
    //       break;
          
    //     case 'studio':
    //       if (!data.details.studioDetails) {
    //         data.details.studioDetails = facility.details.studioDetails;
    //       }
    //       break;
    //   }
    // }

    // Check timings
    if (!data.timings) {
      console.warn('Timings object missing, using existing');
      data.timings = facility.timings;
    }

    // 3. Validation Function (Ported from Next.js)
    // const validateFullDocument = (doc) => {
    //   const requiredFields = [
    //     'serviceProviderId', 'facilityType', 'status', 'details',
    //     'address', 'city', 'pincode', 'state', 'country', 'isFeatured', 'timings'
    //   ];

    //   for (const field of requiredFields) {
    //     if (doc[field] === undefined || doc[field] === null) {
    //       return { valid: false, errorMessage: `Missing required field: ${field}` };
    //     }
    //   }

    //   const { details } = doc;
    //   if (!details || typeof details !== 'object') {
    //     return { valid: false, errorMessage: 'Details must be a valid object' };
    //   }

    //   const requiredDetailsFields = ['name', 'description', 'images', 'rentalPlans'];
    //   for (const field of requiredDetailsFields) {
    //     if (!details[field]) {
    //       return { valid: false, errorMessage: `Missing required field in details: ${field}` };
    //     }
    //   }

    //   if (!Array.isArray(details.images) || details.images.length === 0) {
    //     return { valid: false, errorMessage: 'Images must be a non-empty array' };
    //   }

    //   if (!Array.isArray(details.rentalPlans) || details.rentalPlans.length === 0) {
    //     return { valid: false, errorMessage: 'Rental plans must be a non-empty array' };
    //   }

    //   // Rental Plans Validation
    //   const validPlanTypes = ['Annual', 'Monthly', 'Weekly', 'One Day (24 Hours)', 'Hourly'];
    //   for (let i = 0; i < details.rentalPlans.length; i++) {
    //     const plan = details.rentalPlans[i];
    //     if (!plan.name || !plan.price || !plan.duration) {
    //       return { valid: false, errorMessage: `Rental plan at index ${i} incomplete` };
    //     }
    //     if (!validPlanTypes.includes(plan.name) || !validPlanTypes.includes(plan.duration)) {
    //       return { valid: false, errorMessage: `Invalid rental plan type/duration at index ${i}` };
    //     }
    //   }

    //   // Timings Validation
    //   const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    //   if (!doc.timings || typeof doc.timings !== 'object') {
    //     return { valid: false, errorMessage: 'Timings must be a valid object' };
    //   }
    //   for (const day of requiredDays) {
    //     if (!doc.timings[day] || doc.timings[day].isOpen === undefined) {
    //       return { valid: false, errorMessage: `Missing/Invalid timing for ${day}` };
    //     }
    //     if (doc.timings[day].isOpen === true && (!doc.timings[day].openTime || !doc.timings[day].closeTime)) {
    //       return { valid: false, errorMessage: `Open time/close time required for ${day}` };
    //     }
    //   }

    //   return { valid: true };
    // };

    // 4. Construct Final Update Object
    // const updatePayload = {
    //   ...data,
    //   updatedAt: new Date(),
    //   createdAt: data.createdAt ? new Date(data.createdAt) : facility.createdAt
    // };

    // Ensure types
    // if (typeof updatePayload.serviceProviderId === 'string') {
    //   updatePayload.serviceProviderId = new mongoose.Types.ObjectId(updatePayload.serviceProviderId);
    // }
    // if (updatePayload.isFeatured !== undefined) {
    //   updatePayload.isFeatured = Boolean(updatePayload.isFeatured);
    // }

    // // 5. Run Validation
    // const validation = validateFullDocument(updatePayload);
    // if (!validation.valid) {
    //   return res.status(400).json({ error: validation.errorMessage });
    // }

    // // 6. Perform Update
    // const updatedFacility = await Facility.findByIdAndUpdate(
    //   id,
    //   { $set: updatePayload },
    //   { new: true, runValidators: true } // Return updated doc & run Mongoose validators
    // );
    // if (!updatedFacility) {
    //   return res.status(404).json({ error: 'Facility not found' });
    // }

    res.status(200).json(updatedFacility);

  } catch (error) {
    console.error('Error updating facility:', error);
   
    res.status(500).json({ 
      error: 'Failed to update facility', 
      details: error.message 
    });
  }
};


function validateFacilityData(doc) {
  const { facilityType, details } = doc;

  if (!details || typeof details !== 'object') return 'Details must be a valid object';
  if (!details.name) return 'Facility name is required';
  if (!details.description) return 'Facility description is required';
  if (!Array.isArray(details.images) || details.images.length === 0) return 'At least one image is required';
  
  // Rental Plans Check
  if (!Array.isArray(details.rentalPlans) || details.rentalPlans.length === 0) return 'At least one rental plan is required';
  
  for (const plan of details.rentalPlans) {
    if (!plan.name || !plan.price || !plan.duration) return 'Incomplete rental plan data';
    if (!['Annual', 'Monthly', 'Weekly', 'One Day (24 Hours)', 'Hourly'].includes(plan.name)) return `Invalid plan name: ${plan.name}`;
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

  return null; // Valid
}

// ... existing imports and functions ...

// PATCH /api/facilities/:id/status
exports.updateFacilityStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Facility ID' });
    }

    // 2. Validate Status Input
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status value. Must be either "active" or "inactive"' 
      });
    }

    // 3. Find Facility & Check Ownership
    const facility = await Facility.findOne({ 
      _id: id, 
      serviceProviderId: userId 
    });

    if (!facility) {
      return res.status(404).json({ 
        error: 'Facility not found or you do not have permission to update it' 
      });
    }

    // 4. CRITICAL: Business Rule Check
    // Only allow toggling if currently active or inactive.
    // Prevents bypassing the "pending" or "rejected" states.
    if (!['active', 'inactive'].includes(facility.status)) {
      return res.status(403).json({ 
        error: 'Cannot change status of facilities that are pending review or rejected' 
      });
    }

    // 5. Update Status
    facility.status = status;
    facility.updatedAt = new Date();
    await facility.save();

    res.status(200).json({
      success: true,
      message: `Facility ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      status: status
    });

  } catch (error) {
    console.error('Error updating facility status:', error);
    res.status(500).json({ error: 'Failed to update facility status' });
  }
};

exports.getFacilitiesByProvider = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid or missing Service Provider ID' });
    }

    const serviceProviderId = new mongoose.Types.ObjectId(id);

    // 2. Run Aggregation
    // We use the Mongoose model 'Facility' to start the aggregation
    const facilities = await Facility.aggregate([
      {
        $match: {
          serviceProviderId: serviceProviderId,
          status: 'active',
        }
      },
      {
        $lookup: {
          // IMPORTANT: Check your actual MongoDB collection name for Service Providers.
          // The Next.js code used 'Service Provider'. Mongoose usually lowercases/pluralizes (e.g., 'serviceproviders').
          // If your DB collection specifically has a space, keep 'Service Provider'.
          // If you created the collection via Mongoose defaults, try 'serviceproviders'.
          // I will stick to your Next.js input 'Service Provider' for safety.
          from: 'Service Provider', 
          localField: 'serviceProviderId',
          foreignField: 'userId',
          as: 'serviceProviderDetails'
        }
      },
      {
        $addFields: {
          serviceProvider: {
            serviceName: {
              $cond: {
                if: { $gt: [{ $size: '$serviceProviderDetails' }, 0] },
                then: { $arrayElemAt: ['$serviceProviderDetails.serviceName', 0] },
                else: 'Unknown Provider'
              }
            },
            serviceProviderType: {
              $cond: {
                if: { $gt: [{ $size: '$serviceProviderDetails' }, 0] },
                then: { $arrayElemAt: ['$serviceProviderDetails.serviceProviderType', 0] },
                else: null
              }
            },
            features: {
              $cond: {
                if: { $gt: [{ $size: '$serviceProviderDetails' }, 0] },
                then: { $arrayElemAt: ['$serviceProviderDetails.features', 0] },
                else: []
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          serviceProviderId: 1,
          facilityType: 1,
          status: 1,
          details: 1,
          features: 1,
          address: 1,
          city: 1,
          pincode: 1,
          state: 1,
          country: 1,
          isFeatured: 1,
          updatedAt: 1,
          serviceProvider: 1
        }
      },
      {
        $sort: {
          isFeatured: -1,
          updatedAt: -1
        }
      }
    ]);

    // 3. Return Response
    res.json(facilities);

  } catch (error) {
    console.error('Error fetching facilities by provider:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


exports.searchFacilities = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const search = req.query.search || '';
    const listingStatus = req.query.listingStatus || 'All';
    const propertyTypesParam = req.query.propertyTypes || 'All';
    const minPrice = parseInt(req.query.minPrice || '0');
    const maxPrice = parseInt(req.query.maxPrice || '100000');
    const sortBy = req.query.sortBy || 'newest';
    const isFeatured = req.query.isFeatured === 'true';
    // const location = req.query.location || '';
    // const city = req.query.city || '';
    // const state = req.query.state || '';
    // const facilityType = req.query.facilityType || '';


    const searchScopes = req.query.searchScope 
      ? req.query.searchScope.split(',') 
      : ['facility', 'enabler', 'sector', 'location'];

    // Base Query
    const query = {
      status: 'active',
      privacyType: 'public' // Uncomment if you added this field to Schema
    };

    if (isFeatured) {
      query.isFeatured = true;
    }

if (search.trim()) {
      // Split the search string by commas or spaces (e.g., "lab, chennai" -> ["lab", "chennai"])
      const searchTerms = search.split(/[\s,]+/).filter(t => t.trim() !== '');
      
      const andConditions = [];

      for (const term of searchTerms) {
        const regexTerm = { $regex: term, $options: 'i' };
        const formattedTerm = { $regex: term.toLowerCase().replace(/\s+/g, '-'), $options: 'i' };
        
        const termOrConditions = [];

        // 🔍 IF 'FACILITY' TAB IS SELECTED
        if (searchScopes.includes('facility')) {
          termOrConditions.push({ 'details.name': regexTerm });
          termOrConditions.push({ 'details.description': regexTerm });
          termOrConditions.push({ facilityType: formattedTerm });
        }

        // 🔍 IF 'ENABLER' TAB IS SELECTED
        if (searchScopes.includes('enabler')) {
          const enablerMatch = await ServiceProvider.find({
            $or: [
              { serviceName: regexTerm },
              { primaryContact1Name: regexTerm },
              { primaryContact1Designation: regexTerm }
            ]
          }).select('userId');

          if (enablerMatch.length > 0) {
            const matchedUserIds = enablerMatch.map(sp => sp.userId);
            termOrConditions.push({ serviceProviderId: { $in: matchedUserIds } });
          }
        }

        // 🔍 IF 'SECTOR' TAB IS SELECTED
        if (searchScopes.includes('sector')) {
          termOrConditions.push({ relevantSectors: regexTerm });
          termOrConditions.push({ relevantSectors: formattedTerm });
        }

        // 🔍 IF 'LOCATION' TAB IS SELECTED
        if (searchScopes.includes('location')) {
          termOrConditions.push({ address: regexTerm });
          termOrConditions.push({ city: regexTerm });
          termOrConditions.push({ state: regexTerm });
          termOrConditions.push({ country: regexTerm });
          termOrConditions.push({ pincode: regexTerm });
        }

        // Add this term's logic to the main AND array
        if (termOrConditions.length > 0) {
          andConditions.push({ $or: termOrConditions });
        } else {
          // Strict block: if a term matches absolutely NO possible scope, return 0 results
          andConditions.push({ _id: null }); 
        }
      }

      // Apply the built $and conditions to the main query
      if (andConditions.length > 0) {
        query['$and'] = query['$and'] || [];
        query['$and'].push(...andConditions);
      }
    }

    // --- Facility Types ---
   const propertyTypes = propertyTypesParam.split(',');
    if (!propertyTypes.includes('All') && propertyTypes.length > 0) {
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

    // --- Execution ---
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const totalCount = await Facility.countDocuments(query);

    const facilities = await Facility.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'Service Provider', // Ensure this matches DB collection name exactly
          localField: 'serviceProviderId',
          foreignField: 'userId',
          as: 'serviceProvider'
        }
      },
      {
        $unwind: {
          path: '$serviceProvider',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: ITEMS_PER_PAGE }
    ]);

    // Transform (Optional: Clean up data structure if needed)
    const transformedFacilities = facilities.map(facility => ({
      _id: facility._id,
      details: facility.details,
      features: facility.serviceProvider?.features || [],
      address: facility.address,
      city: facility.city,
      state: facility.state,
      country: facility.country,
      isFeatured: facility.isFeatured,
      facilityType: facility.facilityType,
      serviceProvider: facility.serviceProvider ? { serviceName: facility.serviceProvider.serviceName } : null,
      timings: facility.timings
    }));

    res.json({
      facilities: transformedFacilities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        totalItems: totalCount,
        itemsPerPage: ITEMS_PER_PAGE
      }
    });

  } catch (error) {
    console.error('Error in searchFacilities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Migrated from: /api/facilities/search-private
// ==========================================
exports.searchFacilitiesScoped = async (req, res) => {
  try {
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
    // ... [Reuse logic logic for params like minPrice, maxPrice, location, etc. from above] ...
    // For brevity, assuming standard filters apply as per provided code
    
    const query = {
      status: 'active',
      // privacyType: 'public'
    };

    if (req.query.isFeatured === 'true') query.isFeatured = true;

    // Specific Scope Logic
    if (search) {
      if (searchScope === 'header') {
        query['$or'] = [
          { 'details.name': { $regex: search, $options: 'i' } },
          { 'serviceProvider.serviceName': { $regex: search, $options: 'i' } }, // Note: This needs lookup first or separate query
          { address: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { pincode: { $regex: search, $options: 'i' } }
        ];
      } else {
        // Comprehensive search
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

    const pipeline = [
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
      { $sort: { isFeatured: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: ITEMS_PER_PAGE }
    ];

    const facilities = await Facility.aggregate(pipeline);

    res.json({
      facilities: facilities, // Transform if needed
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        totalItems: totalCount,
        itemsPerPage: ITEMS_PER_PAGE
      }
    });

  } catch (error) {
    console.error('Error in searchFacilitiesScoped:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// 3. PROVIDER CRUD (My Facilities)
// Migrated from: /api/facilities/private-route
// ==========================================

// Create Facility
exports.createProviderFacility = async (req, res) => {
  try {
    const data = req.body;
    
    // Auth check is handled by middleware, req.user exists
    const facilityData = {
      ...data,
      serviceProviderId: req.user.id, // Enforce ID from session
      status: data.status || 'pending',
      isFeatured: false,
      privacyType: data.privacyType || 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newFacility = await Facility.create(facilityData);
    
    res.status(201).json({ id: newFacility._id });
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(400).json({ error: error.message || 'Failed to create facility' });
  }
};

// Get My Facilities
exports.getProviderFacilities = async (req, res) => {
  try {
    const serviceProviderId = req.user.id;
    
    const facilities = await Facility.find({ serviceProviderId })
      .sort({ updatedAt: -1 });

    res.json(facilities);
  } catch (error) {
    console.error('Error getting provider facilities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Facility
exports.deleteProviderFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceProviderId = req.user.id;

    const result = await Facility.deleteOne({
      _id: id,
      serviceProviderId // Ensure user owns the facility
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Facility not found or unauthorized' });
    }

    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Patch/Update Facility
// Note: You already have updateFacility in previous interactions, 
// this is the specific implementation for the private route logic
exports.patchProviderFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const serviceProviderId = req.user.id;

    const result = await Facility.findOneAndUpdate(
      { _id: id, serviceProviderId },
      {
        $set: {
          details: body, // Next.js code specifically sets 'details' to body
          status: 'pending', // Reset status on edit
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Facility not found or unauthorized' });
    }

    res.json({ message: 'Facility updated successfully' });
  } catch (error) {
    console.error('Error patching facility:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.searchProviderFacilities = async (req, res) => {
  try {
    // 1. Extract Query Parameters
    const userId = req.query.id; // The Service Provider's ID
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

    // 2. Validate Service Provider ID (Crucial step missing previously)
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      // If ID is missing or invalid, Next.js would typically crash or return empty.
      // We return empty to be safe.
      return res.json({
        facilities: [],
        pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: ITEMS_PER_PAGE }
      });
    }

    // 3. Build Base Query
    const query = {
      serviceProviderId: new mongoose.Types.ObjectId(userId), // ✅ Filter by Provider
      status: 'active',
      // privacyType: 'public' // Uncomment if your schema has this field
    };

    if (isFeatured) {
      query.isFeatured = true;
    }

    // 4. Search Logic (Scope based)
    if (search) {
      if (searchScope === 'header') {
        query['$or'] = [
          { 'details.name': { $regex: search, $options: 'i' } },
          // Lookup on Service Provider usually needs aggregation, but since we are filtering 
          // BY a specific provider ID, searching their name here is redundant but harmless.
          // We'll keep the location searches:
          { address: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { pincode: { $regex: search, $options: 'i' } }
        ];
      } else {
        // Full Search
        query['$or'] = [
          { 'details.name': { $regex: search, $options: 'i' } },
          { 'details.description': { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { pincode: { $regex: search, $options: 'i' } },
          { facilityType: { $regex: search.toLowerCase().replace(/\s+/g, '-'), $options: 'i' } }
        ];
      }
    }

    // 5. Apply Filters (Same as before)
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

    // Facility Types Map
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

    // Rental Plans
    if (listingStatus !== 'All') {
      query['details.rentalPlans'] = {
        $elemMatch: { name: listingStatus, price: { $gte: minPrice, $lte: maxPrice } }
      };
    } else {
      query['details.rentalPlans'] = {
        $elemMatch: { price: { $gte: minPrice, $lte: maxPrice } }
      };
    }

    // 6. Pagination & Sort
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const totalCount = await Facility.countDocuments(query);

    let sortOptions = {};
    switch (sortBy) {
      case 'newest': sortOptions = { isFeatured: -1, createdAt: -1 }; break;
      case 'oldest': sortOptions = { isFeatured: -1, createdAt: 1 }; break;
      default: sortOptions = { isFeatured: -1, createdAt: -1 };
    }

    // 7. Aggregation Pipeline
    const facilities = await Facility.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'Service Provider', // Check your DB collection name
          localField: 'serviceProviderId',
          foreignField: 'userId',
          as: 'serviceProvider'
        }
      },
      {
        $unwind: {
          path: '$serviceProvider',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: ITEMS_PER_PAGE }
    ]);

    // 8. Transform Response
    const transformedFacilities = facilities.map(facility => ({
      _id: facility._id,
      details: facility.details,
      features: facility.serviceProvider?.features || [],
      address: facility.address,
      city: facility.city,
      state: facility.state,
      country: facility.country,
      isFeatured: facility.isFeatured,
      facilityType: facility.facilityType,
      serviceProvider: facility.serviceProvider ? {
        serviceName: facility.serviceProvider.serviceName
      } : null,
      timings: facility.timings
    }));

    res.json({
      facilities: transformedFacilities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        totalItems: totalCount,
        itemsPerPage: ITEMS_PER_PAGE
      }
    });

  } catch (error) {
    console.error('Error in searchFacilitiesScoped:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};