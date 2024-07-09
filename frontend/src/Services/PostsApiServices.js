// src/services/PostsApiService.js
const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://192.168.193.139:3000/auth/'; // Update to your Expo URL

export const addPost = async (bodyData) => {
    const response = await fetch(`http://localhost:3000/post/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add post');
    }
    const data = await response.json();
    return data;
};

export const addCommentToPost = async (bodyData) => { //NOT INTEGRATED
    const response = await fetch(`http://localhost:3000/post/comment/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add comment to post');
    }
    const data = await response.json();
    return data;
};

export const addCommentToComment = async (bodyData) => { //NOT INTEGRATED
    const response = await fetch(`http://localhost:3000/post/comment/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add comment to comment');
    }
    const data = await response.json();
    return data;
};

export const editPost = async (bodyData) => {
    const response = await fetch(`http://localhost:3000/post/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to edit post');
    }
    const data = await response.json();
    return data;
};

export const editComment = async (bodyData) => { //NOT INTEGRATED
    const response = await fetch(`http://localhost:3000/post/edit/comment`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to edit comment');
    }
    const data = await response.json();
    return data;
};


export const removePost = async (bodyData) => {
    const response = await fetch(`http://localhost:3000/post/remove`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to remove post');
    }
    const data = await response.json();
    return data;
};

export const removeComment = async (bodyData) => { //NOT INTEGRATED
    const response = await fetch(`http://localhost:3000/post/remove/comment`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to remove comment');
    }
    const data = await response.json();
    return data;
};

export const getPostsOfMovie = async (movieId) => { //NOT INTEGRATED
    const response = await fetch(`http://localhost:3000/post/movie/${movieId}/posts`);
    if (!response.ok) {
        throw new Error('Failed to fetch movie posts');
    }

    const textData = await response.text();
        console.log('Response text:', textData);
        const data = JSON.parse(textData);
        console.log('Parsed data:', data);
    return data;
};

export const getReviewsOfMovie = async (movieId) => { //NOT INTEGRATED
    const response = await fetch(`http://localhost:3000/post/movie/${movieId}/reviews`);
    if (!response.ok) {
        throw new Error('Failed to fetch movie posts');
    }

    const textData = await response.text();
        console.log('Response text:', textData);
        const data = JSON.parse(textData);
        console.log('Parsed data:', data);
    return data;
};

export const getCommentsOfPost = async (postId) => { //NOT INTEGRATED
    const response = await fetch(`http://localhost:3000/post/post/${postId}/comments`);
    if (!response.ok) {
        throw new Error('Failed to fetch comments of post');
    }

    const textData = await response.text();
        console.log('Response text:', textData);
        const data = JSON.parse(textData);
        console.log('Parsed data:', data);
    return data;
};
