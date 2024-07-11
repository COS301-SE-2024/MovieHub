const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://10.0.0.107:3000/post/';

export const addPost = async (bodyData) => {
    const response = await fetch(`${API_URL}add`, {
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

export const addReview = async (bodyData) => {
    const response = await fetch(`${API_URL}add/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add review');
    }
    const data = await response.json();
    return data;
};

export const addCommentToPost = async (bodyData) => {
    const response = await fetch(`${API_URL}comment/post`, {
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

export const addCommentToReview = async (bodyData) => {
    const response = await fetch(`${API_URL}comment/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add comment to review');
    }
    const data = await response.json();
    return data;
};

export const addCommentToComment = async (bodyData) => {
    const response = await fetch(`${API_URL}comment/comment`, {
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
    const response = await fetch(`${API_URL}edit`, {
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

export const editReview = async (bodyData) => {
    const response = await fetch(`${API_URL}edit/review`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to edit review');
    }
    const data = await response.json();
    return data;
};

export const editComment = async (bodyData) => {
    const response = await fetch(`${API_URL}edit/comment`, {
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
    const response = await fetch(`${API_URL}remove`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to remove post');
    }
    return true;
};

export const removeReview = async (bodyData) => {
    const response = await fetch(`${API_URL}remove/review`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to remove review');
    }
    return true;
};

export const removeComment = async (bodyData) => {
    const response = await fetch(`${API_URL}remove/comment`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
        throw new Error('Failed to remove comment');
    }
    return true;
};

export const getPostsOfMovie = async (movieId) => {
    const response = await fetch(`${API_URL}movie/${movieId}/posts`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch posts of movie');
    }
    const data = await response.json();
    return data;
};

export const getReviewsOfMovie = async (movieId) => {
    const response = await fetch(`${API_URL}movie/${movieId}/reviews`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch reviews of movie');
    }
    const data = await response.json();
    return data;
};

export const getCommentsOfPost = async (postId) => {
    const response = await fetch(`${API_URL}post/${postId}/comments`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch comments of post');
    }
    const data = await response.json();
    return data;
};

export const getCommentsOfReview = async (reviewId) => {
    const response = await fetch(`${API_URL}review/${reviewId}/comments`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch comments of review');
    }
    const data = await response.json();
    return data;
};

export const getPostsOfUser = async (userId) => {
    const response = await fetch(`${API_URL}user/${userId}/posts`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch posts of user');
    }
    const data = await response.json();
    return data;
};

export const getReviewsOfUser = async (userId) => {
    const response = await fetch(`${API_URL}user/${userId}/reviews`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch reviews of user');
    }
    const data = await response.json();
    return data;
};

export const getCommentsOfUser = async (userId) => {
    const response = await fetch(`${API_URL}user/${userId}/comments`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch comments of user');
    }
    const data = await response.json();
    return data;
};
