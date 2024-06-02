import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        console.log(response);
        // Handle successful login, e.g., store token
        if (response.status !== 200) {
            throw new Error('Failed to login user');
        }
    } catch (error) {
        console.error(error);
        throw new Error("Login failed. Please check your credentials and try again.");
    }
};

export const signup = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username, email, password });
        if (response.status !== 200) {
            throw new Error('Failed to register user');
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred during registration.");
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`);
        if (response.status !== 200) {
            throw new Error('Failed to logout user');
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred during logging out.");
    }
};
