const express = require('express');
const router = express.Router();
import searchController from  './searching.controller';

// Define routes
router.get('/movies/checkConnection', searchController.checkConnection);
router.get('/movies/search', searchController.searchMoviesFuzzy);

// Export the router
module.exports = router;