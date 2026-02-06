const express = require('express');
const router = express.Router();
const { 
  createFacility, 
  getFacilities, 
  getFacilityById, // New
  deleteFacility, 
  updateFacility,
  updateFacilityStatus,
  getFacilitiesByProvider
} = require('../controllers/facilityController');
const { protect } = require('../middleware/authMiddleware'); // Your auth middleware

// All routes require authentication
// router.use(protect);

// Routes
router.post('/', protect, createFacility);        // Create
router.get('/', getFacilities);   
router.get('/:id', getFacilityById);
router.delete('/:id', protect, deleteFacility);   // Delete
router.patch('/:id', protect, updateFacility);    // Update
router.patch('/:id/status', protect, updateFacilityStatus); // ✅ New Status Route
router.get('/by-provider/:id', getFacilitiesByProvider);


module.exports = router;