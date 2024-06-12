// backend/src/Watchlist/list.router.js
const express = require('express');
const router = express.Router();
const WatchlistController = require('./list.controller');

router.post('/list/:userid', WatchlistController.createWatchlist);
router.put('/list/:watchlistId', WatchlistController.modifyWatchlist);
router.delete('/list/:watchlistId', WatchlistController.deleteWatchlist);
router.post('/list/:watchlistId/movie', WatchlistController.addMovieToWatchlist);

module.exports = router;
