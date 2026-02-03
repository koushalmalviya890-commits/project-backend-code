const ServiceProvider = require("../models/ServiceProvider");
const mongoose = require("mongoose");
const Booking = require('../models/Booking');



// function getFixedServiceFee(facilityType) {
//   if (!facilityType) return 30; // Default safety
//   const normalizedType = facilityType.toLowerCase().trim();

//   // 40Rs Tier
//   if (
//     normalizedType.includes('individual-cabin') || 
//     normalizedType.includes('individual cabin') ||
//     normalizedType.includes('coworking') || 
//     normalizedType.includes('raw space office') ||
//     normalizedType.includes('raw-space-office')
//   ) {
//     return 40;
//   }
  
//   // 10Rs Tier
//   if (
//     normalizedType.includes('bio-allied') || 
//     normalizedType.includes('bio allied') ||
//     normalizedType.includes('manufacturing') || 
//     normalizedType.includes('prototyping') ||
//     normalizedType.includes('software') || 
//     normalizedType.includes('saas') ||
//     normalizedType.includes('raw space lab') ||
//     normalizedType.includes('raw-space-lab')
//   ) {
//     return 10;
//   }
  
//   // 50Rs Tier
//   if (
//     normalizedType.includes('studio') || 
//     normalizedType.includes('meeting')
//   ) {
//     return 50;
//   }
  
//   // Default Tier
//   return 30;
// }

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
    // 1. Get User ID from Middleware (req.user)
    // Note: Your Next.js code used `incubatorId: userId`. 
    // Ensure your Auth Middleware sets req.user._id correctly.
    const userId = new mongoose.Types.ObjectId(req.user.id); 

    // 2. Run Aggregation Pipeline (Exact Logic Preserved)
    // Note: Check your actual collection names in MongoDB Compass. 
    // Mongoose usually pluralizes models (Facility -> facilities). 
    // If your collections are strictly 'Facilities' and 'Startups' (capitalized), keep as is.
    // If they are lowercase, change 'from' to 'facilities' and 'startups'.
    const bookings = await Booking.aggregate([
      {
        $match: {
          incubatorId: userId
        }
      },
      // Join with Facilities
      {
        $lookup: {
          from: 'facilities', // ⚠️ CHECK DB: Might be 'Facilities' or 'facilities'
          localField: 'facilityId',
          foreignField: '_id',
          as: 'facility'
        }
      },
      // Join with Startups
      {
        $lookup: {
          from: 'startups', // ⚠️ CHECK DB: Might be 'Startups' or 'startups'
          localField: 'startupId',
          foreignField: 'userId',
          as: 'startup'
        }
      },
      // Only keep valid bookings
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
          date: '$startDate',
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