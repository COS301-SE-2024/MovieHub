// backend/src/Watchlist/list.router.js
const express = require('express');
const router = express.Router();
const WatchlistController = require('./list.controller');

router.post('/:userid', WatchlistController.createWatchlist);
router.patch('/:watchlistId', WatchlistController.modifyWatchlist);
router.get('/:watchlistId/collaborators', WatchlistController.getCollaborators);
router.delete('/:watchlistId', WatchlistController.deleteWatchlist);
router.get('/:watchlistId', WatchlistController.getWatchlistDetails)

module.exports = router;

