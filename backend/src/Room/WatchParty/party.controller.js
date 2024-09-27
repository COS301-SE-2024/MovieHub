const partyService = require('./party.service');

// Controller for starting a watch party
exports.startWatchParty = async (req, res) => {
    console.log('Starting watch party -> controller');
    const { username,roomShortCode, partyCode } = req.body;

    if (!partyCode || !roomShortCode || !username) {
        return res.status(400).json({ success: false, message: 'Party code and Room code are required' });
    }

    try {
        const result = await partyService.startWatchParty(username, partyCode, roomShortCode);
        console.log("Result => ", result);
        if (result.success) {
            return res.status(200).json({ success: true, partyCode: result.partyCode, roomId: result.roomId });
        } else {
            return res.status(500).json({ success: false, message: result.error });
        }
    } catch (error) {
        console.error('Error in startWatchParty controller:', error);
        return res.status(500).json({ success: false, message: 'Failed to start watch party' });
    }
};

// Controller for joining a watch party
exports.joinWatchParty = async (req, res) => {
    const { username, partyCode } = req.body;

    if (!username || !partyCode) {
        return res.status(400).json({ success: false, message: 'Username and Party Code are required' });
    }

    try {
        const result = await partyService.joinWatchParty(username, partyCode);
        if (result.success) {
            return res.status(200).json({
                success: true,
                roomId: result.roomId,
                partyDetails: result.partyDetails
            });
        } else {
            return res.status(400).json({ success: false, message: result.error });
        }
    } catch (error) {
        console.error('Error in joinWatchParty controller:', error);
        return res.status(500).json({ success: false, message: 'Failed to join watch party' });
    }
};

// Fetch chat messages for a watch party
exports.getWatchPartyChatMessages = async (req, res) => {
    console.log('Get Watch Party-controller');
    const { partyCode } = req.params;
    console.log("Controller party Code-> ", partyCode);
    try {
        const { roomId } = await partyService.getWatchPartyByCode(partyCode); // Ensure this function exists in the service
        const messages = await partyService.getWatchPartyMessages(roomId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
};

// Send a chat message to a watch party
exports.sendWatchPartyChatMessage = async (req, res) => {
    const { partyCode } = req.params;
    const { username, text } = req.body;

    try {
        const { roomId } = await partyService.getWatchPartyByCode(partyCode);
        const result = await partyService.sendWatchPartyChatMessage(roomId, username, text);
        if (result.success) {
            res.status(200).json({ message: 'Message sent successfully' });
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error sending chat message:', error);
        res.status(500).json({ error: 'Failed to send chat message' });
    }
};

// Controller to delete a watch party
exports.deleteWatchParty = async (req, res) => {
    const { username, partyCode } = req.body;

    if (!username || !partyCode) {
        return res.status(400).json({ success: false, error: 'Username and party code are required' });
    }

    const result = await partyService.deleteWatchParty(username, partyCode);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};
exports.scheduleWatchParty = async (req, res) => {
    const userId = req.params.userId;
    const partyData = req.body;

    try {
        const watchParty = await partyService.scheduleWatchParty(userId, partyData);

        if (watchParty) {
            res.status(201).json(watchParty);
        } else {
            res.status(400).json({ message: 'Failed to create watch party' });
        }
    } catch (error) {
        console.error('Error scheduling watch party:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.createWatchParty = async (req, res) => {
    const userId = req.params.userId;
    const roomId = req.params.roomId;
    const partyData = req.body;

    try {
        const watchParty = await partyService.createWatchParty(userId,roomId, partyData);
        // Sync with extension
      //  await partyService.syncWithExtension(watchParty.partyId, partyData);
        res.status(201).json(watchParty);
    } catch (error) {
        console.error('Error creating watch party:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controller to end a Hyperbeam session
exports.endHyperbeamSession = async (req, res) => {
    const { sessionId } = req.params;

    try {
        await partyService.endHyperbeamSession(sessionId);
        res.status(200).json({ message: 'Hyperbeam session ended successfully.' });
    } catch (error) {
        console.error('Error in endHyperbeamSession controller:', error);
        res.status(500).json({ error: 'Failed to end Hyperbeam session.' });
    }
};
