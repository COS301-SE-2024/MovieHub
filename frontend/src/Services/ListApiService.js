// ListApiServices.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_LIST_API_URL || 'http://10.0.0.107:3000/list/';

const ListApiServices = {
    createWatchlist: async (userId, watchlistData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/list/${userId}`, watchlistData);
            return response.data;
        } catch (error) {
            console.error('Error creating watchlist:', error);
            throw new Error('Failed to create watchlist.');
        }
    },

    modifyWatchlist: async (watchlistId, updatedData) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/list/${watchlistId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error modifying watchlist:', error);
            throw new Error('Failed to modify watchlist.');
        }
    },

    deleteWatchlist: async (watchlistId) => {
        try {
            await axios.delete(`${API_BASE_URL}/list/${watchlistId}`);
        } catch (error) {
            console.error('Error deleting watchlist:', error);
            throw new Error('Failed to delete watchlist.');
        }
    }
};

export default ListApiServices;
