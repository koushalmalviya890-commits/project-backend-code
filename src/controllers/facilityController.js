const Facility = require('../models/Facility');
const mongoose = require('mongoose');
const ServiceProvider = require('../models/ServiceProvider'); 

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
// exports.deleteFacility = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).send('Facility ID is required');
//     }

//     const result = await Facility.deleteOne({
//       _id: id,
//       serviceProviderId: userId // Ensure ownership
//     });

//     if (result.deletedCount === 0) {
//       return res.status(404).send('Facility not found or unauthorized');
//     }

//     res.status(200).send('Facility deleted successfully');

//   } catch (error) {
//     console.error('Error deleting facility:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };

// // PATCH /api/facilities/:id
// exports.updateFacility = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;
//     const updates = req.body; // In your Next.js logic, the entire body replaced 'details'

//     if (!id) {
//       return res.status(400).send('Facility ID is required');
//     }

//     // Logic from your Next.js PATCH: 
//     // 1. Update 'details' with the body content
//     // 2. Reset status to 'pending'
//     // 3. Update 'updatedAt'
//     const facility = await Facility.findOneAndUpdate(
//       { _id: id, serviceProviderId: userId },
//       {
//         $set: {
//           details: updates,
//           status: 'pending',
//           updatedAt: new Date()
//         }
//       },
//       { new: true } // Return the updated document
//     );

//     if (!facility) {
//       return res.status(404).send('Facility not found or unauthorized');
//     }

//     res.status(200).send('Facility updated successfully');

//   } catch (error) {
//     console.error('Error updating facility:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };

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

    // 2. Data Preparation & Logic (Mirroring Next.js Logic)
    
    // Ensure details object exists
    if (!data.details) {
      console.warn('Details object missing in update payload, using existing details');
      data.details = { ...facility.details };
    } else {
      // Merge existing required fields if missing in payload
      if (!data.details.name) data.details.name = facility.details.name;
      if (!data.details.description) data.details.description = facility.details.description;
      
      if (!data.details.images || !Array.isArray(data.details.images) || data.details.images.length === 0) {
        data.details.images = facility.details.images;
      }
      
      if (!data.details.relevantSectors || !Array.isArray(data.details.relevantSectors) || data.details.relevantSectors.length === 0) {
        data.details.relevantSectors = facility.details.relevantSectors;
      }

      if (!data.details.rentalPlans || !Array.isArray(data.details.rentalPlans) || data.details.rentalPlans.length === 0) {
        data.details.rentalPlans = facility.details.rentalPlans;
      }
      
      // Facility Type Specific Checks
      const facilityType = data.facilityType || facility.facilityType;

      switch (facilityType) {
        case 'saas-allied':
        case 'software':
        case 'bio-allied-labs':
        case 'manufacturing-labs':
        case 'prototyping-labs':
          if (!data.details.equipment || !Array.isArray(data.details.equipment) || data.details.equipment.length === 0) {
            data.details.equipment = facility.details.equipment;
          }
          break;
          
        case 'individual-cabin':
          if (data.details.totalCabins === undefined) data.details.totalCabins = facility.details.totalCabins;
          if (data.details.availableCabins === undefined) data.details.availableCabins = facility.details.availableCabins;
          break;
          
        case 'coworking-spaces':
          if (data.details.totalSeats === undefined) data.details.totalSeats = facility.details.totalSeats;
          if (data.details.availableSeats === undefined) data.details.availableSeats = facility.details.availableSeats;
          break;
          
        case 'meeting-rooms':
          if (data.details.totalRooms === undefined) data.details.totalRooms = facility.details.totalRooms;
          if (data.details.seatingCapacity === undefined) data.details.seatingCapacity = facility.details.seatingCapacity;
          break;
          
        case 'raw-space-office':
        case 'raw-space-lab':
          if (!data.details.areaDetails || !Array.isArray(data.details.areaDetails) || data.details.areaDetails.length === 0) {
            data.details.areaDetails = facility.details.areaDetails;
          }
          break;
          
        case 'studio':
          if (!data.details.studioDetails) {
            data.details.studioDetails = facility.details.studioDetails;
          }
          break;
      }
    }

    // Check timings
    if (!data.timings) {
      console.warn('Timings object missing, using existing');
      data.timings = facility.timings;
    }

    // 3. Validation Function (Ported from Next.js)
    const validateFullDocument = (doc) => {
      const requiredFields = [
        'serviceProviderId', 'facilityType', 'status', 'details',
        'address', 'city', 'pincode', 'state', 'country', 'isFeatured', 'timings'
      ];

      for (const field of requiredFields) {
        if (doc[field] === undefined || doc[field] === null) {
          return { valid: false, errorMessage: `Missing required field: ${field}` };
        }
      }

      const { details } = doc;
      if (!details || typeof details !== 'object') {
        return { valid: false, errorMessage: 'Details must be a valid object' };
      }

      const requiredDetailsFields = ['name', 'description', 'images', 'rentalPlans'];
      for (const field of requiredDetailsFields) {
        if (!details[field]) {
          return { valid: false, errorMessage: `Missing required field in details: ${field}` };
        }
      }

      if (!Array.isArray(details.images) || details.images.length === 0) {
        return { valid: false, errorMessage: 'Images must be a non-empty array' };
      }

      if (!Array.isArray(details.rentalPlans) || details.rentalPlans.length === 0) {
        return { valid: false, errorMessage: 'Rental plans must be a non-empty array' };
      }

      // Rental Plans Validation
      const validPlanTypes = ['Annual', 'Monthly', 'Weekly', 'One Day (24 Hours)', 'Hourly'];
      for (let i = 0; i < details.rentalPlans.length; i++) {
        const plan = details.rentalPlans[i];
        if (!plan.name || !plan.price || !plan.duration) {
          return { valid: false, errorMessage: `Rental plan at index ${i} incomplete` };
        }
        if (!validPlanTypes.includes(plan.name) || !validPlanTypes.includes(plan.duration)) {
          return { valid: false, errorMessage: `Invalid rental plan type/duration at index ${i}` };
        }
      }

      // Timings Validation
      const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      if (!doc.timings || typeof doc.timings !== 'object') {
        return { valid: false, errorMessage: 'Timings must be a valid object' };
      }
      for (const day of requiredDays) {
        if (!doc.timings[day] || doc.timings[day].isOpen === undefined) {
          return { valid: false, errorMessage: `Missing/Invalid timing for ${day}` };
        }
        if (doc.timings[day].isOpen === true && (!doc.timings[day].openTime || !doc.timings[day].closeTime)) {
          return { valid: false, errorMessage: `Open time/close time required for ${day}` };
        }
      }

      return { valid: true };
    };

    // 4. Construct Final Update Object
    const updatePayload = {
      ...data,
      updatedAt: new Date(),
      createdAt: data.createdAt ? new Date(data.createdAt) : facility.createdAt
    };

    // Ensure types
    if (typeof updatePayload.serviceProviderId === 'string') {
      updatePayload.serviceProviderId = new mongoose.Types.ObjectId(updatePayload.serviceProviderId);
    }
    if (updatePayload.isFeatured !== undefined) {
      updatePayload.isFeatured = Boolean(updatePayload.isFeatured);
    }

    // 5. Run Validation
    const validation = validateFullDocument(updatePayload);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errorMessage });
    }

    // 6. Perform Update
    const updatedFacility = await Facility.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true } // Return updated doc & run Mongoose validators
    );
    if (!updatedFacility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    res.status(200).json(updatedFacility);

  } catch (error) {
    console.error('Error updating facility:', error);
   if (typeof error === 'object' && error !== null && error.code === 121) {
      const errInfo = error.errInfo || {};
      const validationErrors = errInfo.details?.schemaRulesNotSatisfied || [];
      
      const errorDetails = validationErrors.map((rule) => ({
        failingField: rule.operatorName,
        reason: rule.reason,
        missingProperties: rule.missingProperties
      }));
      
      return res.status(400).json({ 
        error: 'Document validation failed in MongoDB', 
        details: errorDetails,
        fullError: JSON.stringify(errInfo) 
      });
    }

    // --- 2. Handle Mongoose Validation Errors ---
    // Mongoose throws these (error.name === 'ValidationError') instead of code 121 
    // when using 'runValidators: true'
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: messages
      });
    }

    // --- 3. Handle Cast Errors (Invalid ID format) ---
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: `Invalid ${error.path}: ${error.value}`
      });
    }
    
    // --- 4. General Fallback ---
    res.status(500).json({ 
      error: 'Failed to update facility', 
      details: error.message || String(error) 
    });
  }
};

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