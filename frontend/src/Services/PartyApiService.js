import * as SecureStore from 'expo-secure-store';

import { getLocalIP } from './getLocalIP';

const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000/party`;

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

// Function to create a watch party
export const createWatchParty = async (userId, roomId, partyData) => {
    try {
        const headers = await verifyToken();
        const response = await fetch(`${API_URL}/create/${userId}/${roomId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(partyData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create watch party');
        }

        const watchParty = await response.json();
        console.log("Watch Party content", watchParty)
        return watchParty;
    } catch (error) {
        console.error('Error creating watch party:', error);
        throw error;
    }
};

// Function to schedule a watch party
export const scheduleWatchParty = async (userId, partyData) => {
    try {
        const headers = await verifyToken();
        const response = await fetch(`${API_URL}/schedule/${userId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(partyData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to schedule watch party');
        }

        const watchParty = await response.json();
        return watchParty;
    } catch (error) {
        console.error('Error scheduling watch party:', error);
        throw error;
    }
};

// Function to end a Hyperbeam session
export const endHyperbeamSession = async (sessionId) => {
    try {
        const headers = await verifyToken();
        const response = await fetch(`${API_URL}/end-session/${sessionId}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to end Hyperbeam session');
        }

        const result = await response.json();
        return result.message;
    } catch (error) {
        console.error('Error ending Hyperbeam session:', error);
        throw error;
    }
};