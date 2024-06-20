// backend/src/Watchlist/controller.js
const WatchlistService = require('./list.services');

exports.createWatchlist = async (req, res) => {
    const userId = req.params.userid;
    const watchlistData = req.body;
    console.log("In createWatchlist controller");
    try {
        console.log("Creating watchlist for user " + userId)
        const watchlist = await WatchlistService.createWatchlist(userId, watchlistData);
        console.log(watchlist);
        res.status(201).json(watchlist);
        console.log("The response "+res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMovieToWatchlist = async (req, res) => {
    const { watchlistId, movieId } = req.body;

    try {
        const movie = await WatchlistService.addMovieToWatchlist(watchlistId, movieId);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.modifyWatchlist = async (req, res) => {
    const watchlistId = req.params.watchlistId;
    const updatedData = req.body;

    try {
        const watchlist = await WatchlistService.modifyWatchlist(watchlistId, updatedData);
        res.status(200).json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteWatchlist = async (req, res) => {
    const watchlistId = req.params.watchlistId;

    try {
        await WatchlistService.deleteWatchlist(watchlistId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
