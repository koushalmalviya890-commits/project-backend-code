const mongoose = require("mongoose");
const Review = require("../models/Review");
const Startup = require("../models/Startup");

// --- 1. POST: Submit Review ---
exports.createReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { bookingId, incubatorId, facilityId, rating, comment } = req.body;
    const startupId = req.user.id;

    if (!bookingId || !incubatorId || !facilityId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Duplicate Check
    const existingReview = await Review.findOne({ bookingId, startupId });
    if (existingReview) {
      return res
        .status(409)
        .json({
          error: "You have already submitted a review for this booking.",
        });
    }

    const newReview = await Review.create({
      bookingId,
      incubatorId,
      startupId,
      facilityId,
      rating,
      comment,
      status: "approved", // Auto-approve for now, or change to 'pending'
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error in createReview:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- 2. GET: Fetch Reviews by Facility ---
exports.getReviews = async (req, res) => {
  try {
    const { facilityId } = req.query;

    // 1. Validate Input
    if (!facilityId) {
      return res.status(400).json({ error: "Missing facilityId" });
    }

    // 2. Fetch Reviews (Filter by Approved)
    // We treat facilityId as a String in the query to match your Schema definition
    const reviews = await Review.find({
      facilityId: facilityId,
      status: "approved",
    }).sort({ createdAt: -1 });

    // 3. HANDLE NO REVIEWS CASE (Graceful Return)
    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        totalReviews: 0,
        averageRating: 0,
        reviews: [],
      });
    }

    // 4. Calculate Stats
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    // 5. Fetch Startup Names Safely
    // Extract User IDs from reviews
    const userIds = [...new Set(reviews.map((r) => r.startupId))];

    // Find Startups that match these User IDs
    // We use strict equality if possible, but $in handles strings/ObjectIds well usually
    const startups = await Startup.find({
      // Handle cases where startupId in review might be string but userId in Startup is ObjectId
      $or: [
        { userId: { $in: userIds } },
        // If userId in Startup is ObjectId, we might need to cast userIds
        {
          userId: {
            $in: userIds.filter((id) => mongoose.Types.ObjectId.isValid(id)),
          },
        },
      ],
    }).select("userId startupName");

    // Create a Lookup Map
    const startupMap = {};
    startups.forEach((s) => {
      // Convert to string to ensure matching works
      startupMap[s.userId.toString()] = s.startupName;
    });

    // 6. Build Final Response
    const reviewList = reviews.map((r) => ({
      _id: r._id,
      startupName: startupMap[r.startupId.toString()] || "Anonymous Startup", // Fallback if startup deleted
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      totalReviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviews: reviewList,
    });
  } catch (error) {
    console.error("Error in getReviews:", error);
    // Return empty state on error instead of crashing frontend
    res.status(200).json({
      totalReviews: 0,
      averageRating: 0,
      reviews: [],
      error: "Failed to load reviews",
    });
  }
};
