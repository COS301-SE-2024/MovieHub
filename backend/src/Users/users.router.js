// backend/users/users.routers.js
const express = require('express');
const userController = require('./users.controller');

const router = express.Router();

//Thinking of making it take in username as parameter 
router.get('/:userId', userController.getUserProfile);
router.put('/:userId', userController.updateUserProfile);
router.delete('/:userId', userController.deleteUserProfile);

module.exports = router;
