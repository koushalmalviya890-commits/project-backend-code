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
    // 1. Extract Inputs (Ignore 'basePrice' from frontend for security)
    const { facilityId, rentalPlan, unitCount, bookingSeats } = req.body;

    if (!facilityId || !rentalPlan || !unitCount) {
      return res.status(400).json({ error: "Missing required fields" });
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

    // 4. Find the Specific Rental Plan (Robust Search)
    // We search the array for the plan matching the name sent from frontend
    const selectedPlan = facility.details?.rentalPlans?.find(
      (p) => p.name.toLowerCase().trim() === rentalPlan.toLowerCase().trim()
    );

    if (!selectedPlan) {
      return res.status(404).json({ error: `Rental plan '${rentalPlan}' not found in this facility` });
    }

    // 5. Calculate Base Price (Server Side Source of Truth)
    // Formula: Price Per Unit * Number of Units * Number of Seats
    const seats = parseInt(bookingSeats) || 1;
    const units = parseInt(unitCount) || 1;
    const planPrice = parseFloat(selectedPlan.price) || 0;
    
    const basePrice = planPrice * units * seats;
    // console.log(basePrice ,"Base price with only plans")

    // 6. Fetch Service Provider
    const serviceProvider = await ServiceProvider.findOne({
      userId: facility.serviceProviderId,
    });
    
    if (!serviceProvider) {
      return res.status(404).json({ error: "Service Provider not found" });
    }

    // 7. Calculate Fees & Taxes
    const hasGST = !!serviceProvider.gstNumber;
    let fixedFee = 0;
    let gst = 0;
    let finalPrice = 0;
    let finalPricebeforeGST = 0;
    let isExistingUser = false;

    // Check if user is "Existing" (Already linked to this incubator)
    if (startup) {
      const relation = await FacilityStartups.findOne({
        incubatorId: new mongoose.Types.ObjectId(serviceProvider.userId),
        startupId: startup.userId
      });
      isExistingUser = !!relation;
    }

    // --- FEE LOGIC ---
    if (isExistingUser) {
      // Existing User: Flat Fee
      // Note: Ensure getFixedServiceFee is imported
      fixedFee = getFixedServiceFee(facility.facilityType || "") * units * seats; 
      // console.log(fixedFee, "fixedfee:::::")
    } else {
      // New User / Guest: 7% Commission
      fixedFee = (basePrice * 0.07);
      // console.log(fixedFee, "fixedfee:::::")
    }

    // --- TOTAL LOGIC ---
    // GST is calculated on the Base Price (Rent) 
    // (Check if your business logic requires GST on the Service Fee too)
    if (hasGST) {
      gst = (basePrice + fixedFee) * 0.18;
    }
// console.log("gst", gst)
    finalPricebeforeGST = basePrice + fixedFee;
    // console.log(finalPricebeforeGST)
    finalPrice = finalPricebeforeGST + gst;
// console.log(finalPrice)
    // 8. Return Response
    res.json({
      success: true,
      data: {
        basePrice: basePrice, // Raw Rent
        fixedFee: fixedFee,   // Service Fee
        gstAmount: gst,       // Tax
        finalPrice: finalPrice, // Total to Pay
        finalPricebeforeGST: finalPricebeforeGST,
        hasGST,
        isExistingUser,
        bookingSeats: seats
      }
    });

  } catch (error) {
    console.error("Pricing Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};