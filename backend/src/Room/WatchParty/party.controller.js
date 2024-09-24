const partyService = require('./party.service');

// Controller for starting a watch party
exports.startWatchParty = async (req, res) => {
    const { username,roomShortCode, partyCode } = req.body;

    if (!partyCode || !roomShortCode || !username) {
        return res.status(400).json({ success: false, message: 'Party code and Room code are required' });
    }

    try {
        const result = await partyService.startWatchParty(username, partyCode, roomShortCode);
        if (result.success) {
            return res.status(200).json({ success: true, partyCode: result.partyCode });
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
