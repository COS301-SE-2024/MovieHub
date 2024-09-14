// backend/src/recommender/recommender.router.js
const express = require('express');
const { getRecommendations } = require('./recommender.controller');
const router = express.Router();

router.get('/:tmdbId', getRecommendations);

module.exports = router;
