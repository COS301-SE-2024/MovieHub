// backend/src/Watchlist/list.router.js
const express = require('express');
const router = express.Router();
const WatchlistController = require('./list.controller');

router.post('/:userid', WatchlistController.createWatchlist);
//router.post('/add-movie', WatchlistController.addMovieToWatchlist);
router.patch('/:watchlistId', WatchlistController.modifyWatchlist);
router.delete('/:watchlistId', WatchlistController.deleteWatchlist);

module.exports = router;

