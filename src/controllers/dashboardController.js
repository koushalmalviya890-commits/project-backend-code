const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Facility = require('../models/Facility');
// Ensure this path is correct
const { getFixedServiceFee } = require('../../utils/pricing'); 

exports.getDashboardData = async (req, res) => {
  try {
    // 1. Auth Check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { date } = req.query;
    // We treat the ID as both an Object and a String to find matches
    const userIdObj = new mongoose.Types.ObjectId(req.user.id);
    const userIdStr = req.user.id.toString();

    // 2. Date Calculations
    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0, 0, 0, 0);

    const endOfSelectedDate = new Date(selectedDate);
    endOfSelectedDate.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    
    const startOfPreviousMonth = new Date(startOfMonth);
    startOfPreviousMonth.setMonth(startOfPreviousMonth.getMonth() - 1);
    
    const endOfPreviousMonth = new Date(startOfMonth);
    endOfPreviousMonth.setDate(0);
    endOfPreviousMonth.setHours(23, 59, 59, 999);

    // 3. Simple Queries
    const totalFacilities = await Facility.countDocuments({
      serviceProviderId: { $in: [userIdObj, userIdStr] },
      status: 'active'
    });

    // 4. Aggregation Pipeline
    const dashboardData = await Booking.aggregate([
      {
        // ✅ CRITICAL FIX: Match BOTH ObjectId and String types
        $match: {
          $or: [
            { incubatorId: userIdObj }, 
            { incubatorId: userIdStr }
          ]
        }
      },
      {
        $lookup: {
          from: 'Startups', // ✅ Kept Capitalized per your Schema
          localField: 'startupId',
          foreignField: 'userId',
          as: 'startup'
        }
      },
      {
        $lookup: {
          from: 'Facilities', // ✅ Kept Capitalized per your Schema
          localField: 'facilityId',
          foreignField: '_id',
          as: 'facility'
        }
      },
      {
        // Filter out broken records
        $match: {
          'startup': { $ne: [] },
          'facility': { $ne: [] }
        }
      },
      {
        $facet: {
          // --- 1. All Bookings ---
          allBookings: [
            {
              $project: {
                _id: 1,
                bookingId: { $toString: "$_id" },
                startup: 1,
                facility: 1,
                startDate: 1,
                endDate: 1,
                rentalPlan: 1,
                amount: 1,
                status: 1,
                paymentStatus: 1,
                requestedAt: 1,
                createdAt: 1,
                // Extract type for helper function later
                facilityType: { $arrayElemAt: ['$facility.facilityType', 0] } 
              }
            }
          ],
          
          // --- 2. Calendar Bookings ---
          calendarBookings: [
            {
              $match: {
                $or: [
                  { startDate: { $gte: selectedDate, $lte: endOfSelectedDate } },
                  { endDate: { $gte: selectedDate, $lte: endOfSelectedDate } },
                  { startDate: { $lt: selectedDate }, endDate: { $gt: endOfSelectedDate } }
                ]
              }
            },
            { $unwind: '$facility' },
            { $unwind: '$startup' },
            {
              $project: {
                _id: 1,
                bookingId: { $toString: "$_id" },
                facilityId: '$facilityId',
                facilityName: '$facility.details.name',
                facilityType: '$facility.facilityType',
                startupId: '$startupId',
                startupDetails: {
                  logoUrl: { $ifNull: ['$startup.logoUrl', '/placeholder-logo.png'] },
                  startupName: '$startup.startupName'
                },
                startupName: '$startup.startupName',
                status: 1,
                amount: 1,
                startDate: 1,
                endDate: 1,
                rentalPlan: 1,
                paymentStatus: 1,
                whatsappNumber: 1,
                bookedOn: '$requestedAt',
                createdAt: 1
              }
            },
            { $sort: { startDate: 1 } }
          ],
          
          // --- 3. Recent Notifications ---
          recentBookings: [
            { $sort: { requestedAt: -1 } },
            { $limit: 5 },
            { $unwind: '$facility' },
            { $unwind: '$startup' },
            {
              $project: {
                _id: 1,
                bookingId: { $toString: "$_id" },
                facilityId: '$facilityId',
                facilityName: '$facility.details.name',
                facilityType: '$facility.facilityType',
                startupId: '$startupId',
                startupDetails: {
                  logoUrl: { $ifNull: ['$startup.logoUrl', '/placeholder-logo.png'] },
                  startupName: '$startup.startupName'
                },
                userName: '$startup.startupName',
                status: 1,
                amount: 1,
                bookedOn: '$requestedAt',
                createdAt: 1
              }
            }
          ],
          
          // --- 4. Monthly Chart Data ---
          monthlyData: [
            { $match: { status: "approved" } },
            {
              $group: {
                _id: {
                  year: { $year: '$startDate' },
                  month: { $month: '$startDate' }
                },
                count: { $sum: 1 },
                amount: { $sum: '$amount' }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
          ]
        }
      }
    ]);

    // 5. Process Results
    const result = dashboardData[0];
    const allBookings = result.allBookings || [];
    const calendarBookings = result.calendarBookings || [];
    const recentNotifications = result.recentBookings || [];
    const monthlyData = result.monthlyData || [];

    // Pending Payouts Calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pendingPayouts = allBookings
      .filter(booking => {
        const bookingDate = new Date(booking.requestedAt || booking.createdAt);
        return booking.status === 'approved' && bookingDate >= thirtyDaysAgo;
      })
      .reduce((sum, booking) => {
        const baseAmount = booking.amount || 0;
        const facilityType = booking.facilityType || 'default';
        const fixedServiceFee = getFixedServiceFee(facilityType);
        return sum + (baseAmount - fixedServiceFee);
      }, 0);

    // Metrics Calculation
    const currentMonthBookings = allBookings.filter(b => {
      const d = new Date(b.startDate);
      return b.status === 'approved' && d >= startOfMonth && d <= endOfSelectedDate;
    });

    const previousMonthBookings = allBookings.filter(b => {
      const d = new Date(b.startDate);
      return b.status === 'approved' && d >= startOfPreviousMonth && d <= endOfPreviousMonth;
    });

    const currentMonthMetrics = {
      totalBookings: currentMonthBookings.length,
      totalEarnings: currentMonthBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
    };

    const previousMonthMetrics = {
      totalBookings: previousMonthBookings.length,
      totalEarnings: previousMonthBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
    };

    let bookingsComparison = 0;
    let earningsComparison = 0;

    if (previousMonthMetrics.totalBookings > 0) {
      bookingsComparison = Math.round(((currentMonthMetrics.totalBookings - previousMonthMetrics.totalBookings) / previousMonthMetrics.totalBookings) * 100);
    }
    if (previousMonthMetrics.totalEarnings > 0) {
      earningsComparison = Math.round(((currentMonthMetrics.totalEarnings - previousMonthMetrics.totalEarnings) / previousMonthMetrics.totalEarnings) * 100);
    }

    // Weekly Earnings
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - 7);
    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    const thisWeekEarnings = allBookings
      .filter(b => b.status === 'approved' && new Date(b.startDate) >= weekStart && new Date(b.startDate) <= endOfSelectedDate)
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    const previousWeekEarnings = allBookings
      .filter(b => b.status === 'approved' && new Date(b.startDate) >= previousWeekStart && new Date(b.startDate) < weekStart)
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    // Format Monthly Chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = monthlyData.map(data => ({
      month: `${monthNames[data._id.month - 1]} ${data._id.year.toString().slice(2)}`,
      amount: data.amount,
      count: data.count
    }));

    // 6. Response
    res.json({
      kpis: {
        totalFacilities,
        totalBookings: allBookings.length,
        totalEarnings: allBookings
          .filter(b => b.status === 'approved')
          .reduce((sum, b) => sum + (b.amount || 0), 0),
        monthlyComparison: {
          bookings: bookingsComparison,
          earnings: earningsComparison
        },
        pendingPayouts
      },
      monthlyPayouts: formattedMonthlyData,
      notifications: recentNotifications,
      calendarBookings,
      dailyEarningData: {
        thisWeek: thisWeekEarnings,
        lastWeek: previousWeekEarnings
      },
      monthlySummaryData: {
        totalEarnings: currentMonthMetrics.totalEarnings,
        lastMonth: previousMonthMetrics.totalEarnings,
        monthlyComparison: earningsComparison
      }
    });

  } catch (error) {
    console.error('Error in dashboard API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getFailedPayments = async (req, res) => {
  try {
    // 1. Auth Check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Role Check (Only startups can see their own failed payments)
    if (req.user.userType !== 'startup') {
      return res.json([]);
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    
    // Calculate 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 3. Aggregation Query
    const failedPayments = await Booking.aggregate([
      {
        $match: {
          startupId: userId,
          paymentStatus: 'failed',
          $or: [
            { expiresAt: { $gt: now } }, // Not yet expired
            { 
              expiresAt: { 
                $lt: now, 
                $gt: sevenDaysAgo 
              } 
            } // Recently expired (within 7 days)
          ]
        }
      },
      {
        $lookup: {
          from: 'Facilities', // ⚠️ Check DB: might be 'facilities' (lowercase)
          localField: 'facilityId',
          foreignField: '_id',
          as: 'facility'
        }
      },
      {
        $unwind: '$facility'
      },
      {
        $project: {
          _id: 1,
          facilityId: { $toString: '$facilityId' },
          facilityName: '$facility.details.name',
          facilityImage: { $arrayElemAt: ['$facility.details.images', 0] },
          amount: 1,
          startDate: 1,
          endDate: 1,
          rentalPlan: 1,
          expiresAt: 1,
          isExpired: { $lt: ['$expiresAt', now] },
          updatedAt: 1
        }
      },
      {
        $sort: { updatedAt: -1 }
      }
    ]);

    res.json(failedPayments);

  } catch (error) {
    console.error('Error fetching failed payments:', error);
    res.status(500).json({ error: 'Failed to fetch failed payments' });
  }
};