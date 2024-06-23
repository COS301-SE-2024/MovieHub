// ListApiServices.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_LIST_API_URL || 'http://10.0.0.107:3000/list/';


    export const createWatchlist = async (userId, watchlistData) => {
        try {
            const response = await axios.post(`http://localhost:3000/list/${userId}`, watchlistData);
            return response.data;
        } catch (error) {
            console.error('Error creating watchlist:', error);
            throw new Error('Failed to create watchlist.');
        }
    };

export const modifyWatchlist= async (watchlistId, updatedData) => {
        try {
            const response = await axios.patch(`http://localhost:3000/list/${watchlistId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error modifying watchlist:', error);
            throw new Error('Failed to modify watchlist.');
        }
    };

export const deleteWatchlist= async (watchlistId) => {
        try {
            await axios.delete(`http://localhost:3000/list/${watchlistId}`);
        } catch (error) {
            console.error('Error deleting watchlist:', error);
            throw new Error('Failed to delete watchlist.');
        }
    };

