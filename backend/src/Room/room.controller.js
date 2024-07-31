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
        const result = await roomService.joinRoom(code, userId);

        if (result.success) {
            res.status(200).json({ roomId: result.roomId });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (error) {
        console.error('Error in joinRoom controller:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.inviteUserToRoom = async (req, res) => {
    const { adminId, userId, roomId } = req.body;
    try {
        await roomService.inviteUserToRoom(adminId, userId, roomId);
        res.status(200).json({ message: `User ${userId} invited to room ${roomId}` });
    } catch (error) {
        console.error('Error inviting user to room:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.declineRoomInvite = async (req, res) => {
    const { userId, roomId } = req.body;
    try {
        await roomService.declineRoomInvite(userId, roomId);
        res.status(200).json({ message: `User ${userId} declined invite to room ${roomId}` });
    } catch (error) {
        console.error('Error declining room invite:', error);
        res.status(500).json({ error: error.message });
    }
};
