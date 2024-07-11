const express = require('express');
const genreController = require('./genre.controller');

const router = express.Router();

router.get('/exist/:genre', genreController.checkGenreExistence);
router.post('/add', genreController.createGenre);
router.get('/all', genreController.fetchGenres);
router.post('/assign', genreController.assignGenreToMovie);
router.get('/movies/:genre', genreController.fetchMoviesByGenre);

module.exports = router;
