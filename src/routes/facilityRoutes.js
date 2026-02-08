const express = require('express');
const router = express.Router();
const { 
  createFacility, 
  getFacilities, 
  getFacilityById, // New
  deleteFacility, 
  updateFacility,
  updateFacilityStatus,
  getFacilitiesByProvider,
  searchFacilities,
  searchFacilitiesScoped,
  createProviderFacility,
  getProviderFacilities,
  deleteProviderFacility,
  patchProviderFacility,
  searchProviderFacilities
} = require('../controllers/facilityController');
const { protect } = require('../middleware/authMiddleware'); // Your auth middleware

// All routes require authentication
// router.use(protect);

// Routes
// Matches: /api/facilities/search
router.get('/search', searchFacilities);
// Matches: /api/facilities/search-private (Scoped search)
router.get('/search-private', searchFacilitiesScoped);


router.get('/private-search', searchProviderFacilities);

router.post('/', protect, createFacility);        // Create
router.get('/', getFacilities);  
router.get('/protected', protect, getFacilities);   
router.get('/:id', getFacilityById);
router.get('/protected/:id', protect, getFacilityById);
router.delete('/:id', protect, deleteFacility);   // Delete
router.patch('/:id', protect, updateFacility);    // Update
router.patch('/:id/status', protect, updateFacilityStatus); // ✅ New Status Route
router.get('/by-provider/:id', getFacilitiesByProvider);
router.get('/by-provider/protected/:id', protect, getFacilitiesByProvider);
// --- Public Search Routes ---




// --- Protected Provider Routes ---
// Note: I've grouped these under neat REST paths, but you can keep them generic if you prefer.

// 1. Create (POST /api/facilities)
router.post('/private-route', protect, createProviderFacility);

// 2. List Own (GET /api/facilities/my-facilities) - distinct path to avoid collision with GET /:id
router.get('/private-route/my-facilities', protect, getProviderFacilities);

// 3. Delete (DELETE /api/facilities/:id)
router.delete('/private-route/:id', protect, deleteProviderFacility);

// 4. Patch (PATCH /api/facilities/:id) - Specific patch logic from your Next.js private route
router.patch('/private-route/:id', protect, patchProviderFacility);



module.exports = router;