// src/services/UsersApiService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://10.0.0.109:3000/users/';// enter what url your expo is running on + our port 3000

export const getUserProfile = async (userId) => {
    const response = await fetch(`${API_URL}${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    const textData = await response.text();
        console.log('Response text:', textData);
        const data = JSON.parse(textData);
        console.log('Parsed data:', data);


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