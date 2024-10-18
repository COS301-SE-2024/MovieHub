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

exports.addMovieToWatchlist = async (req, res) => {
    const watchlistId = req.params.watchlistId;
    const { movieTitle } = req.body;

    try {
        const result = await WatchlistService.addMovieToWatchlist(watchlistId, movieTitle);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getWatchlistDetails = async (req, res) => {
    const { watchlistId } = req.params;
    console.log('Inside getWatchlistDeatils list controller');
    console.log('WatchlistId: ' + watchlistId);

    try {
        const watchlistDetails = await WatchlistService.getWatchlistDetails(watchlistId);
        res.status(200).json(watchlistDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCollaborators = async (req, res) => {
    const { watchlistId } = req.params;

    try {
        const collaborators = await WatchlistService.getCollaborators(watchlistId); // Assuming watchlistService contains the function
        res.status(200).json({ collaborators });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collaborators', error: error.message });
    }
};

exports.getFollowedUsersWatchlists = async (req, res) => {
    const userId = req.params.userId; // Assuming userId is passed in the URL params

    try {
        const watchlists = await WatchlistService.getFollowedUsersWatchlists(userId);
        return res.status(200).json(watchlists);
    } catch (error) {
        console.error("Error in getFollowedUsersWatchlists controller:", error);
        return res.status(500).json({ message: "Internal server error" });
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