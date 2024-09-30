const express = require('express');
const { updateUser } = require('./gameuser.controller'); // Adjust the path as necessary
const userController = require('./gameuser.controller');
const router = express.Router();

router.put('/user/update', updateUser); 
router.get('/user/:userId', userController.fetchUserProfile);

module.exports = router;
