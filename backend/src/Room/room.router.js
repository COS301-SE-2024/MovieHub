const express = require('express');
const roomController = require('./room.controller');

const router = express.Router();

// Route to create a new room
router.post('/create/:userId', roomController.createRoom);

// Route to join an existing room
router.post('/join', roomController.joinRoom);

// Route to get participants of a room
router.get('/:roomId/participants', roomController.getRoomParticipants);

// Route to get all rooms a user has created
router.get('/created/:userId', roomController.getUserCreatedRooms);

// Route to get all rooms a user is participating in (but not created)
router.get('/participated/:userId', roomController.getUserParticipatedRooms);

router.get('/public-rooms', roomController.getPublicRooms);

// Route to invite a user to a room
router.post('/invite', roomController.inviteUserToRoom);

// Route to decline a room invite
router.post('/decline', roomController.declineRoomInvite);

// Route to leave a room
router.post('/leave', roomController.leaveRoom);

// Route to kick a user from a room
router.post('/kick', roomController.kickUserFromRoom);

// New route to add a message to a room
router.post('/message', roomController.addMessageToRoom);

// New route to get messages from a room
router.get('/messages/:roomId', roomController.getMessagesFromRoom);

// Route to listen for messages
router.get('/listen/:roomId', roomController.listenForMessages);

// Route to send a notification to users in a room
router.post('/notify', roomController.sendNotification);

// Route to get room details by roomId or shortCode
router.get('/:identifier', roomController.getRoomDetails);

module.exports = router;
