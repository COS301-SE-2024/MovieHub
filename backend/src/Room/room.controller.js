const roomService = require('./room.service');

exports.createRoom = async (req, res) => {
    try {
        const { hostId } = req.body;
        const { roomId, watchPartyCode } = await roomService.createRoom(hostId);
        res.status(201).json({ roomId, watchPartyCode });
    } catch (error) {
        console.error('Error in createRoom controller:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const { code, userId } = req.body;
        const roomId = await roomService.joinRoom(code, userId);

        if (roomId) {
            res.status(200).json({ roomId });
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        console.error('Error in joinRoom controller:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
