import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://10.0.0.107:3000/post/';

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
    try {
        const response = await fetchWithAuth(`${API_URL}add/post`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add post: ' + error.message);
    }
};

export const addReview = async (bodyData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}add/review`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add review: ' + error.message);
    }
};

export const addCommentToPost = async (bodyData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}comment/post`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add comment to post: ' + error.message);
    }
};

export const addCommentToReview = async (bodyData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}comment/review`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add comment to review: ' + error.message);
    }
};

export const addCommentToComment = async (bodyData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}comment/comment`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to add comment to comment: ' + error.message);
    }
};

export const editPost = async (bodyData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}edit/post`, {
            method: 'PUT',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to edit post: ' + error.message);
    }
};

export const editReview = async (bodyData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}edit/review`, {
            method: 'PUT',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to edit review: ' + error.message);
    }
};

export const editComment = async (bodyData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}edit/comment`, {
            method: 'PUT',
            body: JSON.stringify(bodyData),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to edit comment: ' + error.message);
    }
};

export const removePost = async (bodyData) => {
    try {
        await fetchWithAuth(`${API_URL}remove/post`, {
            method: 'DELETE',
            body: JSON.stringify(bodyData),
        });
        return true;
    } catch (error) {
        throw new Error('Failed to remove post: ' + error.message);
    }
};

export const removeReview = async (bodyData) => {
    try {
        await fetchWithAuth(`${API_URL}remove/review`, {
            method: 'DELETE',
            body: JSON.stringify(bodyData),
        });
        return true;
    } catch (error) {
        throw new Error('Failed to remove review: ' + error.message);
    }
};

export const removeComment = async (bodyData) => {
    try {
        await fetchWithAuth(`${API_URL}remove/comment`, {
            method: 'DELETE',
            body: JSON.stringify(bodyData),
        });
        return true;
    } catch (error) {
        throw new Error('Failed to remove comment: ' + error.message);
    }
};

export const getPostsOfMovie = async (movieId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}movie/${movieId}/posts`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch posts of movie: ' + error.message);
    }
};

export const getReviewsOfMovie = async (movieId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}movie/${movieId}/reviews`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch reviews of movie: ' + error.message);
    }
};

export const getCommentsOfPost = async (postId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}post/${postId}/comments`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comments of post: ' + error.message);
    }
};

export const getCommentsOfReview = async (reviewId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}review/${reviewId}/comments`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comments of review: ' + error.message);
    }
};

export const getPostsOfUser = async (userId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}user/${userId}/posts`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch posts of user: ' + error.message);
    }
};

export const getReviewsOfUser = async (userId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}user/${userId}/reviews`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch reviews of user: ' + error.message);
    }
};

export const getCommentsOfUser = async (userId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}user/${userId}/comments`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch comments of user: ' + error.message);
    }
};
