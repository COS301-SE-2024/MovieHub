const partyService = require('./party.service');

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
    const partyData = req.body;

    try {
        const watchParty = await partyService.createWatchParty(userId, partyData);
        // Sync with extension
        await partyService.syncWithExtension(watchParty.partyId, partyData);
        res.status(201).json(watchParty);
    } catch (error) {
        console.error('Error creating watch party:', error);
        res.status(500).json({ message: error.message });
    }
};