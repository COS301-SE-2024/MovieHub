import * as SecureStore from 'expo-secure-store';
//const API_URL = 'http://localhost:3000/notification';
import { getLocalIP } from './getLocalIP';

const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000/notification`;

// Helper function to get the token from SecureStore
const getToken = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
        throw new Error('No token found');
    }
    return token;
};

// Middleware function for verifying Firebase token
const verifyToken = async () => {
    const authHeader = 'Bearer ' + await getToken();
    return {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
    };
};

// Mark a notification as read
export const markNotificationAsRead = async (userId, type, notificationId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/${type}/${notificationId}/read`, {
        method: 'PATCH',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to mark notification as read');
    }
};

// Delete a notification
export const deleteNotification = async (userId, type, notificationId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/${type}/${notificationId}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to delete notification');
    }
};

// Clear all notifications for a user
export const clearNotifications = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}/${userId}/${type}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to clear notifications');
    }
};
