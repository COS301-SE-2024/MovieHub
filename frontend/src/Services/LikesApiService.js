// src/services/LikesApiService.js
const API_URL = process.env.REACT_APP_LIKE_API_URL || 'http://10.0.0.107:3000/like/'; // Update to your Expo URL

export const getLikesOfMovie = async (movieId) => {
    const response = await fetch(`${API_URL}movie/${movieId}`);
    if (!response.ok) {
        console.log(response)
        throw new Error("Failed to fetch movie likes");
    } 
    
    const data = await response.json();
    console.log("data", data);
    return data;
};

export const getLikesOfComment = async (commentId) => {
    const response = await fetch(`${API_URL}comment/${commentId}`);
    if (!response.ok) {
        console.log(response)
        throw new Error("Failed to fetch comment likes");
    } 
    
    const data = await response.json();
    console.log("data", data);
    return data;
};

export const getLikesOfReview = async (reviewId) => {
    const response = await fetch(`${API_URL}review/${reviewId}`);
    if (!response.ok) {
        console.log(response)
        throw new Error("Failed to fetch review likes");
    } 
    
    const data = await response.json();
    console.log("data", data);
    return data;
};

export const getLikesOfPost = async (postId) => {
    const response = await fetch(`${API_URL}post/${postId}`);
    if (!response.ok) {
        console.log(response)
        throw new Error("Failed to fetch post likes");
    } 
    
    const data = await response.json();
    console.log("data", data);
    return data;
};


export const toggleLikeReview = async (bodyData) => {
    const response = await fetch(`${API_URL}toggleLikeReview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update like review');
    }
    const data = await response.json();
    return data;
};

export const toggleLikeComment = async (bodyData) => {
    const response = await fetch(`${API_URL}toggleLikeComment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update like comment');
    }
    const data = await response.json();
    return data;
};

export const toggleLikeMovie = async (bodyData) => {
    const response = await fetch(`${API_URL}toggleLikeMovie`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update like movie');
    }
    const data = await response.json();
    return data;
};

export const toggleLikePost = async (bodyData) => {
    const response = await fetch(`${API_URL}toggleLikePost`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update like post');
    }
    const data = await response.json();
    return data;
};