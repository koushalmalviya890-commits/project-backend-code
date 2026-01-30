const { getReviewsByFacility } = require("../../services/reviewsService");

async function getReviews(req, res) {
  try {
    const { facilityId } = req.query;

    if (!facilityId) {
      return res.status(400).json({
        error: "facilityId is required",
      });
    }

    const reviews = await getReviewsByFacility(facilityId);

    res.json({ reviews });
  } catch (error) {
    console.error("Reviews API error:", error);
    res.status(500).json({
      error: "Failed to fetch reviews",
    });
  }
}

module.exports = { getReviews };
