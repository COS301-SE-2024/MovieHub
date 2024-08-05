const express = require('express');
const partyController = require('./party.controller');

const router = express.Router();

// Route to schedule a new watch party
router.post('/schedule/:userId', partyController.scheduleWatchParty);
// Route to create a new watch party
router.post('/create/:userId', partyController.createWatchParty);

module.exports = router;
