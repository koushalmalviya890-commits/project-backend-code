const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardData, getFailedPayments } = require('../controllers/dashboardController');

// GET /api/dashboard
router.get('/', protect, getDashboardData);
router.get('/failed-payments', protect, getFailedPayments)

module.exports = router;