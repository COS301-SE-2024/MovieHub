// backend/src/Watchlist/controller.js

const watchlistService = require('./list.services');
const createWatchlist = async (req, res) => {
    const { userid: userId } = req.params;
    const { watchlistName } = req.body;

    if (!userId || !watchlistName) {
        return res.status(400).json({ error: 'User ID and Watchlist Name are required' });
    }

    try {
        const newWatchlist = await watchlistService.createWatchlist(userId, watchlistName);
        res.status(201).json(newWatchlist);
    } catch (error) {
        console.error('Error creating watchlist:', error);
        res.status(500).json({ error: 'An error occurred while creating the watchlist' });
    }
};

module.exports = {
    createWatchlist,
};