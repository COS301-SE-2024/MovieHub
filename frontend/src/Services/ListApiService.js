// ListApiServices.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://10.0.0.107:3000/auth/'; // Update to your Expo URL

    export const createWatchlist = async (userId, watchlistData) => {
        try {
            const response = await axios.post(`${API_URL}${userId}`, watchlistData);
            return response.data;
        } catch (error) {
            console.error('Error creating watchlist:', error);
            throw new Error('Failed to create watchlist.');
        }
    };

export const modifyWatchlist= async (watchlistId, updatedData) => {
        try {
            const response = await axios.patch(`${API_URL}${watchlistId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error modifying watchlist:', error);
            throw new Error('Failed to modify watchlist.');
        }
    };

export const deleteWatchlist= async (watchlistId) => {
        try {
            await axios.delete(`${API_URL}${watchlistId}`);
        } catch (error) {
            console.error('Error deleting watchlist:', error);
            throw new Error('Failed to delete watchlist.');
        }
    };

