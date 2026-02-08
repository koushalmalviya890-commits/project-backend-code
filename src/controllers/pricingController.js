const mongoose = require('mongoose');
const Facility = require('../models/Facility');
const ServiceProvider = require('../models/ServiceProvider');
const Startup = require('../models/Startup');
const FacilityStartups = require('../models/FacilityStartups');
// const { getFixedServiceFee } = require('../../utils/pricing');
const { getDistanceInKm } = require('../../lib/distance'); // Ensure this util exists


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

exports.calculateFinalPrice = async (req, res) => {
  try {
    const { facilityId, rentalPlan, unitCount, bookingSeats, basePrice: inputBasePrice } = req.body;

    // 1. Validation
    if (!facilityId) {
      return res.status(400).json({ error: "Missing facilityId" });
    }

    // 2. Identify User
    const userId = req.user ? req.user.id : null;
    let startup = null;

    if (userId) {
      startup = await Startup.findOne({ userId: userId });
    }

    // 3. Fetch Facility
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    // 4. Determine Base Price
    // If frontend sends basePrice, use it. Otherwise calculate it from plan.
    let basePrice = inputBasePrice;
    
    if (!basePrice && rentalPlan && unitCount) {
       const plan = facility.details?.rentalPlans?.find(
        (p) => p.name.toLowerCase().trim() === rentalPlan.toLowerCase().trim()
      );
      if (plan) {
        basePrice = plan.price * unitCount * (bookingSeats || 1);
      }
    }

    if (!basePrice) {
       // If we still don't have a price, we can't calculate
       return res.status(400).json({ error: "Could not determine base price. Please provide rentalPlan and unitCount." });
    }

    // 5. Fetch Service Provider
    const serviceProvider = await ServiceProvider.findOne({
      userId: facility.serviceProviderId,
    });
    
    if (!serviceProvider) {
      return res.status(404).json({ error: "Service Provider not found" });
    }

    // 6. Setup Variables
    const hasGST = !!serviceProvider.gstNumber; // Check existing boolean logic
    let fixedFee = 0;
    let gst = 0;
    let finalPrice = 0;
    let finalPricebeforeGST = 0;
    let distanceInKm = 0;
    let isExistingUser = false;

    // =========================================================
    // LOGIC BRANCH: Guest OR Startup Not Found
    // =========================================================
    if (!startup) {
      isExistingUser = false; // Forced false for guests
      
      const rate = 0.07;
      fixedFee = basePrice * rate;

      if (hasGST) {
        gst = basePrice * 0.18; // GST only on base price
        finalPrice = basePrice + gst + fixedFee;
        finalPricebeforeGST = basePrice + fixedFee;
      } else {
        gst = 0;
        finalPrice = basePrice + fixedFee;
        finalPricebeforeGST = basePrice + fixedFee;
      }
    } 
    // =========================================================
    // LOGIC BRANCH: Logged-in Startup
    // =========================================================
    else {
      // Check FacilityStartups relation
      const data = await FacilityStartups.findOne({
        incubatorId: serviceProvider.userId,
        startupId: startup.userId
      });
      isExistingUser = !!data;

      if (isExistingUser) {
        // --- EXISTING USER LOGIC ---
        fixedFee = getFixedServiceFee(facility.facilityType);
        // Note: Your original code did NOT multiply fixedFee by unitCount here, 
        // but if you need to, uncomment: fixedFee = fixedFee * unitCount;

        if (hasGST) {
          gst = basePrice * 0.18;
          finalPrice = basePrice + gst + fixedFee;
          finalPricebeforeGST = basePrice + fixedFee;
        } else {
          finalPrice = basePrice + fixedFee;
          finalPricebeforeGST = basePrice + fixedFee;
        }
      } 
      else {
        // --- NEW USER LOGIC (Distance) ---
        // Optional: Calculate distance if needed for logs, though rate is currently hardcoded 0.07
        const startupPincode = startup.pincode;
        const facilityPincode = facility.pincode;
        
        // Uncomment if you want to calc actual distance
        // try {
        //   distanceInKm = await getDistanceInKm(`${startupPincode}`, `${facilityPincode}`);
        // } catch (e) {}

        const rate = 0.07;
        fixedFee = basePrice * rate;

        if (hasGST) {
          gst = basePrice * 0.18;
          finalPrice = basePrice + gst + fixedFee;
          finalPricebeforeGST = basePrice + fixedFee;
        } else {
          gst = 0;
          finalPrice = basePrice + fixedFee;
          finalPricebeforeGST = basePrice + fixedFee;
        }
      }
    }

    // 7. Return Response
    // Matches the structure expected by your FacilityCard
    res.json({
      success: true,
      data: {
        basePrice,
        fixedFee,
        hasGST,
        isExistingUser,
        gst: hasGST ? Math.round(gst) : 0,
        finalPrice: Math.round(finalPrice),
        finalPricebeforeGST: Math.round(finalPricebeforeGST),
        distanceInKm: Math.round(distanceInKm),
        bookingSeats: bookingSeats || 1
      }
    });

  } catch (error) {
    console.error("Pricing Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};