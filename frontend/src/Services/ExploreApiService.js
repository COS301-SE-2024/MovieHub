import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode'; // Use this library to decode JWT tokens

const API_URL = process.env.REACT_APP_EXPLORE_API_URL || 'http://192.168.39.101:3000/explore'; // Update this URL as necessary

// Helper function to get the token from SecureStore
const getToken = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
        throw new Error('No token found');
    }
    return token;
};

// Helper function to decode token and get user ID
const getUserIdFromToken = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken.uid; // Assuming the token contains 'uid' as the user ID
};

// Middleware function for verifying Firebase token and including user ID
const createHeadersWithUserId = async () => {
    const token = await getToken();
    const userId = getUserIdFromToken(token);
    return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'x-user-id': userId // Add the user ID to the headers
    };
};

// Function to fetch friends' content
export const getFriendsContent = async () => {
    const headers = await createHeadersWithUserId();
    const response = await fetch(`${API_URL}/friends-content`, { headers });

    if (!response.ok) {
        throw new Error("Failed to fetch friends' content");
    }

    const data = await response.json();
    return data;
};

// Function to fetch friends of friends' content
export const getFriendsOfFriendsContent = async () => {
    const headers = await createHeadersWithUserId();
    const response = await fetch(`${API_URL}/friends-of-friends-content`, { headers });

    if (!response.ok) {
        throw new Error("Failed to fetch friends of friends' content");
    }

    const data = await response.json();
    return data;
};

// Function to fetch random users' content
export const getRandomUsersContent = async () => {
    const headers = await createHeadersWithUserId();
    const response = await fetch(`${API_URL}/random-users-content`, { headers });

    if (!response.ok) {
        throw new Error("Failed to fetch random users' content");
    }

    const data = await response.json();
    return data;
};

// Function to find other users
export const findUsers = async () => {
    const headers = await createHeadersWithUserId();
    const response = await fetch(`${API_URL}/find-users`, { headers });

    if (!response.ok) {
        throw new Error("Failed to find users");
    }

    const data = await response.json();
    return data;
};
