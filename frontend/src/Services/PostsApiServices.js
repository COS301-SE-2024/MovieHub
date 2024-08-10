import * as SecureStore from 'expo-secure-store';

import {uploadImage} from './imageHandeling.services';
const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://192.168.39.101:3000/post/'; // Update to your Expo URL



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

const fetchWithAuth = async (url, options = {}) => {
    const headers = await verifyToken();
    options.headers = { ...options.headers, ...headers };
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Request failed');
    }
    return response.json();
};

export const addPost = async (bodyData) => {
    // bodyData should contain: { uid, text, postTitle, img }
    try {
        const response = await fetchWithAuth(`${API_URL}add/post`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add post: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const addReview = async (bodyData) => {
    // bodyData should contain: { uid, movieId, text, rating, reviewTitle, movieTitle }
    try {
        const response = await fetchWithAuth(`${API_URL}add/review`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add review: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const addCommentToPost = async (bodyData) => {
    // bodyData should contain: { uid, text, postId }
    try {
        const response = await fetchWithAuth(`${API_URL}comment/post`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add comment to post: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const addCommentToReview = async (bodyData) => {
    // bodyData should contain: { uid, reviewId, text }
    try {
        const response = await fetchWithAuth(`${API_URL}comment/review`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add comment to review: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const addCommentToComment = async (bodyData) => {
    // bodyData should contain: { uid, comOnId, text }
    try {
        const response = await fetchWithAuth(`${API_URL}comment/comment`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add comment to comment: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const editPost = async (bodyData) => {
    // bodyData should contain: { postId, uid, text }
    try {
        const response = await fetchWithAuth(`${API_URL}edit/post`, {
            method: 'PUT',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to edit post: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const editReview = async (bodyData) => {
    // bodyData should contain: { reviewId, uid, text, reviewTitle ,rating }
    try {
        const response = await fetchWithAuth(`${API_URL}edit/review`, {
            method: 'PUT',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to edit review: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const editComment = async (bodyData) => {
    // bodyData should contain: { commentId, uid, text }
    try {
        const response = await fetchWithAuth(`${API_URL}edit/comment`, {
            method: 'PUT',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to edit comment: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const removePost = async (bodyData) => {
    // bodyData should contain: { postId, uid }
    try {
        await fetchWithAuth(`${API_URL}remove/post`, {
            method: 'DELETE',
            body: JSON.stringify(bodyData),
        });
        return true;
    } catch (error) {
        throw new Error('Failed to remove post: ' + error.message);
    }
    return true;
};

export const removeReview = async (bodyData) => {
    // bodyData should contain: { reviewId, uid }
    try {
        await fetchWithAuth(`${API_URL}remove/review`, {
            method: 'DELETE',
            body: JSON.stringify(bodyData),
        });
        return true;
    } catch (error) {
        throw new Error('Failed to remove review: ' + error.message);
    }
    return true;
};

export const removeComment = async (bodyData) => {
    // bodyData should contain: { commentId, uid }
    try {
        await fetchWithAuth(`${API_URL}remove/comment`, {
            method: 'DELETE',
            body: JSON.stringify(bodyData),
        });
        return true;
    } catch (error) {
        throw new Error('Failed to remove comment: ' + error.message);
    }
    return true;
};

export const getPostsOfMovie = async (movieId) => {
    // movieId should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}movie/${movieId}/posts`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch posts of movie: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const getReviewsOfMovie = async (movieId) => {
    // movieId should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}movie/${movieId}/reviews`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch reviews of movie: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const getCommentsOfPost = async (postId) => {
    // postId should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}post/${postId}/comments`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comments of post: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const getCommentsOfReview = async (reviewId) => {
    // reviewId should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}review/${reviewId}/comments`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comments of review: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const getCommentsOfComment = async (commentId) => {
    // commentId should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}comment/${commentId}/comments`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comments of comment: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const getPostsOfUser = async (uid) => {
    // uid should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}user/${uid}/posts`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch posts of user: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const getReviewsOfUser = async (uid) => {
    // uid should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}user/${uid}/reviews`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch reviews of user: ' + error.message);
    }
    const data = await response.json();
    return data;
};

export const getCommentsOfUser = async (uid) => {
    // uid should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}user/${uid}/comments`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comments of user: ' + error.message);
    }
};

export const getAverageRating = async (movieId) => {
    // movieId should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}movie/${movieId}/rating`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch average rating: ' + error.message);
    }
};

export const getCountCommentsOfPost = async (postId) => {
    // postId should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}post/${postId}/comment/count`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comment count on post: ' + error.message);
    }
};

export const getCountCommentsOfReview = async (reviewId) => {
    // reviewId should be a string
    try {
        const response = await fetchWithAuth(`${API_URL}review/${reviewId}/comment/count`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comment count on review: ' + error.message);
    }
};
