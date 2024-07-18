const express = require('express');
const actorController = require('./actor.controller');

const router = express.Router();

router.get('/exist/:actorName', actorController.checkActorExistence);
router.post('/add', actorController.createActor);
router.post('/assignMovie', actorController.assignMovieToActor);
router.get('/movies/:actorName', actorController.fetchMoviesByActor);
router.get('/actors/:movieId', actorController.fetchActorsByMovie);

module.exports = router;
