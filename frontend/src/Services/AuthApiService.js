const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://10.0.0.107:3000/auth/'; // Update to your Expo URL

export const registerUser = async (email, password, username) => {
    const response = await fetch(`http://localhost:3000/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
        throw new Error('Failed to register user');
    }

    const data = await response.json();
    return data;
};

export const loginUser = async (email, password) => {
    const response = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to login user');
    }

    const data = await response.json();
    return data;
};

export const logoutUser = async () => {
    const response = await fetch(`http://localhost:3000/auth/logout`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to logout user');
    }

    const data = await response.json();
    return data;
};
