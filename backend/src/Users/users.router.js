// backend/users/users.routers.js
const express = require('express');
const userController = require('./users.controller');

const router = express.Router();

//Thinking of making it take in username as parameter 
router.get('/:id', userController.getUserProfile);
router.patch('/:id', userController.updateUserProfile);  // Change PUT to PATCH
router.delete('/:id', userController.deleteUserProfile);

module.exports = router;
