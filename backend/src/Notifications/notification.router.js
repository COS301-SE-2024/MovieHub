const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');

// Mark a notification as read
router.patch('/:userId/:type/:notificationId/read', notificationController.markNotificationAsRead);

// Delete a specific notification
router.delete('/:userId/:type/:notificationId', notificationController.deleteNotification);

// Clear all notifications of a certain type
router.delete('/:userId/:type', notificationController.clearNotifications);

module.exports = router;
