// controllers/eventController.js
const EventDetail = require("../models/EventDetails");
const mongoose = require("mongoose"); // Use mongoose for ObjectId
const ServiceProvider = require("../models/ServiceProvider");
const calculateEventPriceDetail = require("../../utils/calculateEventPriceDetail");
const { generateRazorpayOrder } = require("../../utils/razorpay");
const { verifyPaymentSignature } = require("../../utils/razorpay");
const { fetchOrderDetails } = require("../../utils/razorpay");
const { fetchPaymentMethod } = require("../../utils/razorpay");
const { sendBookingConfirmationEmail } = require("../../lib/emailService");
const {
  generateAndStoreEventInvoice,
} = require("../../utils/invoiceGenerator");
const { sendInvoiceEmail } = require("../../lib/emailService");
const {
  sendServiceProviderNotificationEmail,
} = require("../../lib/emailService");
const { sendEventInvitationEmail } = require("../../lib/emailService");
const { parseCSVFile } = require("../../utils/csvUtils");
const { ensureTempDir, safeDeleteFile } = require("../../utils/fileUtils");
const multer = require("multer");
const path = require("path");
const {
  storeEventBookingNotifications,
} = require("../../utils/eventNotificationUtils");
const EventBookingDetail = require("../models/EventBookingDetails");
const EventFeedback = require("../models/EventFeedback");


const XLSX = require("xlsx");

const { format } = require("date-fns");

// POST: Create new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { eventId, serviceProviderId, name, email, rating, comments } =
      req.body;

    if (!eventId || !serviceProviderId || !name || !email || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const feedback = new EventFeedback({
      eventId,
      serviceProviderId,
      name,
      email,
      rating,
      comments,
    });

    await feedback.save();
    res
      .status(201)
      .json({ message: "Feedback created successfully", feedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET: Feedback by eventId + serviceProviderId with filters
// GET: Feedback by eventId + serviceProviderId with filters + pagination
exports.getFeedbackByEventAndServiceProvider = async (req, res) => {
  try {
    const { eventId, serviceProviderId } = req.params;
    const { sortBy, filterBy, page = 1, limit = 10 } = req.query;

    if (!eventId || !serviceProviderId) {
      return res
        .status(400)
        .json({ message: "Event ID and Service Provider ID are required" });
    }

    let query = { eventId, serviceProviderId };

    // Filtering
    if (filterBy && filterBy !== "all") {
      const star = parseInt(filterBy.split("-")[0]); // e.g. "5-star" → 5
      if (!isNaN(star)) {
        query.rating = star;
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sortBy === "oldest") sortOption = { createdAt: 1 };
    if (sortBy === "highest") sortOption = { rating: -1 };
    if (sortBy === "lowest") sortOption = { rating: 1 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await EventFeedback.countDocuments(query);

    const feedbacks = await EventFeedback.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      feedbacks,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add to your existing createEvent function
exports.createEvent = async (req, res) => {
  try {
    console.log("1. Incoming body:", req.body);

    const cleanData = {};

    // Convert string booleans
    const booleanFields = [
      "bulkRegistration",
      "customizeTicketEmail",
      "customizeRegistrationEmail",
      "couponAvailability",
      "eventReminder",
      "postEventFeedback",
    ];
    booleanFields.forEach((field) => {
      if (req.body[field]) {
        cleanData[field] =
          req.body[field] === "true" || req.body[field] === true;
      }
    });

    // Numbers
    const numberFields = ["ticketCapacity", "ticketPrice", "bulkTickets"];
    numberFields.forEach((field) => {
      if (req.body[field]) {
        cleanData[field] = parseInt(req.body[field], 10);
      }
    });

    // Dates
const dateFields = [
  "startDateTime",
  "endDateTime",
  "registrationStartDateTime",
  "registrationEndDateTime",
];

dateFields.forEach((field) => {
  if (req.body[field]) {
    const utcDate = new Date(req.body[field]);
    // Add 5 hours 30 minutes → Convert UTC → IST
    const istDate = new Date(utcDate.getTime() - (5.5 * 60 * 60 * 1000));
    cleanData[field] = istDate;
  }
});

    // Strings
    const stringFields = [
      "title",
      "status",
      "venueStatus",
      "venue",
      "description",
      "category",
      "ticketType",
      "applyGst",
      "applyPlatformFee",
      "tickets",
      "coverImage",
      "serviceProviderName",
      "termsAndConditions",
      "refundPolicy",
      "ticketEmailContent",
      "registrationEmailBodyContent",
      "bulkEmailFile",
    ];
    stringFields.forEach((field) => {
      if (req.body[field]) {
        cleanData[field] = req.body[field].trim();
      }
    });

    // JSON
    const jsonFields = [
      "sectors",
      "amenities",
      "features",
      "chiefGuests",
      "collectPersonalInfo",
      "collectIdentityProof",
      "customQuestions",
      "couponDetails",
      "postEventFeedbackDetails",
      "socialMediaLinks",
    ];
    jsonFields.forEach((field) => {
      if (req.body[field]) {
        try {
          cleanData[field] = JSON.parse(req.body[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
          cleanData[field] = [];
        }
      }
    });

    // Service provider
    if (req.body.serviceProviderId) {
      cleanData.serviceProviderId = new mongoose.Types.ObjectId(
        req.body.serviceProviderId
      );
    }

    // Validate service provider exists
    const serviceProvider = await ServiceProvider.findOne({
      userId: cleanData.serviceProviderId,
    });
    if (!serviceProvider) {
      return res.status(400).json({
        message:
          "Invalid serviceProviderId or you do not have access to this service provider",
      });
    }

    // Add service provider name from DB if not provided
    if (!cleanData.serviceProviderName) {
      const serviceProviderFromDb = await ServiceProvider.findOne({
        userId: cleanData.serviceProviderId,
      });
      if (serviceProviderFromDb) {
        cleanData.serviceProviderName =
          serviceProviderFromDb.serviceName || "Unknown Service Provider";
      } else {
        return res.status(400).json({
          message:
            "Service provider not found or you do not have access to this service provider",
        });
      }
    }
    // Computed
    cleanData.hasChiefGuest = cleanData.hasChiefGuest?.length > 0;
    cleanData.hasFeatures = cleanData.features?.length > 0;

    console.log("2. Clean Data:", cleanData);

    // Build model
    const event = new EventDetail(cleanData);
    console.log("3. Event built:", event);

    // Save model
    try {
      const savedEvent = await event.save();
      console.log("4. SAVED EVENT ===>", savedEvent);
      res
        .status(201)
        .json({ message: "Event created successfully", data: savedEvent });
    } catch (err) {
      console.error("❌ Save failed:", err);
      res
        .status(500)
        .json({ message: "Error saving event", error: err.message });
    }
  } catch (error) {
    console.error("❌ Outer catch error:", error);
    res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
};

// Update blast-specific fields for an event
exports.updateEventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Find event by ID
    const event = await EventDetail.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only update provided fields, preserve others

    // Boolean fields: eventReminder, postEventFeedback, couponAvailability
    ["eventReminder", "postEventFeedback", "couponAvailability"].forEach(
      (key) => {
        if (body.hasOwnProperty(key)) {
          let val = body[key];
          if (typeof val === "string") {
            val = val === "true";
          }
          event[key] = !!val;
        }
      }
    );

    // Array/object fields
    if (body.hasOwnProperty("couponDetails")) {
      if (Array.isArray(body.couponDetails)) {
        event.couponDetails = body.couponDetails;
      } else if (typeof body.couponDetails === "string") {
        // Accept stringified JSON
        try {
          event.couponDetails = JSON.parse(body.couponDetails);
        } catch {
          // Ignore parse error
        }
      }
    }
    if (body.hasOwnProperty("postEventFeedbackDetails")) {
      if (Array.isArray(body.postEventFeedbackDetails)) {
        event.postEventFeedbackDetails = body.postEventFeedbackDetails;
      } else if (typeof body.postEventFeedbackDetails === "string") {
        try {
          event.postEventFeedbackDetails = JSON.parse(
            body.postEventFeedbackDetails
          );
        } catch {}
      }
    }

    await event.save();

    return res.status(200).json({
      message: "Event blast details updated",
      event,
    });
  } catch (err) {
    console.error("updateEventDetails error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params; // Get event ID from URL params
    console.log("1. Updating event ID:", eventId);
    console.log("2. Incoming body:", req.body);

    // Find existing event first
    const existingEvent = await EventDetail.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check if user owns this event (optional security check)
    if (
      existingEvent.serviceProviderId.toString() !== req.body.serviceProviderId
    ) {
      return res.status(403).json({
        message: "You don't have permission to edit this event",
      });
    }

    // Use same cleaning logic as create
    const cleanData = {};

    // Convert string booleans (same as create)
    const booleanFields = [
      "bulkRegistration",
      "customizeTicketEmail",
      "customizeRegistrationEmail",
      "couponAvailability",
      "eventReminder",
      "postEventFeedback",
      "limitedEventAccess",
    ];
    booleanFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        cleanData[field] =
          req.body[field] === "true" || req.body[field] === true;
      }
    });

    // Numbers (same as create)
    const numberFields = ["ticketCapacity", "ticketPrice", "bulkTickets"];
    numberFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        cleanData[field] = parseInt(req.body[field], 10);
      }
    });

    // Dates (same as create)
    // const dateFields = [
    //   "startDateTime",
    //   "endDateTime",
    //   "registrationStartDateTime",
    //   "registrationEndDateTime",
    // ];
    // dateFields.forEach((field) => {
    //   if (req.body[field]) {
    //     cleanData[field] = new Date(req.body[field]);
    //   }
    // });

    // Dates
    // const dateFields = [
    //   "startDateTime",
    //   "endDateTime",
    //   "registrationStartDateTime",
    //   "registrationEndDateTime",
    // ];
    // dateFields.forEach((field) => {
    //   if (req.body[field]) {
    //     cleanData[field] = new Date(req.body[field]);
    //   }
    // });


    // Dates
const dateFields = [
  "startDateTime",
  "endDateTime",
  "registrationStartDateTime",
  "registrationEndDateTime",
];

dateFields.forEach((field) => {
  if (req.body[field]) {
    const utcDate = new Date(req.body[field]);
    // Add 5 hours 30 minutes → Convert UTC → IST
    const istDate = new Date(utcDate.getTime() - (5.5 * 60 * 60 * 1000));
    cleanData[field] = istDate;
  }
});
    // Strings (same as create)
    const stringFields = [
      "title",
      "status",
      "venueStatus",
      "venue",
      "description",
      "category",
      "applyGst",
      "applyPlatformFee",
      "ticketType",
      "tickets",
      "coverImage",
      "serviceProviderName",
      "termsAndConditions",
      "refundPolicy",
      "ticketEmailContent",
      "registrationEmailBodyContent",
      "bulkEmailFile",
    ];
    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        cleanData[field] = req.body[field].trim();
      }
    });

    // JSON (same as create)
    const jsonFields = [
      "sectors",
      "amenities",
      "features",
      "chiefGuests",
      "collectPersonalInfo",
      "collectIdentityProof",
      "customQuestions",
      "couponDetails",
      "postEventFeedbackDetails",
      "socialMediaLinks",
    ];
    jsonFields.forEach((field) => {
      if (req.body[field]) {
        try {
          cleanData[field] = JSON.parse(req.body[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
          cleanData[field] = [];
        }
      }
    });

    // Computed fields
    if (cleanData.chiefGuests) {
      cleanData.hasChiefGuest = cleanData.chiefGuests.length > 0;
    }
    if (cleanData.features) {
      cleanData.hasFeatures = cleanData.features.length > 0;
    }

    console.log("3. Clean update data:", cleanData);

    // Update the event
    const updatedEvent = await EventDetail.findByIdAndUpdate(
      eventId,
      {
        $set: {
          ...cleanData,
          approvalStatus: "pending", // always reset to pending on edit
        },
      },
      { new: true, runValidators: true }
    );

    console.log("4. UPDATED EVENT ===>", updatedEvent);

    res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({
      message: "Error updating event",
      error: error.message,
    });
  }
};

// Get event for editing
exports.getEventForEdit = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await EventDetail.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      message: "Error fetching event",
      error: error.message,
    });
  }
};

exports.getEventByServiceProviderId = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;
    const { period, startDate, endDate } = req.query; // Add filter parameters

    if (!serviceProviderId) {
      return res.status(400).json({ message: "serviceProviderId is required" });
    }

    // Sort by createdAt in descending order (latest first)
    const events = await EventDetail.find({
      serviceProviderId: serviceProviderId,
    }).sort({ createdAt: -1 });

    if (!events || events.length === 0) {
      return res.status(204).json({ message: "No events found" });
    }

    // Get all event IDs for this service provider
    const eventIds = events.map((event) => event._id);

    // Calculate date ranges based on filter
    const now = new Date();
    let filterStartDate, filterEndDate, comparePeriodStart, comparePeriodEnd;

    // Determine date ranges based on the period filter
    switch (period) {
      case "This Month":
        filterStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        filterEndDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        comparePeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        comparePeriodEnd = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59
        );
        break;

      case "Last Month":
        filterStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        filterEndDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59
        );
        comparePeriodStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        comparePeriodEnd = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          0,
          23,
          59,
          59
        );
        break;

      case "Last 3 Months":
        filterStartDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        filterEndDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        comparePeriodStart = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        comparePeriodEnd = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          0,
          23,
          59,
          59
        );
        break;

      case "Last 6 Months":
        filterStartDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        filterEndDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        comparePeriodStart = new Date(
          now.getFullYear(),
          now.getMonth() - 12,
          1
        );
        comparePeriodEnd = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          0,
          23,
          59,
          59
        );
        break;

      case "This Year":
        filterStartDate = new Date(now.getFullYear(), 0, 1);
        filterEndDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        comparePeriodStart = new Date(now.getFullYear() - 1, 0, 1);
        comparePeriodEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;

      case "Custom Date":
        if (startDate && endDate) {
          filterStartDate = new Date(startDate);
          filterEndDate = new Date(endDate);
          // For custom date, compare with previous period of same duration
          const duration = filterEndDate - filterStartDate;
          comparePeriodEnd = new Date(filterStartDate - 1);
          comparePeriodStart = new Date(comparePeriodEnd - duration);
        } else {
          // Default to this month if custom dates not provided
          filterStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
          filterEndDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59
          );
          comparePeriodStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );
          comparePeriodEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59
          );
        }
        break;

      default: // 'All Time'
        filterStartDate = new Date("2000-01-01");
        filterEndDate = new Date();
        comparePeriodStart = new Date("2000-01-01");
        comparePeriodEnd = new Date("2000-01-01");
        break;
    }

    // Always calculate these standard periods for the KPI cards
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    const spId = new mongoose.Types.ObjectId(serviceProviderId);

    // Aggregate earnings data from EventBookingDetail
    const earningsAggregation = await EventBookingDetail.aggregate([
      {
        $match: {
          serviceProviderId: spId,
          eventId: { $in: eventIds },
          paymentStatus: { $in: ["completed", "free"] },
          status: { $ne: "cancelled" },
        },
      },
      {
        $addFields: {
          earningsAmount: {
            $cond: {
              if: { $eq: ["$paymentStatus", "free"] },
              then: 0,
              else: "$totalAmount",
            },
          },
        },
      },
      {
        $facet: {
          // Standard KPI periods (always calculated)
          todayEarnings: [
            {
              $match: {
                createdAt: { $gte: startOfToday },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
          ],
          thisWeekEarnings: [
            {
              $match: {
                createdAt: { $gte: startOfWeek },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
          ],
          thisMonthEarnings: [
            {
              $match: {
                createdAt: { $gte: startOfMonth },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
          ],
          lastMonthEarnings: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
          ],
          totalEarnings: [
            {
              $group: {
                _id: null,
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
          ],

          // Filtered period earnings (based on selected filter)
          filteredPeriodEarnings: [
            {
              $match: {
                createdAt: { $gte: filterStartDate, $lte: filterEndDate },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
          ],

          // Compare period earnings (for trend calculation)
          comparePeriodEarnings: [
            {
              $match: {
                createdAt: { $gte: comparePeriodStart, $lte: comparePeriodEnd },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
          ],

          earningsByStatus: [
            {
              $group: {
                _id: "$paymentStatus",
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
          ],
          monthlyEarnings: [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                total: { $sum: "$earningsAmount" },
                count: { $sum: 1 },
              },
            },
            {
              $sort: { "_id.year": -1, "_id.month": -1 },
            },
            {
              $limit: 12,
            },
          ],
        },
      },
    ]);

    // Process earnings data
    const earningsData = earningsAggregation[0] || {};

    // Calculate trend for filtered period
    const filteredEarnings =
      earningsData.filteredPeriodEarnings?.[0]?.total || 0;
    const compareEarnings = earningsData.comparePeriodEarnings?.[0]?.total || 0;
    const filteredTrend =
      compareEarnings > 0
        ? (
            ((filteredEarnings - compareEarnings) / compareEarnings) *
            100
          ).toFixed(2)
        : filteredEarnings > 0
        ? 100
        : 0;

    const earlingsSummary = {
      today: {
        amount: earningsData.todayEarnings?.[0]?.total || 0,
        count: earningsData.todayEarnings?.[0]?.count || 0,
      },
      thisWeek: {
        amount: earningsData.thisWeekEarnings?.[0]?.total || 0,
        count: earningsData.thisWeekEarnings?.[0]?.count || 0,
      },
      thisMonth: {
        amount: earningsData.thisMonthEarnings?.[0]?.total || 0,
        count: earningsData.thisMonthEarnings?.[0]?.count || 0,
      },
      lastMonth: {
        amount: earningsData.lastMonthEarnings?.[0]?.total || 0,
        count: earningsData.lastMonthEarnings?.[0]?.count || 0,
      },
      total: {
        amount: earningsData.totalEarnings?.[0]?.total || 0,
        count: earningsData.totalEarnings?.[0]?.count || 0,
      },

      // Filtered period data
      filtered: {
        amount: filteredEarnings,
        count: earningsData.filteredPeriodEarnings?.[0]?.count || 0,
        period: period || "All Time",
        trend: parseFloat(filteredTrend),
      },

      byStatus: earningsData.earningsByStatus || [],
      monthly: earningsData.monthlyEarnings || [],
    };

    // Calculate standard trends
    const weeklyChange =
      earningsData.lastMonthEarnings?.[0]?.total > 0
        ? (
            ((earlingsSummary.thisWeek.amount -
              earningsData.lastMonthEarnings[0].total) /
              earningsData.lastMonthEarnings[0].total) *
            100
          ).toFixed(2)
        : 0;

    const monthlyChange =
      earningsData.lastMonthEarnings?.[0]?.total > 0
        ? (
            ((earlingsSummary.thisMonth.amount -
              earlingsSummary.lastMonth.amount) /
              earlingsSummary.lastMonth.amount) *
            100
          ).toFixed(2)
        : 0;

    return res.status(200).json({
      message: "Events retrieved successfully",
      events: events,
      earnings: {
        ...earlingsSummary,
        trends: {
          weeklyChange: parseFloat(weeklyChange),
          monthlyChange: parseFloat(monthlyChange),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Additional endpoint for filtered earnings data
exports.getFilteredEarnings = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;
    const { startDate, endDate, paymentStatus, eventId } = req.query;

    if (!serviceProviderId) {
      return res.status(400).json({ message: "serviceProviderId is required" });
    }

    let matchQuery = {
      serviceProviderId: serviceProviderId,
      paymentStatus: { $in: ["completed", "free"] },
      status: { $ne: "cancelled" },
    };

    // Add date range filter
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Add payment status filter
    if (paymentStatus && paymentStatus !== "all") {
      matchQuery.paymentStatus = paymentStatus;
    }

    // Add event filter
    if (eventId && eventId !== "all") {
      matchQuery.eventId = eventId;
    }

    const filteredEarnings = await EventBookingDetail.aggregate([
      { $match: matchQuery },
      {
        $addFields: {
          earningsAmount: {
            $cond: {
              if: { $eq: ["$paymentStatus", "free"] },
              then: 0,
              else: "$totalAmount",
            },
          },
        },
      },
      {
        $lookup: {
          from: "eventdetails",
          localField: "eventId",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$earningsAmount" },
          totalBookings: { $sum: 1 },
          details: { $push: "$$ROOT" },
        },
      },
    ]);

    const result = filteredEarnings[0] || {
      totalAmount: 0,
      totalBookings: 0,
      details: [],
    };

    return res.status(200).json({
      message: "Filtered earnings retrieved successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error fetching filtered earnings:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get events with populated service provider details filtered by userId
// for service provider specific events
exports.getEvents = async (req, res) => {
  try {
    const { id } = req.params; // Get id from route parameters

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const events = await EventDetail.find({ _id: id });

    res.status(200).json({ events });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

// Example: Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const deletedEvent = await EventDetail.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res
      .status(200)
      .json({ message: "Event deleted successfully", data: deletedEvent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};

// Cancel Event

exports.cancelEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const event = await EventDetail.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.activeStatus = "cancelled";
    await event.save();
    res
      .status(200)
      .json({ message: "Event cancelled successfully", data: event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling event", error: error.message });
  }
};

exports.pricingDetail = async (req, res) => {
  try {
    const { event_id, ticket_count, couponCode } = req.body;

    // Validation
    if (!event_id) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    if (!ticket_count || ticket_count <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid ticket count is required",
      });
    }

    // Call utility function
    const result = await calculateEventPriceDetail({
      eventId: event_id,
      ticketCount: parseInt(ticket_count),
      couponCode: couponCode || null,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in pricingDetail controller:", error);

    // Handle specific error cases
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.bookTickets = async (req, res) => {
  try {
    const {
      eventId,
      serviceProviderId,
      ticket_count,
      totalPrice,
      PersonalInfo,
      IdentityProof,
      couponCode,
      customQuestions,
      gstAmount,
      platformFee,
    } = req.body;

    // Validation
    if (!eventId || !ticket_count || !totalPrice || !serviceProviderId) {
      return res.status(400).json({
        message:
          "eventId, ticket_count, totalPrice, and serviceProviderId are required",
      });
    }

    // 🔹 Validate event exists
    const event = await EventDetail.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }



     const result = await calculateEventPriceDetail({
      eventId: event._id,
      ticketCount: parseInt(ticket_count),
      couponCode: couponCode || null,
    });
    
 
    

    // 🔹 Generate Razorpay Order
    const razorpayOrder = await generateRazorpayOrder(result.data.grandTotal);
    if (!razorpayOrder) {
      return res
        .status(500)
        .json({ message: "Failed to create Razorpay order" });
    }

    // 🔹 Save booking in DB
    // Generate booking reference number
    const lastBooking = await EventBookingDetail.findOne()
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .select("bookingRefNumber"); // Only fetch the bookingRefNumber field

    let bookingRefNumber = "BK000001"; // Default for the first booking
    if (lastBooking && lastBooking.bookingRefNumber) {
      const lastNumber = parseInt(lastBooking.bookingRefNumber.slice(2), 10); // Extract the numeric part
      bookingRefNumber = `BK${String(lastNumber + 1).padStart(6, "0")}`; // Increment and pad with zeros
    }


    const booking = new EventBookingDetail({
      eventId,
      serviceProviderId,
      bookingRefNumber,
      bookingTickets: ticket_count,
      totalAmount: result.data.grandTotal,
      gstAmount: result.data.gst || 0,
      platformFee: result.data.platformFee || 0,
      razorpayOrderId: razorpayOrder.id,
      discountAmount: result?.data?.coupon?.discountAmount || 0,
      couponCode: couponCode || null,
      paymentStatus: "pending",
      status: "pending",
      paymentMethod: "razorpay",
      PersonalInfo,
      IdentityProof,
      customQuestions,
    });

    const savedBooking = await booking.save();



    // 🔹 Structured response
    res.status(201).json({
      message: "Tickets booked successfully",
      booking: {
        id: savedBooking._id,
        eventId: savedBooking.eventId,
        bookingRefNumber: savedBooking.bookingRefNumber,
        bookingTickets: savedBooking.bookingTickets,
        totalAmount: savedBooking.totalAmount,
      },
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error("❌ Error booking tickets:", error);
    res.status(500).json({
      message: "Error booking tickets",
      error: error.message,
    });
  }
};

exports.bookFreeTickets = async (req, res) => {
  try {
    const {
      eventId,
      serviceProviderId,
      ticket_count,
      PersonalInfo,
      IdentityProof,
      customQuestions,
    } = req.body;

    // Validation
    if (!eventId || !ticket_count || !serviceProviderId) {
      return res.status(400).json({
        message: "eventId, ticket_count, and serviceProviderId are required",
      });
    }

    // Validate that PersonalInfo is provided
    if (
      !PersonalInfo ||
      !Array.isArray(PersonalInfo) ||
      PersonalInfo.length === 0
    ) {
      return res.status(400).json({
        message: "PersonalInfo is required for booking",
      });
    }

    // 🔹 Validate event exists and is free - GET CUSTOM EMAIL CONTENT
    const event = await EventDetail.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.ticketType !== "free") {
      return res.status(400).json({
        message:
          "This endpoint is only for free events. Use the paid booking endpoint for paid events.",
      });
    }

    // 🔹 Check ticket availability for limited events
    if (event.tickets === "limited") {
      const availableTickets =
        event.ticketCapacity - (event.bookedTicketsCount || 0);
      if (availableTickets < ticket_count) {
        return res.status(400).json({
          message: `Only ${availableTickets} tickets available. You requested ${ticket_count} tickets.`,
        });
      }
    }

    // 🔹 Generate booking reference number
    const lastBooking = await EventBookingDetail.findOne()
      .sort({ createdAt: -1 })
      .select("bookingRefNumber");

    let bookingRefNumber = "BK000001";
    if (lastBooking && lastBooking.bookingRefNumber) {
      const lastNumber = parseInt(lastBooking.bookingRefNumber.slice(2), 10);
      bookingRefNumber = `BK${String(lastNumber + 1).padStart(6, "0")}`;
    }

    // 🔹 Create free booking record
    const booking = new EventBookingDetail({
      eventId,
      serviceProviderId,
      bookingRefNumber,
      bookingTickets: ticket_count,
      totalAmount: 0, // Free event
      gstAmount: 0,
      platformFee: 0,
      paymentStatus: "free", // Set payment status as free
      status: "confirmed", // Directly confirm free bookings
      paymentMethod: "free",
      razorpayOrderId: null, // No Razorpay order for free events
      PersonalInfo,
      IdentityProof: IdentityProof || [],
      customQuestions: customQuestions || [],
    });

    const savedBooking = await booking.save();

    // 🔹 Increment booked tickets count in EventDetail
    await EventDetail.findByIdAndUpdate(eventId, {
      $inc: { bookedTicketsCount: ticket_count },
    });

    console.log(
      "Free booking created successfully. Starting post-booking processes..."
    );

    try {
      await storeEventBookingNotifications(savedBooking, event);
    } catch (notificationError) {
      console.error("❌ Error storing notifications:", notificationError);
      // Continue processing - notifications are not critical
    }

    // 🔹 Get user details from PersonalInfo
    const userEmail = savedBooking.PersonalInfo[0]?.useremail;
    const userPhone = savedBooking.PersonalInfo[0]?.userphoneNumber;
    const userName = savedBooking.PersonalInfo[0]?.userfullName;

    console.log("User details:", { userName, userEmail, userPhone });

    // 🔹 Get service provider details
    let serviceProvider = null;
    if (event.serviceProviderId) {
      serviceProvider = await ServiceProvider.findOne({
        userId: event.serviceProviderId,
      });
      console.log("Service provider email:", serviceProvider?.primaryEmailId);
    }

    // 🔹 Format event details for emails
    const eventTitle = event.title || "Event";
    const eventDate = new Date(event.startDateTime).toLocaleDateString(
      undefined,
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone:"Asia/Kolkata",
      }
    );
    const eventTime = new Date(event.startDateTime).toLocaleTimeString(
      undefined,
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone:"Asia/Kolkata",
      }
    );

    // 🔹 Send booking confirmation email to user WITH CUSTOM CONTENT
    if (userEmail) {
      try {
        console.log("Sending free booking confirmation email to user...");

        // Get custom registration email content if available
        let customContent = null;
        if (
          event.customizeRegistrationEmail &&
          event.registrationEmailBodyContent
        ) {
          customContent = event.registrationEmailBodyContent;
        }

        await sendBookingConfirmationEmail({
          to: userEmail,
          userName: userName || "Valued Customer",
          eventTitle,
          eventDate,
          eventTime,
          venue: event.venue || "TBD",
          ticketCount: savedBooking.bookingTickets,
          totalAmount: 0, // Free event - will show ₹0
          bookingId: savedBooking.bookingRefNumber,
          customContent: customContent, // Pass custom content
        });
        console.log("Free booking confirmation email sent successfully");
      } catch (emailError) {
        console.error(
          "Error sending free booking confirmation email:",
          emailError
        );
      }
    }

    // 🔹 Generate and store invoice (even for free events)
    let invoiceData = null;
    try {
      console.log("Generating invoice for free booking...");
      invoiceData = await generateAndStoreEventInvoice(savedBooking._id);
      console.log("Free booking invoice generated successfully:", invoiceData);
    } catch (invoiceError) {
      console.error("Error generating free booking invoice:", invoiceError);
    }

    // 🔹 Send invoice email to user WITH CUSTOM CONTENT
    if (userEmail && invoiceData) {
      try {
        console.log("Sending invoice email for free booking...");

        // Get custom ticket email content if available
        let customContent = null;
        if (event.customizeTicketEmail && event.ticketEmailContent) {
          customContent = event.ticketEmailContent;
        }

        await sendInvoiceEmail({
          to: userEmail,
          userName: userName || "Valued Customer",
          eventTitle,
          bookingId: savedBooking.bookingRefNumber,
          invoiceUrl: invoiceData.invoiceUrl,
          totalAmount: 0, // Free event
          customContent: customContent, // Pass custom content
        });
        console.log("Free booking invoice email sent successfully");
      } catch (emailError) {
        console.error("Error sending free booking invoice email:", emailError);
      }
    }

    // 🔹 Send notification to service provider
    if (serviceProvider?.primaryEmailId) {
      try {
        console.log(
          "Sending notification to service provider for free booking..."
        );
        await sendServiceProviderNotificationEmail({
          to: serviceProvider.primaryEmailId,
          eventTitle,
          userName: userName || "Customer",
          userEmail: userEmail || "N/A",
          userPhone: userPhone || "N/A",
          ticketCount: savedBooking.bookingTickets,
          totalAmount: 0, // Free event
          bookingId: savedBooking.bookingRefNumber,
        });
        console.log(
          "Service provider notification sent successfully for free booking"
        );
      } catch (emailError) {
        console.error(
          "Error sending service provider notification for free booking:",
          emailError
        );
      }
    }

    // 🔹 Structured response
    res.status(201).json({
      message: "Free tickets booked successfully",
      booking: {
        id: savedBooking._id,
        eventId: savedBooking.eventId,
        bookingRefNumber: savedBooking.bookingRefNumber,
        bookingTickets: savedBooking.bookingTickets,
        totalAmount: savedBooking.totalAmount,
        paymentStatus: savedBooking.paymentStatus,
        status: savedBooking.status,
      },
      invoiceUrl: invoiceData?.invoiceUrl || null,
      emailsSent: {
        userConfirmation: !!userEmail,
        userInvoice: !!(userEmail && invoiceData),
        serviceProviderNotification: !!serviceProvider?.primaryEmailId,
      },
    });
  } catch (error) {
    console.error("❌ Error booking free tickets:", error);
    res.status(500).json({
      message: "Error booking free tickets",
      error: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    console.log("Verifying payment with data:", req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventBookingId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !eventBookingId
    ) {
      return res
        .status(400)
        .json({ message: "All payment details are required" });
    }

    // Fetch order details from Razorpay
    const orderDetails = await fetchOrderDetails(razorpay_order_id);
    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate booking AND GET EVENT DETAILS WITH CUSTOM EMAIL CONTENT
    const booking = await EventBookingDetail.findOne({
      razorpayOrderId: orderDetails.id,
    })
      .populate(
        "eventId",
        "title startDateTime endDateTime venue ticketPrice serviceProviderId customizeRegistrationEmail registrationEmailBodyContent customizeTicketEmail ticketEmailContent"
      )
      .exec();

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found for this order" });
    }

    // Get user details
    const userEmail = booking.PersonalInfo[0]?.useremail;
    const userPhone = booking.PersonalInfo[0]?.userphoneNumber;
    const userName = booking.PersonalInfo[0]?.userfullName;

    console.log("User details:", { userName, userEmail, userPhone });

    // Get service provider details
    let serviceProvider = null;
    if (booking.eventId?.serviceProviderId) {
      serviceProvider = await ServiceProvider.findOne({
        userId: booking.eventId.serviceProviderId,
      });
      console.log("Service provider email:", serviceProvider?.primaryEmailId);
    }

    // Verify payment signature
    const isValid = await verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Get payment method details
    const methodDetails = await fetchPaymentMethod(razorpay_payment_id);

    // Update payment status
    booking.paymentStatus = "completed";
    booking.paymentMethod = methodDetails.method;
    await booking.save();

    console.log(
      "Payment verified successfully. Starting post-payment processes..."
    );

    const eventId = booking.eventId;
    const ticket_count = booking.bookingTickets;
    // 🔹 Increment booked tickets count in EventDetail
    await EventDetail.findByIdAndUpdate(eventId, {
      $inc: { bookedTicketsCount: ticket_count }, // increase by number of tickets booked
    });
    // 🆕 STORE NOTIFICATIONS IN SAME COLLECTION
    try {
      await storeEventBookingNotifications(booking, booking.eventId);
    } catch (notificationError) {
      console.error("❌ Error storing notifications:", notificationError);
      // Continue processing - notifications are not critical
    }

    // Format event details for emails
    const eventTitle = booking.eventId?.title || "Event";
    const eventDate = new Date(
      booking.eventId?.startDateTime
    ).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone:"Asia/Kolkata",
    });
    const eventTime = new Date(
      booking.eventId?.startDateTime
    ).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone:"Asia/Kolkata",
    });

    // 1. Send booking confirmation email to user WITH CUSTOM CONTENT
    if (userEmail) {
      try {
        console.log("Sending booking confirmation email to user...");

        // Get custom registration email content if available
        let customContent = null;
        if (
          booking.eventId?.customizeRegistrationEmail &&
          booking.eventId?.registrationEmailBodyContent
        ) {
          customContent = booking.eventId.registrationEmailBodyContent;
        }

        await sendBookingConfirmationEmail({
          to: userEmail,
          userName: userName || "Valued Customer",
          eventTitle,
          eventDate,
          eventTime,
          venue: booking.eventId?.venue || "TBD",
          ticketCount: booking.bookingTickets,
          totalAmount: booking.totalAmount,
          bookingId: booking.bookingRefNumber,
          customContent: customContent, // Pass custom content
        });
        console.log("Booking confirmation email sent successfully");
      } catch (emailError) {
        console.error("Error sending booking confirmation email:", emailError);
      }
    }

    // 2. Generate and store invoice
    let invoiceData = null;
    try {
      console.log("Generating invoice...");
      invoiceData = await generateAndStoreEventInvoice(booking._id);
      console.log("Invoice generated successfully:", invoiceData);
    } catch (invoiceError) {
      console.error("Error generating invoice:", invoiceError);
    }

    // 3. Send invoice email to user WITH CUSTOM CONTENT
    if (userEmail && invoiceData) {
      try {
        console.log("Sending invoice email to user...");

        // Get custom ticket email content if available
        let customContent = null;
        if (
          booking.eventId?.customizeTicketEmail &&
          booking.eventId?.ticketEmailContent
        ) {
          customContent = booking.eventId.ticketEmailContent;
        }

        await sendInvoiceEmail({
          to: userEmail,
          userName: userName || "Valued Customer",
          eventTitle,
          bookingId: booking.bookingRefNumber,
          invoiceUrl: invoiceData.invoiceUrl,
          totalAmount: booking.totalAmount,
          customContent: customContent, // Pass custom content
        });
        console.log("Invoice email sent successfully");
      } catch (emailError) {
        console.error("Error sending invoice email:", emailError);
      }
    }

    // 4. Send notification to service provider
    if (serviceProvider?.primaryEmailId) {
      try {
        console.log("Sending notification to service provider...");
        await sendServiceProviderNotificationEmail({
          to: serviceProvider.primaryEmailId,
          eventTitle,
          userName: userName || "Customer",
          userEmail: userEmail || "N/A",
          userPhone: userPhone || "N/A",
          ticketCount: booking.bookingTickets,
          totalAmount: booking.totalAmount,
          bookingId: booking.bookingRefNumber,
        });
        console.log("Service provider notification sent successfully");
      } catch (emailError) {
        console.error(
          "Error sending service provider notification:",
          emailError
        );
      }
    }

    res.status(200).json({
      message: "Payment verified and status updated successfully",
      paymentMethod: methodDetails,
      invoiceUrl: invoiceData?.invoiceUrl || null,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
};

// Example: List all events (for admin)

exports.listEvents = async (req, res) => {
  try {
    const events = await EventDetail.find().populate(
      "serviceProviderId",
      "serviceName name primaryContact1Name"
    );
    res.status(200).json({ events });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

// controllers/eventController.js

exports.getEventsWithFilters = async (req, res) => {
  try {
    const {
      category,
      location,
      venueStatus, // online/offline
      ticketType, // free/paid
      dateFilter, // today, tomorrow, this-week, this-month
      limit = 6,
    } = req.query;

    console.log("Filter parameters received:", req.query);

    // Build filter object
    const filter = {};
    
    // Only show approved events
    filter.approvalStatus = "approved";
    filter.status = "public";
    filter.activeStatus = "upcoming";
    filter.endDateTime = { $gte: new Date() };

    // Category filter
    if (category && category !== "all") {
      filter.category = new RegExp(category, "i");
    }

    // Location filter (search in venue field)
    if (location && location !== "all") {
      filter.venue = new RegExp(location, "i");
    }

    // Venue status filter (online/offline)
    if (venueStatus && venueStatus !== "all") {
      filter.venueStatus = venueStatus;
    }

    // Ticket type filter (free/paid)
    if (ticketType && ticketType !== "all") {
      filter.ticketType = ticketType;
    }

    // Date filter
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (dateFilter) {
        case "today":
          const todayEnd = new Date(today);
          todayEnd.setDate(todayEnd.getDate() + 1);
          filter.startDateTime = {
            $gte: today,
            $lt: todayEnd,
          };
          break;

        case "tomorrow":
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowEnd = new Date(tomorrow);
          tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
          filter.startDateTime = {
            $gte: tomorrow,
            $lt: tomorrowEnd,
          };
          break;

        case "this-week":
          const weekStart = new Date(today);
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          filter.startDateTime = {
            $gte: weekStart,
            $lt: weekEnd,
          };
          break;

        case "this-month":
          const monthStart = new Date(today);
          const monthEnd = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            1
          );
          filter.startDateTime = {
            $gte: monthStart,
            $lt: monthEnd,
          };
          break;
      }
    }

    console.log("Constructed filter:", JSON.stringify(filter, null, 2));

    // Execute query
    const events = await EventDetail.find(filter)
      .populate("serviceProviderId", "serviceName primaryEmailId")
      .sort({ startDateTime: 1 })
      .limit(parseInt(limit))
      .lean();

    console.log(`Found ${events.length} events`);

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching events with filters:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

// Get featured events for homepage initial load
exports.getFeaturedEvents = async (req, res) => {
  try {
        const limit = parseInt(req.query.limit) || 6;

    // STEP 1: Get featured events
    const featured = await EventDetail.find({
      isFeatured: true,
      endDateTime: { $gte: new Date() },
      approvalStatus: "approved",
      activeStatus: "upcoming",
      status: "public",
    })
    .populate("serviceProviderId", "serviceName primaryEmailId")
    .sort({ startDateTime: 1 })
    .limit(limit)
    .lean();

    const featuredIds = featured.map(e => e._id);

    // STEP 2: Fill remaining slots with non-featured events
    let normal = [];

    if (featured.length < limit) {
      const remaining = limit - featured.length;

      normal = await EventDetail.find({
        isFeatured: { $ne: true },
        endDateTime: { $gte: new Date() },
        approvalStatus: "approved",
        activeStatus: "upcoming",
        status: "public",
        _id: { $nin: featuredIds }
      })
      .populate("serviceProviderId", "serviceName primaryEmailId")
      .sort({ startDateTime: 1 })
      .limit(remaining)
      .lean();
    }

    // STEP 3: Merge in correct order
    const featuredEvents = [...featured, ...normal];


      let data = [];

    for (const event of featuredEvents) {
      if (event.isFeatured === undefined) event.isFeatured = false;
      const adjustTime = (utcDate) => {
        if (!utcDate) return null;
        const date = new Date(utcDate);
        return new Date(date.getTime());
      };

       const record = {
        _id: event._id,
        serviceProviderId: event.serviceProviderId,
        serviceProviderName:
          event.serviceProviderName ||
          event.serviceProviderId?.serviceName ||
          "",
        bookedTicketsCount: event.bookedTicketsCount,
        title: event.title,
        status: event.status,
        startDateTime: adjustTime(event.startDateTime),
        endDateTime: adjustTime(event.endDateTime),
        venue: event.venue,
        venueStatus: event.venueStatus,
        description: event.description,
        category: event.category,
        sectors: event.sectors,
        amenities: event.amenities,
        coverImage: event.coverImage,
        features: event.features,
        chiefGuests: event.chiefGuests,
        hasChiefGuest: event.hasChiefGuest,
        hasFeatures: event.hasFeatures,
        approvalStatus: event.approvalStatus,
        activeStatus: event.activeStatus,
        isFeatured: event.isFeatured,
        ticketType: event.ticketType,
        tickets: event.tickets,
        ticketCapacity: event.ticketCapacity,
        ticketPrice: event.ticketPrice,
        bulkRegistration: event.bulkRegistration,
        bulkTickets: event.bulkTickets,
        registrationStartDateTime: adjustTime(event.registrationStartDateTime),
        registrationEndDateTime: adjustTime(event.registrationEndDateTime),
        customizeTicketEmail: event.customizeTicketEmail,
        limitedEventAccess: event.limitedEventAccess,
        collectPersonalInfo: event.collectPersonalInfo,
        collectIdentityProof: event.collectIdentityProof,
        customQuestions: event.customQuestions,
        customizeRegistrationEmail: event.customizeRegistrationEmail,
        termsAndConditions: event.termsAndConditions,
        refundPolicy: event.refundPolicy,
        couponAvailability: event.couponAvailability,
        couponDetails: event.couponDetails,
        eventReminder: event.eventReminder,
        postEventFeedback: event.postEventFeedback,
        postEventFeedbackDetails: event.postEventFeedbackDetails,
        socialMediaLinks: event.socialMediaLinks,
        createdAt: adjustTime(event.createdAt),
        updatedAt: adjustTime(event.updatedAt),
        __v: event.__v,
        registrationEmailBodyContent: event.registrationEmailBodyContent,
        ticketEmailContent: event.ticketEmailContent,
      };

      data.push(record);
    }

    res.status(200).json({
      success: true,
      events: featuredEvents,
    });
  } catch (error) {
    console.error("Error fetching featured events:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured events",
      error: error.message,
    });
  }
};


// controllers/eventController.js - Add this search method

// Search events with pagination
exports.searchEvents = async (req, res) => {
  try {
    const {
      search = "",
      category,
      location,
      venueStatus, // online/offline
      ticketType, // free/paid
      dateFilter, // today, tomorrow, this-week, this-month
      page = 1,
      limit = 12,
      sortBy = "startDateTime",
      sortOrder = "asc",
    } = req.query;

    console.log("Search parameters received:", req.query);

    // Build filter object
    const filter = {};

    // Only show approved events
    filter.endDateTime = { $gte: new Date() };
    filter.approvalStatus = "approved";
    filter.activeStatus = "upcoming";
    filter.status = "public";

    // Search across multiple fields
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { serviceProviderName: searchRegex },
        { venue: searchRegex },
        { sectors: { $in: [searchRegex] } },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      filter.category = new RegExp(category, "i");
    }

    // Location filter (search in venue field)
    if (location && location !== "all") {
      filter.venue = new RegExp(location, "i");
    }

    // Venue status filter (online/offline)
    if (venueStatus && venueStatus !== "all") {
      filter.venueStatus = venueStatus;
    }

    // Ticket type filter (free/paid)
    if (ticketType && ticketType !== "all") {
      filter.ticketType = ticketType;
    }

    // Date filter
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (dateFilter) {
        case "today":
          const todayEnd = new Date(today);
          todayEnd.setDate(todayEnd.getDate() + 1);
          filter.startDateTime = {
            $gte: today,
            $lt: todayEnd,
          };
          break;

        case "tomorrow":
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowEnd = new Date(tomorrow);
          tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
          filter.startDateTime = {
            $gte: tomorrow,
            $lt: tomorrowEnd,
          };
          break;

        case "this-week":
          const weekStart = new Date(today);
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          filter.startDateTime = {
            $gte: weekStart,
            $lt: weekEnd,
          };
          break;

        case "this-month":
          const monthStart = new Date(today);
          const monthEnd = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            1
          );
          filter.startDateTime = {
            $gte: monthStart,
            $lt: monthEnd,
          };
          break;
      }
    }

    console.log("Constructed search filter:", JSON.stringify(filter, null, 2));

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with population and pagination
    const events = await EventDetail.find(filter)
      .populate("serviceProviderId", "serviceName primaryEmailId")
      .sort(sortOptions)
      // .skip(skip)
      // .limit(parseInt(limit))
      .lean();

      events.sort((a, b) => {
  if (a.isFeatured && !b.isFeatured) return -1;
  if (!a.isFeatured && b.isFeatured) return 1;

  return new Date(a.startDateTime) - new Date(b.startDateTime);
});


    // Get total count for pagination
   const totalCount = events.length;
const totalPages = Math.ceil(totalCount / parseInt(limit));
const start = (parseInt(page) - 1) * parseInt(limit);
const end = start + parseInt(limit);
const paginatedEvents = events.slice(start, end);

    console.log(`Found ${paginatedEvents.length} events out of ${totalCount} total`);

    res.status(200).json({
      success: true,
      events: paginatedEvents,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      searchQuery: search,
      appliedFilters: {
        search,
        category,
        location,
        venueStatus,
        ticketType,
        dateFilter,
      },
    });
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({
      success: false,
      message: "Error searching events",
      error: error.message,
    });
  }
};

exports.getBookingByEventIdServiceProviderId = async (req, res) => {
  try {
    const { eventId, serviceProviderId } = req.params;

    if (!eventId || !serviceProviderId) {
      return res.status(400).json({
        message: "Event ID and Service Provider ID are required",
      });
    }

    // 🔹 Validate event exists
    const event = await EventDetail.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔹 Fetch bookings
    const bookings = await EventBookingDetail.find({
      eventId: eventId,
      serviceProviderId: serviceProviderId,
    }).sort({ createdAt: -1 });;

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings found for this event",
        data: {
          bookings: [],
          ticketSummary: {
            ticketCapacity:
              event.tickets === "unlimited"
                ? "unlimited"
                : event.ticketCapacity || 0,
            bookedTicketsCount: 0,
            remainingTickets:
              event.tickets === "unlimited"
                ? "unlimited"
                : event.ticketCapacity || 0,
          },
          paymentSummary: {
            totalBookings: 0,
            totalEarnings: 0,
          },
        },
      });
    }

    // 🔹 Ticket calculations
    const ticketCapacity =
      event.tickets === "unlimited" ? "unlimited" : event.ticketCapacity || 0;
    const bookedTicketsCount =
      event.bookedTicketsCount ||
      bookings.reduce((sum, b) => sum + b.bookingTickets, 0);
    const remainingTickets =
      ticketCapacity === "unlimited"
        ? "unlimited"
        : Math.max(ticketCapacity - bookedTicketsCount, 0);

    // 🔹 Payment calculations
    const totalBookings = bookings.length;
    const totalEarnings = bookings
      .filter(
        (b) => b.paymentStatus === "completed" || b.paymentStatus === "free"
      )
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: {
        bookings,
        ticketSummary: {
          ticketCapacity,
          bookedTicketsCount,
          remainingTickets,
        },
        paymentSummary: {
          totalBookings,
          totalEarnings,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching bookings by event ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// Better multer configuration
// Multer configuration - ONLY in controller
const uploadCSV = multer({
  dest: "temp/",
  fileFilter: (req, file, cb) => {
    console.log("File received:", file.originalname, file.mimetype);

    if (
      file.mimetype === "text/csv" ||
      file.mimetype === "application/csv" ||
      file.mimetype === "text/plain" ||
      file.mimetype === "application/octet-stream" ||
      file.originalname.toLowerCase().endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Only CSV files are allowed`
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    fieldSize: 10 * 1024 * 1024, // 10MB for text fields
    fields: 10, // Max 10 non-file fields
    files: 1, // Max 1 file
  },
});

// Main controller with email sending
exports.sendBulkEventInvitations = async (req, res) => {
  console.log("=== Bulk Invitation Request Started ===");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("URL:", req.url);
  console.log("Method:", req.method);

  ensureTempDir();

  try {
    uploadCSV.single("bulkEmailFile")(req, res, async (err) => {
      console.log("Multer processing completed");

      if (err) {
        console.error("Multer error details:", {
          message: err.message,
          code: err.code,
          field: err.field,
          storageErrors: err.storageErrors,
        });

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 50MB.",
          });
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            success: false,
            message:
              'Unexpected file field. Use "bulkEmailFile" as field name.',
          });
        }

        return res.status(400).json({
          success: false,
          message: "File upload error",
          error: err.message,
          code: err.code || "UPLOAD_ERROR",
        });
      }

      console.log("Request body:", req.body);
      console.log("Uploaded file:", req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            'No CSV file uploaded. Make sure field name is "bulkEmailFile"',
        });
      }

      const filePath = req.file.path;

      try {
        const {
          eventId,
          eventTitle,
          eventVenue,
          startDateTime,
          registrationEndDateTime,
          registrationStartDateTime,
        } = req.body;

        console.log("Event details received:", {
          eventId,
          eventTitle,
          eventVenue,
          startDateTime,
          registrationEndDateTime,
          registrationStartDateTime,
        });

        if (
          !eventId ||
          !eventTitle ||
          !eventVenue ||
          !startDateTime ||
          !registrationEndDateTime ||
          !registrationStartDateTime
        ) {
          safeDeleteFile(filePath);
          return res.status(400).json({
            success: false,
            message: "Missing required event details",
            received: {
              eventId,
              eventTitle,
              eventVenue,
              startDateTime,
              registrationEndDateTime,
            },
          });
        }

        // Parse CSV file to extract emails
        const emails = await parseCSVFile(filePath);

        if (emails.length === 0) {
          safeDeleteFile(filePath);
          return res.status(400).json({
            success: false,
            message: "No valid email addresses found in the CSV file",
          });
        }

        if (emails.length > 200) {
          safeDeleteFile(filePath);
          return res.status(400).json({
            success: false,
            message:
              "Too many email addresses. Maximum 200 emails allowed per batch.",
          });
        }

        console.log(
          `Found ${emails.length} emails:`,
          emails.slice(0, 3),
          "..."
        );

        // Format dates for email (same as your existing email format)
        const eventDate = new Date(startDateTime).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
         timeZone: "Asia/Kolkata",
        });

        const eventTime = new Date(startDateTime).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });

        const registrationEndDate = new Date(
          registrationEndDateTime
        ).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        });

        const registrationStartDate = new Date(
          registrationStartDateTime
        ).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        });
        console.log(
          `Sending invitations to ${emails.length} recipients for event: ${eventTitle}`
        );
        console.log("Formatted dates:", {
          eventDate,
          eventTime,
          registrationEndDate,
          registrationStartDate,
        });

        // Send emails in batches to avoid overwhelming SMTP server
        const batchSize = 5; // Small batch size for Zoho SMTP rate limits
        const results = {
          successful: [],
          failed: [],
        };

        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);

          console.log(
            `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
              emails.length / batchSize
            )} (${batch.length} emails)`
          );

          const batchPromises = batch.map(async (email) => {
            try {
              // Call your existing email function
              await sendEventInvitationEmail({
                to: email,
                eventTitle,
                eventVenue,
                eventDate,
                eventTime,
                registrationStartDate,
                registrationEndDate,
                eventId,
              });

              console.log(`✓ Invitation sent to: ${email}`);
              results.successful.push(email);
              return { success: true, email };
            } catch (error) {
              console.error(`✗ Failed to send to ${email}:`, error.message);
              results.failed.push({ email, error: error.message });
              return { success: false, email, error: error.message };
            }
          });

          // Wait for current batch to complete
          await Promise.all(batchPromises);

          // Add delay between batches for Zoho SMTP rate limits
          if (i + batchSize < emails.length) {
            console.log("Waiting 3 seconds before next batch...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }

        // Clean up temporary file
        safeDeleteFile(filePath);

        const response = {
          success: true,
          message: "Bulk invitations sent successfully!",
          totalEmails: emails.length,
          successfulSends: results.successful.length,
          failedSends: results.failed.length,
          successful: results.successful,
          failed: results.failed.length > 0 ? results.failed : undefined,
          eventDetails: {
            eventId,
            eventTitle,
            eventVenue,
            eventDate,
            eventTime,
            registrationStartDate,
            registrationEndDate,
          },
        };

        console.log(
          `🎉 Bulk invitation summary: ${results.successful.length}/${emails.length} successful`
        );

        return res.status(200).json(response);
      } catch (parseError) {
        console.error("CSV processing error:", parseError);
        safeDeleteFile(filePath);
        return res.status(500).json({
          success: false,
          message: "Error processing CSV file",
          error: parseError.message,
        });
      }
    });
  } catch (outerError) {
    console.error("Outer error:", outerError);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: outerError.message,
    });
  }
};



exports.exportAllBookings = async (req, res) => {
  try {
    console.log("📦 Export booking details request received...");

    event_id = req.body.event_id;
    facility_id = req.body.facility_id;

    console.log("Filter parameters:", { event_id, facility_id });
    let bookings=[];
 

    // 1️⃣ Fetch all bookings
    if (event_id && facility_id) {
      bookings = await EventBookingDetail.find({
        eventId: event_id,
        serviceProviderId: facility_id,
      });
    } else if (event_id) {
      bookings = await EventBookingDetail.find({ eventId: event_id });
    } else if (facility_id) {
      bookings = await EventBookingDetail.find({
        serviceProviderId: facility_id,
      });
    } else {
      bookings = await EventBookingDetail.find();
    }

    console.log(`Fetched ${bookings.length} booking records.`);

    if (!bookings.length) {
      return res.status(404).json({
        success: false,
        message: "No booking records found.",
      });
    }

    // 2️⃣ Transform data for Excel
    // const exportData = bookings.map((b, index) => {
    //   const personalInfo = b.PersonalInfo?.[0] || {};
    //   const identity = b.IdentityProof?.[0] || {};

    //   // Convert UTC → IST (+5.5 hours)
    //   const createdAtIST = b.createdAt
    //     ? new Date(b.createdAt.getTime())
    //     : null;

    //   // Flatten custom questions
    //   const customQuestions = (b.customQuestions || [])
    //     .map((q) => `${q.question}: ${q.answer}`)
    //     .join(" | ");

    //   return {
    //     "S.No": index + 1,
    //     "Booking Ref Number": b.bookingRefNumber || "",
    //     Status: b.status || "",
    //     "Payment Status": b.paymentStatus || "",
    //     "Payment Method": b.paymentMethod || "",
    //     "Booking Tickets": b.bookingTickets ?? 0,
    //     "GST Amount": b.gstAmount ?? 0,
    //     "Platform Fee": b.platformFee ?? 0,
    //     "Total Amount": b.totalAmount ?? 0,
    //     "User Name": personalInfo.userfullName || "",
    //     "User Email": personalInfo.useremail || "",
    //     "User Phone": personalInfo.userphoneNumber || "",
    //     "User ID Proof": identity.useridProof || "",
    //     "User ID Number": identity.useridNumber || "",
    //     "User Website": identity.userwebisteLink || "",
    //     "Custom Questions": customQuestions,
    //     "Invoice URL": b.invoiceUrl || "",
    //     "Created At (IST)": createdAtIST
    //       ? format(createdAtIST, "dd-MM-yyyy HH:mm:ss")
    //       : "",
    //   };
    // });

    const exportData = bookings.map((b, index) => {
  const personalInfo = b.PersonalInfo?.[0] || {};
  const identity = b.IdentityProof?.[0] || {};

  // Convert UTC → IST (+5.5 hours)
  const createdAtIST = b.createdAt
    ? new Date(b.createdAt.getTime() + 5.5 * 60 * 60 * 1000)
    : null;

  // ✅ Create dynamic question-answer columns
  const questionColumns = {};
  (b.customQuestions || []).forEach((q) => {
    if (q.question) {
      questionColumns[q.question] = q.answer || "";
    }
  });

  return {
    "S.No": index + 1,
    "Booking Ref Number": b.bookingRefNumber || "",
    Status: b.status || "",
    "Payment Status": b.paymentStatus || "",
    "Payment Method": b.paymentMethod || "",
    "Booking Tickets": b.bookingTickets ?? 0,
    "GST Amount": b.gstAmount ?? 0,
    "Platform Fee": b.platformFee ?? 0,
    "Total Amount": b.totalAmount ?? 0,
    "User Name": personalInfo.userfullName || "",
    "User Email": personalInfo.useremail || "",
    "User Phone": personalInfo.userphoneNumber || "",
    "User ID Proof": identity.useridProof || "",
    "User ID Number": identity.useridNumber || "",
    "User Website": identity.userwebisteLink || "",
    "Invoice URL": b.invoiceUrl || "",
    "Created At (IST)": createdAtIST
      ? format(createdAtIST, "dd-MM-yyyy HH:mm:ss")
      : "",
    ...questionColumns, // ✅ Spread dynamic question columns at the end
  };
});

    // 3️⃣ Generate Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EventBookings");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    
    // 4️⃣ Send Excel file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=event_bookings.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);

    console.log(`✅ Exported ${bookings.length} bookings successfully.`);
  } catch (error) {
    console.error("❌ Error exporting bookings:", error);
    res.status(500).json({
      success: false,
      message: "Error exporting booking details.",
      error: error.message,
    });
  }
};

