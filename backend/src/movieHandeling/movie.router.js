const express = require('express');
const movieController = require('./movie.controller');

const router = express.Router();

router.get('/exist/:movieId', movieController.checkMovieExistence);
router.post('/add', movieController.createMovie);
router.get('/suggestions/:uid', movieController.fetchSuggestedMovies);
router.get('/details/:movieId', movieController.fetchMovieDetails);


module.exports = router;
