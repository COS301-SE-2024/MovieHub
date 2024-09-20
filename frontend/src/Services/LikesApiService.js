// src/services/LikesApiService.js
import * as SecureStore from 'expo-secure-store';

//const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://192.168.3.218:3000/like/'; // Update to your Expo URL
// const API_URL = 'http://localhost:3000/like/';
import { getLocalIP } from './getLocalIP';

const localIP = getLocalIP();
const API_URL = `http://${localIP}:3000/like/`;

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

export const getUserLikedPosts = async (userId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}${userId}/likes`, {headers: headers});
    if (!response.ok) {
        // console.log(response)
        throw new Error("Failed to fetch user posts");
    } 
    
    const data = await response.json();
    // console.log("data", data);
    return data;
};

export const getLikesOfMovie = async (movieId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}movie/${movieId}`, {headers: headers});
    if (!response.ok) {
        // console.log(response)
        throw new Error("Failed to fetch movie likes");
    } 
    
    const data = await response.json();
    // console.log("data", data);
    return data;
};

export const getLikesOfComment = async (commentId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}comment/${commentId}`, {headers: headers});
    if (!response.ok) {
        // console.log(response)
        throw new Error("Failed to fetch comment likes");
    } 
    
    const data = await response.json();
    // console.log("data", data);
    return data;
};

export const getLikesOfReview = async (reviewId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}review/${reviewId}`, {headers: headers});
    if (!response.ok) {
        // console.log(response)
        throw new Error("Failed to fetch review likes");
    } 
    
    const data = await response.json();
    // console.log("data", data);
    return data;
};

export const getLikesOfPost = async (postId) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}post/${postId}`, {headers: headers});
    if (!response.ok) {
        console.log("response", response)
        throw new Error("Failed to fetch post likes");
    } 
    
    const data = await response.json();
    // console.log("data", data);
    return data;
};

export const toggleLikeReview = async (bodyData) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}toggleLikeReview`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update like review');
    }
    const data = await response.json();
    return data;
};

export const toggleLikeComment = async (bodyData) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}toggleLikeComment`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update like comment');
    }
    const data = await response.json();
    return data;
};

export const toggleLikeMovie = async (bodyData) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}toggleLikeMovie`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update like movie');
    }
    const data = await response.json();
    return data;
};

export const toggleLikePost = async (bodyData) => {
    const headers = await verifyToken();
    const response = await fetch(`${API_URL}toggleLikePost`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update like post');
    }
    const data = await response.json();
    return data;
};