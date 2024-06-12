// backend/src/Watchlist/list.router.js
const express = require('express');
const router = express.Router();
const WatchlistController = require('./WatchlistController');

router.post('/list/:userid', WatchlistController.createWatchlist);

module.exports = router;