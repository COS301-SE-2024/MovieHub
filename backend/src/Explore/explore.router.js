// explore.router.js

const express = require('express');
const ExploreController = require('./explore.controller');

const router = express.Router();

// Define routes for explore page
router.get('/friends-content', ExploreController.getFriendsContent);
router.get('/friends-of-friends-content', ExploreController.getFriendsOfFriendsContent);
router.get('/random-users-content', ExploreController.getRandomUsersContent);
router.get('/find-users', ExploreController.findUsers);

module.exports = router;
