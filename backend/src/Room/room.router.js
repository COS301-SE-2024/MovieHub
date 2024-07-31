const express = require('express');
const roomController = require('./room.controller');

const router = express.Router();

// Route to create a new room
router.post('/create/:userId', roomController.createRoom);

// Route to join an existing room
router.post('/join', roomController.joinRoom);

// Route to invite a user to a room
router.post('/invite', roomController.inviteUserToRoom);

// Route to decline a room invite
router.post('/decline', roomController.declineRoomInvite);


module.exports = router;
