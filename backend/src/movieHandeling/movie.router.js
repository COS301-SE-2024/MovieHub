const express = require('express');
const movieController = require('./movie.controller');

const router = express.Router();

router.get('/exist/:movieId', movieController.checkMovieExistence);
router.post('/add', movieController.createMovie);
router.get('/details/:movieId', movieController.fetchMovieDetails);
router.get('/by-actor/:actorName', movieController.fetchMoviesByActor);
router.get('/by-genre/:genre', movieController.fetchMoviesByGenre);
router.get('/similar/:movieId', movieController.fetchSimilarMovies);
router.post('/rate', movieController.createRating);
router.get('/ratings/:userId', movieController.fetchRatings);

module.exports = router;
