// src/services/UsersApiService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/users';

export const getUserProfile = async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    const data = await response.json();
    return data;
};

export const updateUserProfile = async (userId, updatedData) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
        throw new Error('Failed to update user profile');
    }
    const data = await response.json();
    return data;
};

export const deleteUserProfile = async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete user profile');
    }
};
