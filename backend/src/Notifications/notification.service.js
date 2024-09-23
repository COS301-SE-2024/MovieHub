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

// Send a notification
exports.sendNotification = async (userId, type, message) => {
    const db = getDatabase();
    const notificationRef = ref(db, `notifications/${userId}/${type}`);

    // Push a new notification
    const newNotificationRef = push(notificationRef);

    const notificationData = {
        id: newNotificationRef.key,  // Use the key of the new notification as its ID
        message: message,
        read: false,  // By default, a new notification is unread
        timestamp: Date.now()  // Add a timestamp to track when the notification was sent
    };

    await set(newNotificationRef, notificationData);
};
