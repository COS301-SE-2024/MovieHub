import * as SecureStore from 'expo-secure-store';
// const API_URL = 'http://localhost:3000/explore';
import { getLocalIP } from './getLocalIP';

const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000/explore`;

// Set up a key to store the token
const TOKEN_KEY = 'userToken';

// Helper function to get the token from SecureStore
const getToken = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
        throw new Error('No token found');
    }
    return token;
};

// Middleware function for creating headers with token and user ID
const createHeadersWithUserId = async (userInfo) => {
    if (!userInfo || !userInfo.userId) {
        throw new Error('User ID not provided in userInfo');
    }

    const token = await getToken();
    const userId = userInfo.userId;

    return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'x-user-id': userId, // Add the user ID to the headers
    };
};

// Function to fetch friends' content
export const getFriendsContent = async (userInfo) => {
    const headers = await createHeadersWithUserId(userInfo);

    const response = await fetch(`${API_URL}/friends-content`, { headers });

    if (!response.ok) {
        throw new Error("Failed to fetch friends' content");
    }

    const data = await response.json();
    return data;
};

// Function to fetch friends of friends' content
export const getFriendsOfFriendsContent = async (userInfo) => {
    const headers = await createHeadersWithUserId(userInfo);
    // console.log("About to get content...");
    const response = await fetch(`${API_URL}/friends-of-friends-content`, { headers });
    // console.log("+++++++++");

    if (!response.ok) {
        throw new Error("Failed to fetch friends of friends' content");
    } 

    const data = await response.json();
    return data;
};

// Function to fetch random users' content
export const getRandomUsersContent = async (userInfo) => {
    const headers = await createHeadersWithUserId(userInfo);
    const response = await fetch(`${API_URL}/random-users-content`, { headers });

    if (!response.ok) {
        throw new Error("Failed to fetch random users' content");
    }

    const data = await response.json();
    return data;
};

// Function to find other users
export const findUsers = async (userInfo) => {
    const headers = await createHeadersWithUserId(userInfo);
    const response = await fetch(`${API_URL}/find-users`, { headers });

    if (!response.ok) {
        throw new Error("Failed to find users");
    }

    const data = await response.json();
    return data;
};

// Function to fetch the latest posts
export const getLatestPosts = async () => {
//    const headers = await createHeadersWithUserId(userInfo);
    const response = await fetch(`${API_URL}/latest-posts`);

    if (!response.ok) {
        throw new Error("Failed to fetch the latest posts");
    }

    const data = await response.json();
    return data;
};

// Function to fetch top reviews
export const getTopReviews = async () => {
   // const headers = await createHeadersWithUserId(userInfo);
    const response = await fetch(`${API_URL}/top-reviews`);

    if (!response.ok) {
        throw new Error("Failed to fetch top reviews");
    }

    const data = await response.json();
    return data;
};