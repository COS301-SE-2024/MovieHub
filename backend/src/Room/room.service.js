const neo4j = require('neo4j-driver');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const base62 = require('base62/lib/ascii');
const { getDatabase, ref, push, set, get, onValue } = require('firebase/database');


// Helper function
function generateShortCode(uuid) {
    const buffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');
    const bigIntValue = buffer.readBigUInt64BE();
    const base62Code = base62.encode(bigIntValue.toString()); // Convert BigInt to string
    return base62Code.substring(0, 6); // Shorten to 6 characters
}

// Initialize Neo4j driver using environment variables
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const session = driver.session();
exports.createRoom = async (uid, roomData) => {
    console.log("In room.service");

    // Ensure all required parameters are present
    const requiredParams = ['roomName', 'accessLevel', 'maxParticipants', 'roomDescription'];
    for (const param of requiredParams) {
        if (!(param in roomData)) {
            console.error(`Missing required parameter: ${param}`);
            throw new Error(`Expected parameter(s): ${requiredParams.join(', ')}`);
        }
    }

    const session = driver.session();
    const { roomName, accessLevel, maxParticipants, roomDescription, coverImage } = roomData;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isActive = true;

    try {
        console.log("All parameters are present. Checking for room name uniqueness.");

        // Check if a room with the same name already exists
        const roomNameCheckResult = await session.run(
            `MATCH (r:Room {roomName: $roomName})
             RETURN r`,
            { roomName }
        );

        if (roomNameCheckResult.records.length > 0) {
            console.error("Room name already exists.");
            return { success: false, message: "A room with the same name already exists. Please choose a different name." };
        }

        console.log("Room name is unique. Proceeding with database query.");

        const roomId = uuidv4();
        const shortCode = generateShortCode(roomId); // Generate short code

        // Start a transaction
        const tx = session.beginTransaction();

        const result = await tx.run(
            `CREATE (r:Room {
                roomId: $roomId,
                shortCode: $shortCode, 
                roomName: $roomName,
                accessLevel: $accessLevel,
                coverImage: $coverImage,
                createdBy: $createdBy,
                createdAt: $createdAt,
                updatedAt: $updatedAt,
                maxParticipants: $maxParticipants,
                roomDescription: $roomDescription,
                isActive: $isActive
             })
             MERGE (u:User {uid: $uid})
             CREATE (u)-[:CREATED]->(r)
             RETURN r`,
            {
                roomId,
                shortCode,
                roomName,
                accessLevel,
                coverImage,
                createdBy: uid,
                createdAt,
                updatedAt,
                maxParticipants,
                roomDescription,
                isActive,
                uid
            }
        );

        console.log("Database query executed.");
        if (result.records.length === 0) {
            throw new Error("Failed to create room.");
        }

        // Commit the transaction
        await tx.commit();

        console.log("Room created successfully.");

        return { success: true, roomId, shortCode, ...roomData, createdBy: uid, createdAt, updatedAt, isActive };
    } catch (error) {
        console.error("Error creating room:", error);
        if (tx) await tx.rollback();
        throw error;
    } finally {
        await session.close();
    }
};

exports.getRoomDetails = async (roomId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Room)
             WHERE r.roomId = $roomId OR r.shortCode = $roomId
             RETURN r`,
            { roomId }
        );

        if (result.records.length > 0) {
            const room = result.records[0].get('r').properties;
            return { success: true, room };
        }

        return { success: false, message: 'Room not found' };
    } catch (error) {
        console.error('Error retrieving room details:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Get participant count of a room
exports.getRoomParticipantCount = async (roomId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Room {roomId: $roomId})
             OPTIONAL MATCH (r)<-[:PARTICIPATES_IN]-(u:User)
             RETURN COUNT(DISTINCT u) + 1 AS participantCount`,
            { roomId }
        );

        if (result.records.length > 0) {
            const participantCount = result.records[0].get('participantCount').toInt();
            return { success: true, participantCount };
        }

        return { success: false, message: 'Room not found or no participants' };
    } catch (error) {
        console.error('Error retrieving room participant count:', error);
        throw error;
    } finally {
        await session.close();
    }
};

exports.getRoomParticipants = async (roomId) => {
    const session = driver.session();
    try {
        // Query to get the list of participants in the room and the creator of the room
        const result = await session.run(
            `MATCH (r:Room {roomId: $roomId})
             OPTIONAL MATCH (r)<-[:PARTICIPATES_IN]-(p:User)
             OPTIONAL MATCH (c:User)-[:CREATED]->(r)
             RETURN collect(p) AS participants, collect(c) AS creator`,
            { roomId }
        );

        // Extract participants and creator from the result
        const participants = result.records[0].get('participants').map(user => user.properties);
        const creator = result.records[0].get('creator')[0]?.properties;

        return {
            success: true,
            participants,
            creator
        };
    } catch (error) {
        console.error('Error retrieving room participants:', error);
        throw error;
    } finally {
        await session.close();
    }
};


// Get all rooms a user has created
exports.getUserCreatedRooms = async (uid) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:CREATED]->(r:Room)
             RETURN r`,
            { uid }
        );

        if (result.records.length > 0) {
            const createdRooms = result.records.map(record => record.get('r').properties);
            return { success: true, createdRooms };
        } else if (result.records.length === 0) {
            return { success: true, createdRooms: [] }; // Return an empty array if no rooms are found
        } else {
            return { success: false, message: 'Unexpected result from the query' };
        }
    } catch (error) {
        console.error('Error retrieving created rooms:', error);
        return { success: false, message: 'An error occurred while retrieving created rooms' };
    } finally {
        await session.close();
    }
};

// Get all rooms a user is participating in (but not created)
exports.getUserParticipatedRooms = async (uid) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:PARTICIPATES_IN]->(r:Room)
             WHERE NOT (u)-[:CREATED]->(r)
             RETURN r`,
            { uid }
        );

        if (result.records.length > 0) {
            const participatedRooms = result.records.map(record => record.get('r').properties);
            return { success: true, participatedRooms };
        } else if (result.records.length === 0) {
            return { success: true, participatedRooms: [] }; // Return an empty array if no rooms are found
        } else {
            return { success: false, message: 'Unexpected result from the query' };
        }
    } catch (error) {
        console.error('Error retrieving participated rooms:', error);
        return { success: false, message: 'An error occurred while retrieving participated rooms' };
    } finally {
        await session.close();
    }
};


exports.getPublicRooms = async () => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Room)
             WHERE r.accessLevel = 'Everyone' AND r.isActive = true
             RETURN r`
        );

        if (result.records.length > 0) {
            const publicRooms = result.records.map(record => record.get('r').properties);
            return { success: true, publicRooms };
        } else if (result.records.length === 0) {
            return { success: true, publicRooms: [] }; // Return an empty array when no rooms are found
        } else {
            return { success: false, message: 'Unexpected result from the query' };
        }
    } catch (error) {
        console.error('Error retrieving public rooms:', error);
        return { success: false, message: 'An error occurred while retrieving public rooms' };
    } finally {
        await session.close();
    }
};

exports.getRecentRooms = async (uid) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User {uid: $uid})-[:CREATED|PARTICIPATES_IN]->(r:Room)
            RETURN r
            ORDER BY r.createdAt DESC
            LIMIT 5`,
            { uid }
        );

        if (result.records.length > 0) {
            const recentRooms = result.records.map(record => record.get('r').properties);
            return { success: true, recentRooms };
        } else if (result.records.length === 0) {
            return { success: true, publicRooms: [] }; // Return an empty array when no rooms are found
        } else {
            return { success: false, message: 'Unexpected result from the query' };
        }
    } catch (error) {
        console.error('Error retrieving recent rooms:', error);
        return { success: false, message: 'An error occurred while retrieving recent rooms' };
    } finally {
        await session.close();
    }
};

exports.joinRoom = async (code, uid) => {
    const session = driver.session();

    try {
        // Check if the user is already participating in the room
        const userInRoomResult = await session.run(
            `MATCH (u:User {uid: $uid})-[:PARTICIPATES_IN]->(r:Room {shortCode: $code})
             RETURN u`,
            { code, uid }
        );

        if (userInRoomResult.records.length > 0) {
            return { success: false, message: 'User is already participating in the room' };
        }

        // Fetch room details and current participants count
        const result = await session.run(
            `MATCH (r:Room {shortCode: $code})
             OPTIONAL MATCH (r)<-[:PARTICIPATES_IN]-(:User)
             RETURN r, COUNT(*) AS currentParticipants`,
            { code }
        );

        if (result.records.length > 0) {
            const room = result.records[0].get('r').properties;
            const currentParticipants = result.records[0].get('currentParticipants').toInt();

            // Check if the user can join the room based on the access level
            if (room.accessLevel === 'invite' || room.accessLevel === 'followers') {
                const hasAccess = await checkUserAccess(uid, room);
                if (!hasAccess) {
                    return { success: false, message: 'Access denied' };
                }
            }

            // Check if the room has reached its maximum participant limit
            if (currentParticipants >= room.maxParticipants) {
                return { success: false, message: 'Room is full' };
            }

            // Add the user to the room
            await session.run(
                'MATCH (r:Room {shortCode: $code}), (u:User {uid: $uid}) MERGE (u)-[:PARTICIPATES_IN]->(r)',
                { code, uid }
            );
            console.log("User has been added to room: ", room.roomName)
            return { success: true, roomId: room.roomId };
        }

        return { success: false, message: 'Room not found' };
    } catch (error) {
        console.error('Error joining room:', error);
        throw error;
    } finally {
        await session.close();
    }
};



//function to check user access
async function checkUserAccess(uid, room) {
    const session = driver.session();
    const { roomId, accessLevel, createdBy } = room;

    try {
        if (accessLevel === 'everyone') {
            // Public room, no restrictions
            return true;
        } else if (accessLevel === 'invite') {
            // Check if the user has been invited
            const inviteResult = await session.run(
                `MATCH (u:User {uid: $uid})-[:INVITED_TO]->(r:Room {roomId: $roomId})
                 RETURN u`,
                { uid, roomId }
            );

            return inviteResult.records.length > 0;
        } else if (accessLevel === 'friends') {
            // Check if the user is friends with the room admin
            const friendResult = await session.run(
                `MATCH (u:User {uid: $uid})-[:FRIENDS_WITH]-(a:User {uid: $adminId})
                 RETURN u`,
                { uid, adminId: createdBy }
            );

            return friendResult.records.length > 0;
        }

        // If access level is unrecognized, deny access
        return false;
    } catch (error) {
        console.error('Error checking user access:', error);
        throw error;
    } finally {
        await session.close();
    }
}

// Function to invite a user to a room
exports.inviteUserToRoom = async (adminId, uid, roomId) => {
    const session = driver.session();
    try {
        // Check if the room is invite-only and the admin is the creator, and get the room's shortCode
        const roomCheck = await session.run(
            `MATCH (r:Room {roomId: $roomId, accessLevel: 'invite', createdBy: $adminId})
             RETURN r.shortCode AS shortCode, r.roomName AS roomName`,
            { roomId, adminId }
        );

        if (roomCheck.records.length === 0) {
            throw new Error('Room is not invite-only or admin is not authorized.');
        }

        const shortCode = roomCheck.records[0].get('shortCode');
        const roomName = roomCheck.records[0].get('roomName');

        // Create an INVITED_TO relationship
        await session.run(
            `MATCH (u:User {uid: $uid}), (r:Room {roomId: $roomId})
             MERGE (u)-[:INVITED_TO]->(r)`,
            { uid, roomId }
        );

        // Send notification to the invited user using Firebase Realtime Database
        const db = getDatabase();
        const notificationsRef = ref(db, `notifications/${uid}/room_invitations`); // Reference to the user's notifications
        const newNotificationRef = push(notificationsRef); // Create a new notification entry

        // Set the notification details, including the shortCode
        await set(newNotificationRef, {
            message: `You have been invited to join the room: ${roomName}`,
            roomId: roomId,
            shortCode: shortCode, // Include the room code
            invitedBy: adminId,
            notificationType: 'room_invite',
            timestamp: new Date().toISOString(),
            read: false // Mark notification as unread
        });

        console.log(`User ${uid} invited to room ${roomId} by admin ${adminId}. Notification sent.`);
        return true;
    } catch (error) {
        console.error('Error inviting user to room:', error);
        throw error;
    } finally {
        await session.close();
    }
};



// Function to decline a room invite
exports.declineRoomInvite = async (uid, roomId) => {
    const session = driver.session();
    try {
        // Delete the INVITED_TO relationship
        await session.run(
            `MATCH (u:User {uid: $uid})-[i:INVITED_TO]->(r:Room {roomId: $roomId})
             DELETE i`,
            { uid, roomId }
        );

        console.log(`User ${uid} declined invite to room ${roomId}.`);
    } catch (error) {
        console.error('Error declining room invite:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Function to leave a room
exports.leaveRoom = async (roomId, uid) => {
    const session = driver.session();
    try {
        // Check if the user is the creator of the room
        const userIsCreatorResult = await session.run(
            `MATCH (u:User {uid: $uid})-[:CREATED]->(r:Room {roomId: $roomId})
             RETURN u`,
            { roomId, uid }
        );

        if (userIsCreatorResult.records.length > 0) {
            // If the user is the creator, find a new admin
            const newAdminResult = await session.run(
                `MATCH (r:Room {roomId: $roomId})<-[:PARTICIPATES_IN]-(u:User)
                 WHERE u.uid <> $uid
                 RETURN u LIMIT 1`,
                { roomId, uid }
            );

            if (newAdminResult.records.length > 0) {
                const newAdminId = newAdminResult.records[0].get('u').properties.uid;
                await session.run(
                    `MATCH (newAdmin:User {uid: $newAdminId}), (r:Room {roomId: $roomId})
                     MERGE (newAdmin)-[:CREATED]->(r)`,
                    { newAdminId, roomId }
                );
            } else {
                // If no other participants, deactivate the room
                await session.run(
                    `MATCH (r:Room {roomId: $roomId})
                     SET r.isActive = false`,
                    { roomId }
                );
            }
        }

        // Remove the user from the room
        await session.run(
            `MATCH (u:User {uid: $uid})-[p:PARTICIPATES_IN]->(r:Room {roomId: $roomId})
             DELETE p`,
            { roomId, uid }
        );

        console.log(`User ${uid} left the room ${roomId}.`);
    } catch (error) {
        console.error('Error leaving room:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Function to kick a user from the room
exports.kickUserFromRoom = async (roomId, adminId, uid) => {
    const session = driver.session();
    try {
        // Check if the admin has the right to kick users
        const adminCheckResult = await session.run(
            `MATCH (admin:User {uid: $adminId})-[:CREATED|PARTICIPATES_IN]->(r:Room {roomId: $roomId})
             WHERE (admin)-[:CREATED]->(r) OR (admin)-[:PARTICIPATES_IN]->(r)
             RETURN admin`,
            { roomId, adminId }
        );

        if (adminCheckResult.records.length === 0) {
            return { success: false, message: 'Admin is not authorized to kick users.' };
        }

        // Remove the user from the room
        await session.run(
            `MATCH (u:User {uid: $uid})-[p:PARTICIPATES_IN]->(r:Room {roomId: $roomId})
             DELETE p`,
            { roomId, uid }
        );

        console.log(`User ${uid} was kicked from the room ${roomId} by admin ${adminId}.`);
        return { success: true, message: 'User kicked successfully.' };
    } catch (error) {
        console.error('Error kicking user from room:', error);
        throw error;
    } finally {
        await session.close();
    }
};


// Add a message to the chat room
exports.addMessageToRoom = async (roomId, uid, message) => {
    try {
        const database = getDatabase(); // Get the database instance
        const messageRef = ref(database, `rooms/${roomId}/messages`);
        const newMessageRef = push(messageRef);
        await set(newMessageRef, {
            uid,
            message,
            timestamp: new Date().toISOString(),
        });

        console.log(`Message added to room ${roomId} by user ${uid}.`);
    } catch (error) {
        console.error('Error adding message to room:', error);
        throw error;
    }
};

// Retrieve messages from the chat room
exports.getMessagesFromRoom = async (roomId) => {
    try {
        const database = getDatabase(); // Get the database instance
        const messagesRef = ref(database, `rooms/${roomId}/messages`);
        const snapshot = await get(messagesRef);

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error retrieving messages from room:', error);
        throw error;
    }
};

// Function to listen for new messages in a room
exports.listenForMessages = (roomId, callback) => {
    const db = getDatabase();
    const messageRef = ref(db, `rooms/${roomId}/messages`);

    onValue(messageRef, (snapshot) => {
        const messages = snapshot.val();
        callback(messages);
    });
};

// Function to send notification to users
exports.sendNotificationToUsers = async (roomId, message) => {
    const db = getDatabase();
    const roomUsersRef = ref(db, `rooms/${roomId}/users`);
    const snapshot = await roomUsersRef.once('value');
    const users = snapshot.val();

    const tokens = []; // Array to hold user tokens

    for (const uid in users) {
        if (users[uid].token) {
            tokens.push(users[uid].token);
        }
    }

    if (tokens.length > 0) {
        const messaging = getMessaging();
        const payload = {
            notification: {
                title: 'New Message',
                body: message,
            },
        };

        try {
            await messaging.sendToDevice(tokens, payload);
            console.log('Notification sent to users');
        } catch (error) {
            console.error('Error sending notification:2', error);
        }
    }
};

exports.deleteRoom = async (roomId) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (r:Room {roomId: $roomId})
             DETACH DELETE r
             RETURN COUNT(r) AS removed`,
            { roomId }
        );
        return result.records[0].get('removed').low > 0;
    } catch (error) {
        console.error('Error retrieving room participant count:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Ensure the driver is closed on application exit
process.on('exit', async () => {
    await driver.close();
});