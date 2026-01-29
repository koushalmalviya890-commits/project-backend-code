const Notification = require('../models/Notification');

// GET /api/notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from authMiddleware
    
    // Parse Query Params
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const unreadOnly = req.query.unreadOnly === 'true';
    const type = req.query.type;
    const status = req.query.status;

    // Build Query
    const query = { userId };

    if (unreadOnly) {
      query.isRead = false;
    }

    if (type) {
      query.relatedType = type;
    }

    // Status filtering logic from your original code
    if (status === 'approved') {
       if (type === 'booking') {
         query.type = 'booking-approved';
       } else if (type === 'facility') {
         query.type = 'facility-approved';
       } else {
         query.type = { $regex: '-approved$' };
       }
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// PATCH /api/notifications/mark-all-read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ 
      message: 'All notifications marked as read', 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

// PATCH /api/notifications/:id/read
exports.markOneAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // Verify ownership and update in one go
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId }, // Ensure user owns it
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }

    res.status(200).json({ 
      message: 'Notification marked as read', 
      notification 
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// DELETE /api/notifications/delete-all
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Notification.deleteMany({ userId });

    res.status(200).json({ 
      message: 'All notifications deleted', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ error: 'Failed to delete notifications' });
  }
};

// DELETE /api/notifications/:id
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await Notification.findOneAndDelete({ 
      _id: notificationId, 
      userId: userId 
    });

    if (!result) {
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};