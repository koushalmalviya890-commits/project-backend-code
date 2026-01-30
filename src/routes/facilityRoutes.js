const express = require('express');
const router = express.Router();
const { 
  createFacility, 
  getFacilities, 
  deleteFacility, 
  updateFacility 
} = require('../controllers/facilityController');
const { protect } = require('../middleware/authMiddleware'); // Your auth middleware

// All routes require authentication
router.use(protect);

// Routes
router.post('/', createFacility);        // Create
router.get('/', getFacilities);          // Read All
router.delete('/:id', deleteFacility);   // Delete
router.patch('/:id', updateFacility);    // Update

module.exports = router;