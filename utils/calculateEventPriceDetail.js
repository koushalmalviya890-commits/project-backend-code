// utils/calculateEventPriceDetail.js
const EventDetail = require('../src/models/EventDetails'); // Adjust path to your model

/**
 * Calculate event total with optional coupon support (no GST, no platform fee)
 * @param {Object} params
 * @param {string} params.eventId - Event ID
 * @param {number} params.ticketCount - Number of tickets
 * @param {string} [params.couponCode] - Optional coupon code
 * @returns {Promise<Object>} Pricing calculation result
 */
const calculateEventPriceDetail = async ({ eventId, ticketCount, couponCode }) => {
  try {
    if (!eventId || !ticketCount || ticketCount <= 0) {
      throw new Error("Valid event ID and ticket count are required");
    }

    const event = await EventDetail.findById(eventId);
    if (!event) throw new Error("Event not found");

    const {
      ticketPrice,
      couponAvailability,
      couponDetails = [],
      applyGst,  // ✅ Add this from event
      applyPlatformFee

    } = event;

    const perTicket = Number(ticketPrice) || 0;
    const count = Number(ticketCount) || 0;
    const baseTotal = parseFloat((perTicket * count).toFixed(2));

    const responseData = {
      ticketPrice: parseFloat(perTicket.toFixed(2)),
      ticketCount: count,
      grandTotal: Math.round(baseTotal)  // default — without GST or coupon
    };

    let message = "Pricing details fetched successfully";

    // ✅ Coupon Logic (unchanged from your existing code)
    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      if (!couponAvailability || couponDetails.length === 0) {
        return { message: "No coupons available for this event", data: responseData };
      }

      const matchingCoupon = couponDetails.find(
        coupon => coupon.couponCode?.toLowerCase().trim() === couponCode.toLowerCase().trim()
      );

      if (!matchingCoupon) {
        return { message: "Invalid coupon code", data: responseData };
      }

      const currentDate = new Date();

      if (matchingCoupon.validFrom && currentDate < new Date(matchingCoupon.validFrom)) {
        return { message: `Coupon is not yet valid`, data: responseData };
      }

      if (matchingCoupon.validTo && currentDate > new Date(matchingCoupon.validTo)) {
        return { message: `Coupon has expired`, data: responseData };
      }

      if (matchingCoupon.minimumValue && baseTotal < matchingCoupon.minimumValue) {
        return { message: `Minimum ₹${matchingCoupon.minimumValue} required`, data: responseData };
      }

      const discountPercent = parseFloat(matchingCoupon.discount) || 0;
      const discountAmount = parseFloat((baseTotal * (discountPercent / 100)).toFixed(2));
      const discountedTotal = parseFloat((baseTotal - discountAmount).toFixed(2));

      responseData.grandTotal = Math.round(discountedTotal);
      responseData.coupon = {
        discount: discountPercent,
        discountAmount,
        discountedTotal: Math.round(discountedTotal)
      };

      message = "Coupon applied successfully";
    }

     if (applyPlatformFee === "yes") {
      const currentTotal = responseData.grandTotal;
      const platformFeeAmount = parseFloat((currentTotal * 0.02).toFixed(2));
      const totalWithPlatformFee = Math.round(currentTotal + platformFeeAmount);
      
      responseData.platformFee = platformFeeAmount;
      responseData.grandTotal = totalWithPlatformFee;
      message = message + " (Platform Fee Applied)";
    }
    
    // ✅ Apply GST ONLY if event.applyGst === "yes"
    if (applyGst === "yes") {
      const currentTotal = responseData.grandTotal;
      const gstAmount = parseFloat((currentTotal * 0.18).toFixed(2));
      const totalWithGst = Math.round(currentTotal + gstAmount);

   
      responseData.gst = gstAmount;
      responseData.grandTotal = totalWithGst;
      message = message + " (GST Applied)";
    }
    // ✅ Apply Platform Fee ONLY if event.applyPlatformFee === "yes" 2%
   


    return { message, data: responseData };

  } catch (error) {
    console.error("Error in calculateEventPriceDetail:", error);
    throw new Error(error.message || "Failed to calculate pricing details");
  }
};

module.exports = calculateEventPriceDetail;



