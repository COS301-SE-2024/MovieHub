const { getDatabase, ref, set, update, remove, child } = require('firebase/database');

// Mark notification as read
exports.markNotificationAsRead = async (userId, type, notificationId) => {
    const db = getDatabase();
    const notificationRef = ref(db, `notifications/${userId}/${type}/${notificationId}`);
    await update(notificationRef, { read: true });
};

// Delete a notification
exports.deleteNotification = async (userId, type, notificationId) => {
    const db = getDatabase();
    const notificationRef = ref(db, `notifications/${userId}/${type}/${notificationId}`);
    await remove(notificationRef);
};

// Clear all notifications for a given type
exports.clearNotifications = async (userId, type) => {
    const db = getDatabase();
    const notificationsRef = ref(db, `notifications/${userId}/${type}`);
    await remove(notificationsRef); // Remove all notifications under the specific type
};
