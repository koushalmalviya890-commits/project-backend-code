const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Your JWT middleware
const {
  getUserNotifications,
  markAllAsRead,
  markOneAsRead,
  deleteAllNotifications,
  deleteNotification
} = require('../controllers/notificationController');

// All routes are protected
router.use(protect);

// GET /api/notifications
router.get('/', getUserNotifications);

// PATCH /api/notifications/mark-all-read (Bulk action)
router.patch('/mark-all-read', markAllAsRead);

// PATCH /api/notifications/:id (Single action)
router.patch('/:id', markOneAsRead);

// DELETE /api/notifications/delete-all (Bulk action)
router.delete('/delete-all', deleteAllNotifications);

// DELETE /api/notifications/:id (Single action)
router.delete('/:id', deleteNotification);

module.exports = router;