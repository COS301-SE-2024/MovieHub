
const express = require('express');
const userController = require('./auth.controller');

const router = express.Router();

//Thinking of making it take in username as parameter 
router.get('/:id', userController.signUp);
router.patch('/:id', userController.logIn);  
router.delete('/:id', userController.logOut);

module.exports = router;
