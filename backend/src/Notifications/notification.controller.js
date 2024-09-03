const notificationService = require('./notification.service');

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
    const { userId, type, notificationId } = req.params;

    try {
        await notificationService.markNotificationAsRead(userId, type, notificationId);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    const { userId, type, notificationId } = req.params;

    try {
        await notificationService.deleteNotification(userId, type, notificationId);
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear all notifications
exports.clearNotifications = async (req, res) => {
    const { userId, type } = req.params;

    try {
        await notificationService.clearNotifications(userId, type);
        res.status(200).json({ message: 'All notifications cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
