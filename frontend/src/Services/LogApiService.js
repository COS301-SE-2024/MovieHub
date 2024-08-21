// src/services/LogApiService.js

import * as SecureStore from 'expo-secure-store';
//const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://192.168.39.101:3000/log/'; // Update to your Expo URL
const API_URL = 'http://localhost:3000/log/';

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

export const addLog = async (bodyData) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}add`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add log');
    }
    const data = await response.json();
    return data;
};

export const editLog = async (bodyData) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}edit`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to edit log');
    }
    const data = await response.json();
    return data;
};

export const removeLog = async (bodyData) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}remove`, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to remove log');
    }
    const data = await response.json();
    return data;
};

export const getLogsOfUser = async (uid) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}user/${uid}`, { headers: headers });
    if (!response.ok) {
        throw new Error('Failed to fetch user logs');
    }
    const data = await response.json();
    return data;
};
