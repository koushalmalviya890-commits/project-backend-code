const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createFacility,
  getPrivateFacilities,
  searchPrivateFacilities,
  updateFacilityStatus,
  getFacilitiesByProvider,
  getPrivateFacilityById,
  updatePrivateFacility, // ✅ Keep this (contains the fix)
  deletePrivateFacility  // ✅ Keep this
} = require('../controllers/privateFacilityController');

// 1. Root Routes
router.post('/', protect, createFacility);
router.get('/', protect, getPrivateFacilities);

// 2. Specific Search & Status Routes (MUST be before /:id)
router.get('/search-private', searchPrivateFacilities);
router.patch('/status/:id', protect, updateFacilityStatus);
router.get('/by-provider/:id', getFacilitiesByProvider);

// 3. Generic ID Routes (Public Read, Private Write)
// Matches GET /api/private-facilities/:id
router.get('/:id', getPrivateFacilityById); 

// Matches PATCH /api/private-facilities/:id
// Uses the robust controller with deep merge logic
router.patch('/:id', protect, updatePrivateFacility);

// Matches DELETE /api/private-facilities/:id
router.delete('/:id', protect, deletePrivateFacility);

module.exports = router;