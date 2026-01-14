// utils/calculateEventPriceDetail.js
const EventDetail = require('../src/models/EventDetails'); // Adjust path to your model

/**
 * Calculate event pricing details with optional coupon support
 * @param {Object} params - Parameters object
 * @param {string} params.eventId - Event ID
 * @param {number} params.ticketCount - Number of tickets
 * @param {string} [params.couponCode] - Optional coupon code
 * @returns {Promise<Object>} Pricing calculation result
 */
const calculateEventPriceDetail = async ({ eventId, ticketCount, couponCode }) => {
  try {
    // Input validation
    if (!eventId || !ticketCount || ticketCount <= 0) {
      throw new Error("Valid event ID and ticket count are required");
    }

    // Fetch event details
    const event = await EventDetail.findById(eventId);
    if (!event) { 
      throw new Error("Event not found");
    }

    const { ticketPrice, couponAvailability, couponDetails = [] } = event;
    
    // Calculate base pricing (original pricing without any discounts)
    const basePrice = parseFloat((ticketPrice * ticketCount).toFixed(2));
    const originalPlatformFee = parseFloat((basePrice * 0.02).toFixed(2)); // 2% of base price
    const originalGst = parseFloat(((basePrice + originalPlatformFee) * 0.18).toFixed(2)); // 18% of (base + platform fee)
    const originalGrandTotal = parseFloat((basePrice + originalPlatformFee + originalGst).toFixed(2));

    // Base response structure
    const responseData = {
      ticketPrice: parseFloat(ticketPrice.toFixed(2)),
      ticketCount: parseInt(ticketCount),
      basePrice: basePrice,
      platformFee: originalPlatformFee,
      gst: originalGst,
      grandTotal: Math.round(originalGrandTotal)
    };

    let message = "Pricing details fetched successfully";

    // Handle coupon validation and application if provided
    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      // Check if coupons are available for this event
      if (!couponAvailability || couponDetails.length === 0) {
        return {
          message: "No coupons available for this event",
          data: responseData
        };
      }

      // Find matching coupon (case-insensitive)
      const matchingCoupon = couponDetails.find(coupon => 
        coupon.couponCode && 
        coupon.couponCode.toLowerCase().trim() === couponCode.toLowerCase().trim()
      );

      if (!matchingCoupon) {
        return {
          message: "Invalid coupon code",
          data: responseData
        };
      }

      // Validate coupon dates
      const currentDate = new Date();
      
      if (matchingCoupon.validFrom) {
        const validFromDate = new Date(matchingCoupon.validFrom);
        if (currentDate < validFromDate) {
          return {
            message: `Coupon is not yet valid. Valid from ${validFromDate.toLocaleDateString()}`,
            data: responseData
          };
        }
      }

      if (matchingCoupon.validTo) {
        const validToDate = new Date(matchingCoupon.validTo);
        if (currentDate > validToDate) {
          return {
            message: `Coupon has expired on ${validToDate.toLocaleDateString()}`,
            data: responseData
          };
        }
      }

      // Validate minimum value if exists (optional field)
      if (matchingCoupon.minimumValue && basePrice < matchingCoupon.minimumValue) {
        return {
          message: `Minimum order value of ₹${matchingCoupon.minimumValue} required for this coupon`,
          data: responseData
        };
      }

      // Apply discount - Calculate discount amount
      const discountPercent = parseFloat(matchingCoupon.discount) || 0;
      const discountAmount = parseFloat((basePrice * (discountPercent / 100)).toFixed(2));
      const discountedBasePrice = parseFloat((basePrice - discountAmount).toFixed(2));

      // Recalculate platform fee and GST on discounted base price
      const discountedPlatformFee = parseFloat((discountedBasePrice * 0.02).toFixed(2));
      const discountedGst = parseFloat(((discountedBasePrice + discountedPlatformFee) * 0.18).toFixed(2));
      const discountedGrandTotal = parseFloat((discountedBasePrice + discountedPlatformFee + discountedGst).toFixed(2));

      // Update response data with discounted values
      responseData.platformFee = discountedPlatformFee;
      responseData.gst = discountedGst;
      responseData.grandTotal = Math.round(discountedGrandTotal);

      // Add coupon information to response
      responseData.coupon = {
        discount: discountPercent,
        discountAmount: discountAmount,
        discountedBase: discountedBasePrice,
        discountedGrandTotal: Math.round(discountedGrandTotal)
      };

      message = "Coupon applied successfully";
    }

    return {
      message,
      data: responseData
    };

  } catch (error) {
    console.error("Error in calculateEventPriceDetail:", error);
    throw new Error(error.message || "Failed to calculate pricing details");
  }
};

module.exports = calculateEventPriceDetail;
