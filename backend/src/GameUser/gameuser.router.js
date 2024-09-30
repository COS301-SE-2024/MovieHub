const express = require('express');
const { updateUser } = require('./gamesuser.controller'); // Adjust the path as necessary

const router = express.Router();

router.put('/user/update', updateUser); 

module.exports = router;
