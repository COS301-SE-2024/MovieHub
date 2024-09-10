import * as SecureStore from 'expo-secure-store';
const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://10.5.54.63:3000/auth/'; // Update to your Expo URL

export const registerUser = async (email, password, username) => {
    console.log("Inside AuthApi Service");
    const response = await fetch(`http://localhost:3000/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
    });
    console.log("*********");
    console.log(response);
    if (!response.ok) {
        throw new Error('Failed to register user');
    }
 
    console.log("+++++++");
    const data = await response.json();
    console.log("--------------");
    console.log("Heres the data: " + JSON.stringify(data));
    if (!data.data || !data.data.token) {
        throw new Error('Token not found in response');
    }

    // Store the token securely
    await SecureStore.setItemAsync('userToken', data.data.token);

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

    // Store the token securely using Expo SecureStore
    await SecureStore.setItemAsync('userToken', data.data.token);
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
