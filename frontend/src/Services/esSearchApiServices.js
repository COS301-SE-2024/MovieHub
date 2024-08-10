import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.REACT_APP_SEARCH_API_URL || 'http://192.168.3.218:3000/searchMovie/'; // Update to your Expo URL

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

export const searchMoviesFuzzy = async (query) => {
    try {
        const response = await fetchWithAuth(`${API_URL}movies/search`, {
            method: 'POST',
            body: JSON.stringify({ query }),
        });
        return response;
    } catch (error) {
        throw new Error('Failed to search movies: ' + error.message);
    }
};