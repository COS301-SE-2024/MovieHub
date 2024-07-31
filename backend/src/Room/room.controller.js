const roomService = require('./room.service');

exports.createRoom = async (req, res) => {
    const userId = req.params.userId;
    const roomData = req.body;
    console.log("In createRoom controller");
    try {
        console.log("Creating room for user " + userId);
        const room = await roomService.createRoom(userId, roomData);
        console.log(room);
        res.status(201).json(room);
        console.log("The response " + res);
    } catch (error) {
        console.error('Error in createRoom controller:', error);
        res.status(500).json({ message: error.message });
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
