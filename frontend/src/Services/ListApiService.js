const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://192.168.225.19:3000/list/'; // Update to your Expo URL

export const createWatchlist = async (userId, watchlistData) => {
    try {
        const response = await fetch(`${API_URL}${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(watchlistData),
        });

        if (!response.ok) {
            throw new Error('Failed to create watchlist.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating watchlist:', error);
        throw new Error('Failed to create watchlist.');
    }
};

export const modifyWatchlist = async (watchlistId, updatedData) => {
    try {
        const response = await fetch(`${API_URL}${watchlistId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to modify watchlist.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error modifying watchlist:', error);
        throw new Error('Failed to modify watchlist.');
    }
};

export const getWatchlistDetails = async (watchlistId) => {
    try {
      
        const response = await fetch(`${API_URL}${watchlistId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('+++++++++');
        if (!response.ok) {
            throw new Error('Failed to fetch watchlist details.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching watchlist details:', error);
        throw new Error('Failed to fetch watchlist details.');
    }
};

export const deleteWatchlist = async (watchlistId) => {
    try {
        const response = await fetch(`${API_URL}${watchlistId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete watchlist.');
        }
    } catch (error) {
        console.error('Error deleting watchlist:', error);
        throw new Error('Failed to delete watchlist.');
    }
};
