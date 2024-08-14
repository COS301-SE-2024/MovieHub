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

exports.getRoomDetails = async (req, res) => {
    try {
        const roomIdentifier = req.params.identifier; // Assuming the identifier is provided in the URL params
        const result = await roomService.getRoomDetails(roomIdentifier);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getRoomDetails controller:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Controller function to handle getting room participants
exports.getRoomParticipants = async (req, res) => {
    const { roomId } = req.params;

    try {
        const result = await roomService.getRoomParticipants(roomId);

        if (result.success) {
            return res.status(200).json({
                success: true,
                participants: result.participants,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: result.message,
            });
        }
    } catch (error) {
        console.error('Error in getRoomParticipants controller:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving room participants.',
        });
    }
}

// Controller to get all rooms a user has created
exports.getUserCreatedRooms = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await roomService.getUserCreatedRooms(userId);
        if (result.success) {
            return res.status(200).json(result.createdRooms);
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in getUserCreatedRooms controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to get all rooms a user is participating in (but not created)
exports.getUserParticipatedRooms = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await roomService.getUserParticipatedRooms(userId);
        if (result.success) {
            return res.status(200).json(result.participatedRooms);
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in getUserParticipatedRooms controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getPublicRooms = async (req, res) => {
    try {
        const result = await roomService.getPublicRooms();
        if (result.success) {
            return res.status(200).json(result.publicRooms);
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in getPublicRooms controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
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
// Controller to leave a room
exports.leaveRoom = async (req, res) => {
    const { roomId, userId } = req.body;
    try {
        await roomService.leaveRoom(roomId, userId);
        res.status(200).json({ message: `User ${userId} left the room ${roomId}.` });
    } catch (error) {
        console.error('Error leaving room:', error);
        res.status(500).json({ error: error.message });
    }
};

// Controller to kick a user from a room
exports.kickUserFromRoom = async (req, res) => {
    const { roomId, adminId, userId } = req.body;
    try {
        const result = await roomService.kickUserFromRoom(roomId, adminId, userId);
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(403).json({ error: result.message });
        }
    } catch (error) {
        console.error('Error kicking user from room:', error);
        res.status(500).json({ error: error.message });
    }
};


// New function to add a message to a room
exports.addMessageToRoom = async (req, res) => {
    const { roomId, userId, message } = req.body;
    try {
        await roomService.addMessageToRoom(roomId, userId, message);
        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        console.error('Error adding message to room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// New function to get messages from a room
exports.getMessagesFromRoom = async (req, res) => {
    const roomId = req.params.roomId;
    try {
        const messages = await roomService.getMessagesFromRoom(roomId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error getting messages from room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Function to listen for messages
exports.listenForMessages = (req, res) => {
    const roomId = req.params.roomId;
    try {
        roomService.listenForMessages(roomId, (messages) => {
            res.status(200).json(messages);
        });
    } catch (error) {
        console.error('Error listening for messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to send notifications to users in a room
exports.sendNotification = async (req, res) => {
    const { roomId, message } = req.body;

    try {
        await roomService.sendNotificationToUsers(roomId, message);
        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};