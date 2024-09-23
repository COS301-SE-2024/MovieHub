const roomService = require('./room.service');

exports.createRoom = async (req, res) => {
    const uid = req.params.uid;
    const roomData = req.body;
    console.log("In createRoom controller");
    try {
        console.log("Creating room for user " + uid);
        const room = await roomService.createRoom(uid, roomData);
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
        const roomId = req.params.roomId; // Assuming the identifier is provided in the URL params
        const result = await roomService.getRoomDetails(roomId);

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
                creator: result.creator
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
    const { uid } = req.params;

    try {
        const result = await roomService.getUserCreatedRooms(uid);
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
    const { uid } = req.params;

    try {
        const result = await roomService.getUserParticipatedRooms(uid);
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
// Controller to handle request for getting room participant count
exports.getRoomParticipantCount = async (req, res) => {
    const { roomId } = req.params;

    try {
        const result = await roomService.getRoomParticipantCount(roomId);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getRoomParticipantCount controller:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getPublicRooms = async (req, res) => {
    const { uid } = req.params;
    try {
        const result = await roomService.getPublicRooms(uid);
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

exports.getRecentRooms = async (req, res) => {
    const { uid } = req.params;
    try {
        const result = await roomService.getRecentRooms(uid);
        if (result.success) {
            return res.status(200).json(result.recentRooms);
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in getRecentRooms controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getIsParticipant = async (req, res) => {
    const { uid, roomId } = req.params;
    try {
        const result = await roomService.getIsParticipant(uid, roomId);
        console.log(result);
        if (result.success) {
            return res.status(200).json(result.isParticipant);
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in getIsParticipant controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const { code, uid } = req.body;
        const result = await roomService.joinRoom(code, uid);

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
    const { adminId, uid, roomId } = req.body;
    try {
        await roomService.inviteUserToRoom(adminId, uid, roomId);
        res.status(200).json({ message: `User ${uid} invited to room ${roomId}` });
    } catch (error) {
        console.error('Error inviting user to room:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.declineRoomInvite = async (req, res) => {
    const { uid, roomId } = req.body;
    try {
        await roomService.declineRoomInvite(uid, roomId);
        res.status(200).json({ message: `User ${uid} declined invite to room ${roomId}` });
    } catch (error) {
        console.error('Error declining room invite:', error);
        res.status(500).json({ error: error.message });
    }
};
// Controller to leave a room
exports.leaveRoom = async (req, res) => {
    const { roomId, uid } = req.body;
    try {
        const result = await roomService.leaveRoom(roomId, uid);
        if (result.success) {
            res.status(200).json({ message: `User ${uid} left the room ${roomId}.` });
        }
    } catch (error) {
        console.error('Error leaving room:', error);
        res.status(500).json({ error: error.message });
    }
};

// Controller to kick a user from a room
exports.kickUserFromRoom = async (req, res) => {
    const { roomId, adminId, uid } = req.body;
    try {
        const result = await roomService.kickUserFromRoom(roomId, adminId, uid);
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
    const { roomId, uid, message } = req.body;
    try {
        await roomService.addMessageToRoom(roomId, uid, message);
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

exports.deleteRoom = async (req, res) => {
    const roomId = req.params.roomId;

    try {
        const result = await roomService.deleteRoom(roomId);
        if (result) {
            res.status(200).json({ message: 'Room deleted successfully' });
        } else {
            res.status(400).json({ message: 'Error deleting room' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getRoomAdmins = async (req, res) => {
    const roomId = req.params.roomId;
    try {
        const result = await roomService.getRoomAdmins(roomId);
        if (result.success) {
            return res.status(200).json({
                success: true,
                admin: result.admins,
                creator: result.creator
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.toggleAdmin = async (req, res) => {
    const uid = req.body.uid;
    const roomId = req.body.roomId;
    try {
        const admin = await roomService.toggleAdmin(uid, roomId);
        const message = admin ? 'User made admin' : 'Admin privileges removed';
        if (admin !== null)
            res.status(200).json({ message: message });
        else
            res.status(400).json({ message: 'Error toggling admin' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
