const express = require('express');
const partyController = require('./party.controller');

const router = express.Router();
// Route to start a watch party
router.post('/start', partyController.startWatchParty);

// Route to join a watch party
router.post('/join', partyController.joinWatchParty);

// Fetch chat messages for a watch party
router.get('/:partyCode/chat', partyController.getWatchPartyChatMessages);

// Send a chat message to a watch party
router.post('/:partyCode/chat', partyController.sendWatchPartyChatMessage);

router.delete('/delete', partyController.deleteWatchParty);


// Route to schedule a new watch party
router.post('/schedule/:userId', partyController.scheduleWatchParty);
// Route to create a new watch party
router.post('/create/:userId/:roomId', partyController.createWatchParty);
// Route to end a Hyperbeam session
router.delete('/end-session/:sessionId', partyController.endHyperbeamSession);

module.exports = router;
