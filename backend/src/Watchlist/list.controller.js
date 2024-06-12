// backend/src/Watchlist/controller.js
const WatchlistService = require('./list.services');

exports.createWatchlist = async (req, res) => {
    const { userid } = req.params;
    const {
        name,
        tags,
        visibility,
        isRanked,
        description,
        isCollaborative
    } = req.body;

    const watchlistData = {
        name,
        tags,
        visibility,
        isRanked,
        description,
        isCollaborative
    };

    try {
        const watchlist = await WatchlistService.createWatchlist(userid, watchlistData);
        res.status(201).json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.modifyWatchlist = async (req, res) => {
    const { watchlistId } = req.params;
    const updatedData = req.body;

    try {
        const updatedWatchlist = await WatchlistService.modifyWatchlist(watchlistId, updatedData);
        res.status(200).json(updatedWatchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteWatchlist = async (req, res) => {
    const { watchlistId } = req.params;

    try {
        const result = await WatchlistService.deleteWatchlist(watchlistId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMovieToWatchlist = async (req, res) => {
    const { watchlistId } = req.params;
    const { movieName } = req.body;

    try {
        const movie = await WatchlistService.addMovieToWatchlist(watchlistId, movieName);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
