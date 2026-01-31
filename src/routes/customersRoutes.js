const express = require('express');
const router = express.Router();
const { 
  getCustomers, 
  addCustomer, 
  removeCustomer, 
  searchStartups 
} = require('../controllers/customersController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// 1. Manage Mapped Customers
router.get('/', getCustomers);      // Fetch list
router.post('/', addCustomer);      // Add to list
router.delete('/', removeCustomer); // Remove from list

// 2. Search Logic (New Endpoint)
// Usage: GET /api/customers/search?emailDomain=example.com
router.get('/search', searchStartups); 

module.exports = router;