const mongoose = require('mongoose');
const Booking = require('../models/Booking'); // Ensure you have this model
// You don't need to import Facility/Startup models if you only use $lookup, 
// but ensure the collection names in $lookup match your DB exactly (usually 'facilities', 'startups').

// --- Helper Function (Preserved exactly) ---
function getFixedServiceFee(facilityType) {
  if (!facilityType) return 30; // Default safety
  const normalizedType = facilityType.toLowerCase().trim();

  // 40Rs Tier
  if (
    normalizedType.includes('individual-cabin') || 
    normalizedType.includes('individual cabin') ||
    normalizedType.includes('coworking') || 
    normalizedType.includes('raw space office') ||
    normalizedType.includes('raw-space-office')
  ) {
    return 40;
  }
  
  // 10Rs Tier
  if (
    normalizedType.includes('bio-allied') || 
    normalizedType.includes('bio allied') ||
    normalizedType.includes('manufacturing') || 
    normalizedType.includes('prototyping') ||
    normalizedType.includes('software') || 
    normalizedType.includes('saas') ||
    normalizedType.includes('raw space lab') ||
    normalizedType.includes('raw-space-lab')
  ) {
    return 10;
  }
  
  // 50Rs Tier
  if (
    normalizedType.includes('studio') || 
    normalizedType.includes('meeting')
  ) {
    return 50;
  }
  
  // Default Tier
  return 30;
}

// --- Main Controller Function ---
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