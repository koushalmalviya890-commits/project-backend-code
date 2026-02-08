const mongoose = require('mongoose');
const Review = require('../models/Review'); // Ensure your model is imported correctly
const Startup = require('../models/Startup');

// --- 1. POST: Submit Review ---
exports.createReview = async (req, res) => {
  try {
    // 1. Auth Check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      bookingId,
      incubatorId,
      facilityId,
      rating,
      comment,
    } = req.body;

    const startupId = req.user.id;

    // 2. Validation
    if (!bookingId || !incubatorId || !facilityId || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 3. Duplicate Check
    const existingReview = await Review.findOne({
      bookingId,
      startupId,
    });

    if (existingReview) {
      return res.status(409).json({ error: 'You have already submitted a review for this booking.' });
    }

    // 4. Create Review
    const newReview = await Review.create({
      bookingId,
      incubatorId,
      startupId,
      facilityId,
      rating,
      comment,
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review: newReview,
    });

  } catch (error) {
    console.error('Error in createReview:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Unknown error',
    });
  }
};

// --- 2. GET: Fetch Reviews by Facility ---
exports.getReviews = async (req, res) => {
  try {
    // Note: Your Next.js code had an auth check here.
    // If you want reviews to be public, remove the 'protect' middleware in the route.
    // Assuming you want consistency with Next.js code:
    // if (!req.user || !req.user.id) {
    //    return res.status(401).json({ error: 'Unauthorized' });
    // }

    const { facilityId } = req.query;

    if (!facilityId) {
      return res.status(400).json({ error: 'Missing facilityId' });
    }

    // 1. Get Approved Reviews
    const reviews = await Review.find({
      facilityId,
      status: 'approved',
    }).sort({ createdAt: -1 });

    // 2. Calculate Average Rating
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // 3. Populate Startup Names manually
    // (This matches your Next.js logic of fetching names separately)
    const startupIds = reviews.map((r) => r.startupId);
    const startups = await Startup.find({ userId: { $in: startupIds } });
    
    const startupMap = new Map(
      startups.map((s) => [s.userId.toString(), s.startupName])
    );

    // 4. Build Response List
    const reviewList = reviews.map((r) => ({
      startupName: startupMap.get(r.startupId.toString()) || 'Unknown Startup',
      rating: r.rating,
      comment: r.comment,
    }));

    res.status(200).json({
      totalReviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviews: reviewList,
    });

  } catch (error) {
    console.error('Error in getReviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};