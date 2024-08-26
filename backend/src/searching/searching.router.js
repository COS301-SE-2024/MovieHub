import express from 'express';
import searchController from './searching.controller';
const router = express.Router();

// Define routes

router.get('/movies/search/:query', searchController.searchMoviesFuzzy);
router.get('/movies/searchGenre/:uid', searchController.searchRecentMoviesByGenres);
router.get('/getMovieByQuote/:quote', searchController.getMovieByQuote);

// Export the router
module.exports = router;

