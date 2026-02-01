const express = require('express');
const router = express.Router();
const { 
  createFacility, 
  getFacilities, 
  getFacilityById, // New
  deleteFacility, 
  updateFacility,
  updateFacilityStatus
} = require('../controllers/facilityController');
const { protect } = require('../middleware/authMiddleware'); // Your auth middleware

// All routes require authentication
router.use(protect);

// Routes
router.post('/', createFacility);        // Create
router.get('/', getFacilities);   
router.get('/:id', getFacilityById);
router.delete('/:id', deleteFacility);   // Delete
router.patch('/:id', updateFacility);    // Update
router.patch('/:id/status', updateFacilityStatus); // ✅ New Status Route

module.exports = router;