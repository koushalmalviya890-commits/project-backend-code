const express = require('express');
const router = express.Router();
const { 
getServiceProviderProfile, 
  updateServiceProviderProfile, 
  getEarnings,
  getServiceProviderById,
  getAllServiceProvidersWithStats,
  getProviderFacilitiesWithPagination
} = require('../controllers/serviceProviderController');

const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware'); // The middleware using JWT_SECRET

// --- Profile & Earnings ---
router.get('/profile', protect, getServiceProviderProfile);
router.patch('/profile', protect, updateServiceProviderProfile);
router.get('/earnings', protect, getEarnings);

// --- Coupon Management (CRUD) ---
// Matches: /api/service-provider/coupons
router.get('/coupons', protect, getCoupons);
router.post('/coupons', protect, createCoupon);

// Matches: /api/service-provider/coupons/:couponId
router.put('/coupons/:couponId', protect, updateCoupon);
router.delete('/coupons/:couponId', protect, deleteCoupon);

// ==========================================
// 2. PARAMETERIZED ROUTES (Specific Patterns)
// ==========================================

// --- Coupon Validation ---
// Matches: /api/service-provider/[facilityId]/validate-coupon
router.post('/:facilityId/validate-coupon', validateCoupon);

// --- Provider Facilities ---
// Matches: /api/service-provider/[id]/facilities
router.get('/:id/facilities', getProviderFacilitiesWithPagination);

// ==========================================
// 3. GENERIC CATCH-ALL (Must be last)
// ==========================================

// --- Get All Providers (Root) ---
// Note: If mounted at /api/service-provider, this matches the root /
router.get('/', getAllServiceProvidersWithStats);

// --- Get Single Provider by ID ---
// Matches: /api/service-provider/[id]
router.get('/:id', getServiceProviderById);

module.exports = router;