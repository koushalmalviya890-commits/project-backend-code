const ServiceProvider = require("../models/ServiceProvider");
const mongoose = require("mongoose");
const Booking = require('../models/Booking');
const Facility = require('../models/Facility');

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
      stateProvince: profile.state || profile.stateProvince, 
      zipPostalCode: profile.pincode || profile.zipPostalCode,
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


exports.getEarnings = async (req, res) => {
  try {
   // 1. Get User ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userIdObj = new mongoose.Types.ObjectId(req.user.id);
    const userIdStr = req.user.id.toString();
   const bookings = await Booking.aggregate([
      {
        $match: {
          // Robustness: Match either String or ObjectId to be safe
          $or: [
            { incubatorId: userIdObj },
            { incubatorId: userIdStr }
          ]
        }
      },
      // ✅ FIX 1: Use 'Facilities' (Capitalized) to match your DB
      {
        $lookup: {
          from: 'Facilities', 
          localField: 'facilityId',
          foreignField: '_id',
          as: 'facility'
        }
      },
      // ✅ FIX 2: Use 'Startups' (Capitalized) to match your DB
      {
        $lookup: {
          from: 'Startups', 
          localField: 'startupId',
          foreignField: 'userId',
          as: 'startup'
        }
      },
      // Only keep valid bookings (non-empty joins)
      {
        $match: {
          'facility': { $ne: [] },
          'startup': { $ne: [] }
        }
      },
      {
        $unwind: {
          path: '$facility',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $unwind: {
          path: '$startup',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          _id: 1,
          bookingId: { $toString: "$_id" },
          date: '$startDate', // Next.js mapped 'date' to 'startDate'
          amount: 1,
          serviceFee: 1,
          baseAmount: 1,
          status: 1,
          facility: '$facility.details.name',
          facilityType: '$facility.facilityType',
          invoiceUrl: 1,
          createdAt: 1,
          requestedAt: 1
        }
      }
    ]);
    // 3. Perform Calculations (Exact Logic Preserved)
    
    // Calculate total earnings (all time)
    const totalEarnings = bookings
      .filter(booking => booking.status === 'approved')
      .reduce((sum, booking) => sum + (booking.amount || 0), 0);

    // Calculate monthly earnings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyEarnings = bookings
      .filter(booking => {
        const bookingDate = new Date(booking.date);
        return booking.status === 'approved' && bookingDate >= thirtyDaysAgo;
      })
      .reduce((sum, booking) => sum + (booking.amount || 0), 0);

    // Calculate pending payouts
    const pendingPayouts = bookings
      .filter(booking => {
        const bookingDate = new Date(booking.requestedAt || booking.createdAt);
        return (
          booking.status === 'approved' &&
          bookingDate >= thirtyDaysAgo
        );
      })
      .reduce((sum, booking) => {
        const baseAmount = booking.amount || 0;
        
        // Use the helper function here, just like in Next.js
        // Although your Next.js code calculated fixedServiceFee, 
        // it seems it was relying on booking.serviceFee directly in the reduce?
        // Your logic below uses the stored serviceFee. 
        
        const fixedServiceFee = booking.serviceFee || 0;
        const overAllServicFeeGst = fixedServiceFee * 0.18;
        const finalPrice = fixedServiceFee + overAllServicFeeGst;

        return Math.round(sum + (baseAmount - finalPrice));
      }, 0);

    // Format transactions
    const transactions = bookings.map(booking => ({
      _id: booking._id,
      bookingId: booking.bookingId,
      date: new Date(booking.date).toISOString(),
      amount: booking.amount || 0,
      serviceFee: booking.serviceFee || 0,
      status: booking.status === 'approved' ? 'Completed' : 'Pending',
      facility: booking.facility || 'Unknown Facility',
      facilityType: booking.facilityType || 'Unknown Type',
      invoiceUrl: booking.invoiceUrl
    }));

    // 4. Send Response
    res.status(200).json({
      totalEarnings,
      monthlyEarnings,
      pendingPayouts,
      transactions
    });

  } catch (error) {
    console.error('Error in earnings API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getServiceProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid provider ID' });
    }

    // 2. Find Provider (By _id OR userId)
    // Matches Next.js logic: { $or: [ { _id: ... }, { userId: ... } ] }
    const serviceProvider = await ServiceProvider.findOne({
      $or: [
        { _id: id },
        { userId: id }
      ]
    }).lean();

    if (!serviceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // 3. Return Data
    res.status(200).json(serviceProvider);

  } catch (error) {
    console.error('Error fetching service provider details:', error);
    res.status(500).json({ error: 'Failed to fetch service provider details' });
  }
};

exports.getAllServiceProvidersWithStats = async (req, res) => {
  try {
    // 1. Fetch All Service Providers
    const serviceProviders = await ServiceProvider.find({})
      .select('_id userId serviceName address logoUrl features images serviceProviderType city stateProvince zipPostalCode timings')
      .lean();

    // 2. Fetch Active Public Facilities
    // We get all facilities linked to these providers
    const providerUserIds = serviceProviders.map(p => p.userId).filter(Boolean);
    
    const allFacilities = await Facility.find({
      status: 'active',
      privacyType: 'public',
      serviceProviderId: { $in: providerUserIds }
    }).lean();

    // 3. Calculate Stats (In-Memory Aggregation)
    // Create maps to count facilities per provider
    const facilityCountMap = new Map(); // providerId -> count
    const facilityTypesMap = new Map(); // providerId -> Map<type, count>

    allFacilities.forEach(facility => {
      const providerId = facility.serviceProviderId.toString();

      // Count Total
      facilityCountMap.set(providerId, (facilityCountMap.get(providerId) || 0) + 1);

      // Group by Type
      if (!facilityTypesMap.has(providerId)) {
        facilityTypesMap.set(providerId, new Map());
      }
      const providerTypes = facilityTypesMap.get(providerId);
      const type = facility.facilityType;
      providerTypes.set(type, (providerTypes.get(type) || 0) + 1);
    });

    // 4. Merge Data & Format Response
    const providersWithFacilities = serviceProviders.map(provider => {
      const providerId = provider.userId ? provider.userId.toString() : '';
      const totalFacilities = facilityCountMap.get(providerId) || 0;
      const facilityTypes = facilityTypesMap.get(providerId);

      // Format Facility Types Array
      const facilityTypesArray = facilityTypes 
        ? Array.from(facilityTypes).map(([type, count]) => {
            // Helper to format display name
            let displayType = type;
            switch (type) {
              case 'individual-cabin': displayType = 'Individual Cabin'; break;
              case 'coworking-spaces': displayType = 'Coworking Space'; break;
              case 'meeting-rooms': displayType = 'Meeting Room'; break;
              case 'bio-allied-labs': displayType = 'Bio Allied Lab'; break;
              case 'manufacturing-labs': displayType = 'Manufacturing Lab'; break;
              case 'prototyping-labs': displayType = 'Prototyping Lab'; break;
              case 'raw-space-office': displayType = 'Raw Space Office'; break;
              case 'raw-space-lab': displayType = 'Raw Space Lab'; break;
              // Add other cases as needed...
              default: 
                // Fallback capitalization
                displayType = type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
            return { type: displayType, count, originalType: type };
          }).sort((a, b) => b.count - a.count)
        : [];

      // Format Address
      let fullAddress = provider.address || '';
      if (provider.city) fullAddress += (fullAddress ? ', ' : '') + provider.city;
      if (provider.stateProvince) fullAddress += (fullAddress ? ', ' : '') + provider.stateProvince;
      if (provider.zipPostalCode) fullAddress += (fullAddress ? ' - ' : '') + provider.zipPostalCode;

      return {
        _id: provider._id,
        serviceName: provider.serviceName,
        address: fullAddress,
        logoUrl: provider.logoUrl,
        serviceProviderType: provider.serviceProviderType,
        features: Array.isArray(provider.features) ? provider.features : [],
        images: Array.isArray(provider.images) ? provider.images : [],
        timings: provider.timings,
        facilityTypes: facilityTypesArray,
        totalFacilities
      };
    });

    res.json({ success: true, providers: providersWithFacilities });

  } catch (error) {
    console.error('Error fetching service providers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch service providers' });
  }
};


/**
 * 2. GET FACILITIES FOR A SPECIFIC PROVIDER (PAGINATED)
 * Migrated from: GET /api/service-providers/[id]/facilities
 */
exports.getProviderFacilitiesWithPagination = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid provider ID' });
    }

    // 1. Find Service Provider (using _id)
    // Note: The ID in params is usually the _id of the Service Provider Document
    const serviceProvider = await ServiceProvider.findById(id).lean();

    if (!serviceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // 2. Determine Filter Query
    // Facilities are linked via 'serviceProviderId' which matches the provider's 'userId'
    // Fallback to _id if userId is missing (legacy data safety)
    const providerUserId = serviceProvider.userId ? serviceProvider.userId : serviceProvider._id;

    const query = {
      serviceProviderId: providerUserId,
      status: 'active',
      privacyType: 'public'
    };

    // 3. Count Total Documents (for Pagination)
    const totalCount = await Facility.countDocuments(query);

    // 4. Fetch Paginated Facilities
    const facilities = await Facility.find(query)
      .sort({ isFeatured: -1, updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 5. Attach Provider Info to each Facility (Frontend expects this structure)
    const facilitiesWithProvider = facilities.map(facility => ({
      ...facility,
      serviceProvider: {
        serviceName: serviceProvider.serviceName,
        serviceProviderType: serviceProvider.serviceProviderType,
        features: serviceProvider.features || []
      }
    }));

    // 6. Return Response
    res.json({
      facilities: facilitiesWithProvider,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page < Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching provider facilities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};