// backend/users/users.routers.js
const express = require('express');
//import {verifyToken} from '../Auth/auth.middleware.js';
const userController = require('./users.controller');

const router = express.Router();

//Thinking of making it take in username as parameter 
router.get('/:id', userController.getUserProfile);
router.patch('/:id', userController.updateUserProfile);  // Change PUT to PATCH
router.delete('/:id', userController.deleteUserProfile);
router.patch('/:id/mode/change', userController.changeMode); // Route to change mode
router.get('/:id/mode', userController.getMode); // Route to get the current mode
router.patch('/:id/mode/toggle', userController.toggleMode);

router.get('/:id/watchlists', userController.getUserWatchlists);
router.get('/:id/watchlists/public', userController.getUserPublicWatchlists);

router.post('/follow', userController.followUser);
router.post('/unfollow', userController.unfollowUser);
router.get('/friends/:id', userController.getFriends);
router.get('/search/:searchName', userController.searchUser);

router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);
router.get('/:id/follows/:uid', userController.isFollowing);
router.get('/:id/followers/count', userController.fetchFollowerCount  );
router.get('/:id/following/count', userController.fetchFollowingCount );

// Route to get user notifications
router.get('/:id/notifications', userController.getUserNotifications);
router.get('/:id/notifications/unread', userController.getUnreadNotifications);
module.exports = router;
