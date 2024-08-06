import express from 'express';
import searchController from  './searching.controller';
const router = express.Router();

// Define routes
router.get('/getMovieByQuote',searchController.getMovieByQuote);
router.get('/movies/search', searchController.searchMoviesFuzzy);

// Export the router
module.exports = router;