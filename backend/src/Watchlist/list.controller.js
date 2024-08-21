// backend/src/Watchlist/controller.js
const WatchlistService = require('./list.services');
import responseHandler from '../utils/responseHandler';

exports.createWatchlist = async (req, res) => {
    const userId = req.params.userid;
    const watchlistData = req.body;
    console.log("In createWatchlist controller");
    try {
        console.log("Creating watchlist for user " + userId)
        const watchlist = await WatchlistService.createWatchlist(userId, watchlistData);
        if (watchlist) {
            responseHandler(res, 201, 'Watchlist created successfully', watchlist);
        } else {
            res.status(400).json({ message: 'Error creating watchlist' });
        }
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

exports.modifyWatchlist = async (req, res) => {
    const watchlistId = req.params.watchlistId;
    const updatedData = req.body;

    try {
        const watchlist = await WatchlistService.modifyWatchlist(watchlistId, updatedData);
        if (watchlist) {
            responseHandler(res, 200, 'Watchlist updated successfully', watchlist);
        } else {
            res.status(400).json({ message: 'Error updating watchlist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getWatchlistDetails = async (req, res) => {
    const { watchlistId } = req.params;
    console.log('Inside getWatchlistDeatils list controller');
    console.log('WatchlistId: ' + watchlistId);

    try {
        const watchlistDetails = await WatchlistService.getWatchlistDetails(watchlistId);
        if (watchlistDetails) {
            responseHandler(res, 200, 'Watchlist details fetched successfully', watchlistDetails);
        } else {
            res.status(400).json({ message: 'Error fetching watchlist details' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.deleteWatchlist = async (req, res) => {
    const watchlistId = req.params.watchlistId;

    try {
        const result = await WatchlistService.deleteWatchlist(watchlistId);
        if (result) {
            responseHandler(res, 200, 'Watchlist deleted successfully');
        } else {
            res.status(400).json({ message: 'Error deleting watchlist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
