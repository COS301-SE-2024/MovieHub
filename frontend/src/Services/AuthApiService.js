import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.0.28.189:3000/auth'; //// enter what url your expo is running on + our port 3000


export const registerUser = async (email, password, username) => {
    console.log("Inside AuthApi Service");

    const response = await fetch(`${API_URL}/register`, {

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
    const response = await fetch(`${API_URL}/login`, {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    console.log("Let's go in");
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    const textData = await response.text();
    console.log("Check the text dataaa\n", textData);

    if (!response.ok) {
        console.error("Response not OK:", textData);
        throw new Error('Failed to login user');
    }

    let data;
    try {
        data = JSON.parse(textData);
    } catch (e) {
        console.error("Error parsing JSON:", e);
        throw new Error(`Invalid JSON response: ${textData}`);
    }

    console.log('Parsed data:', data);

    
    // Store the token securely using Expo SecureStore
    await SecureStore.setItemAsync('userToken', data.data.token);
    return data;
};

export const logoutUser = async () => {
    const response = await fetch(`${API_URL}/logout`, {

        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to logout user');
    }

    const data = await response.json();
    return data;
};
