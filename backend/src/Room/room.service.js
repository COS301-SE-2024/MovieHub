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

exports.createRoom = async (userId, roomData) => {
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
    const roomId = uuidv4();
    const shortCode = generateShortCode(roomId); // Generate short code
    const { roomName, accessLevel, maxParticipants, roomDescription } = roomData;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isActive = true;

    try {
        console.log("All parameters are present. Proceeding with database query.");

        // Start a transaction
        const tx = session.beginTransaction();

        const result = await tx.run(
            `CREATE (r:Room {
                roomId: $roomId,
                shortCode: $shortCode, 
                roomName: $roomName,
                accessLevel: $accessLevel,
                createdBy: $createdBy,
                createdAt: $createdAt,
                updatedAt: $updatedAt,
                maxParticipants: $maxParticipants,
                roomDescription: $roomDescription,
                isActive: $isActive
             })
             MERGE (u:User {uid: $userId})
             CREATE (u)-[:CREATED]->(r)
             RETURN r`,
            {
                roomId,
                shortCode,
                roomName,
                accessLevel,
                createdBy: userId,
                createdAt,
                updatedAt,
                maxParticipants,
                roomDescription,
                isActive,
                userId
            }
        );

        console.log("Database query executed.");
        if (result.records.length === 0) {
            throw new Error("Failed to create room.");
        }

        // Commit the transaction
        await tx.commit();

        console.log("Room created successfully.");

        return { roomId, shortCode, ...roomData, createdBy: userId, createdAt, updatedAt, isActive };
    } catch (error) {
        console.error("Error creating room:", error);
        if (tx) await tx.rollback();
        throw error;
    } finally {
        await session.close();
    }
};


exports.joinRoom = async (code, userId) => {
    const session = driver.session();

    try {
        // Check if the user is already participating in the room
        const userInRoomResult = await session.run(
            `MATCH (u:User {uid: $userId})-[:PARTICIPATES_IN]->(r:Room {shortCode: $code})
             RETURN u`,
            { code, userId }
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
                const hasAccess = await checkUserAccess(userId, room);
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
                'MATCH (r:Room {shortCode: $code}), (u:User {uid: $userId}) MERGE (u)-[:PARTICIPATES_IN]->(r)',
                { code, userId }
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
async function checkUserAccess(userId, room) {
    const session = driver.session();
    const { roomId, accessLevel, createdBy } = room;

    try {
        if (accessLevel === 'everyone') {
            // Public room, no restrictions
            return true;
        } else if (accessLevel === 'invite') {
            // Check if the user has been invited
            const inviteResult = await session.run(
                `MATCH (u:User {uid: $userId})-[:INVITED_TO]->(r:Room {roomId: $roomId})
                 RETURN u`,
                { userId, roomId }
            );

            return inviteResult.records.length > 0;
        } else if (accessLevel === 'friends') {
            // Check if the user is friends with the room admin
            const friendResult = await session.run(
                `MATCH (u:User {uid: $userId})-[:FRIENDS_WITH]-(a:User {uid: $adminId})
                 RETURN u`,
                { userId, adminId: createdBy }
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
exports.inviteUserToRoom = async (adminId, userId, roomId) => {
    const session = driver.session();
    try {
        // Check if the room is invite-only and the admin is the creator
        const roomCheck = await session.run(
            `MATCH (r:Room {roomId: $roomId, accessLevel: 'invite', createdBy: $adminId})
             RETURN r`,
            { roomId, adminId }
        );

        if (roomCheck.records.length === 0) {
            throw new Error('Room is not invite-only or admin is not authorized.');
        }

        // Create an INVITED_TO relationship
        await session.run(
            `MATCH (u:User {uid: $userId}), (r:Room {roomId: $roomId})
             MERGE (u)-[:INVITED_TO]->(r)`,
            { userId, roomId }
        );

        console.log(`User ${userId} invited to room ${roomId} by admin ${adminId}.`);
        return true;
    } catch (error) {
        console.error('Error inviting user to room:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Function to decline a room invite
exports.declineRoomInvite = async (userId, roomId) => {
    const session = driver.session();
    try {
        // Delete the INVITED_TO relationship
        await session.run(
            `MATCH (u:User {uid: $userId})-[i:INVITED_TO]->(r:Room {roomId: $roomId})
             DELETE i`,
            { userId, roomId }
        );

        console.log(`User ${userId} declined invite to room ${roomId}.`);
    } catch (error) {
        console.error('Error declining room invite:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Function to leave a room
exports.leaveRoom = async (roomId, userId) => {
    const session = driver.session();
    try {
        // Check if the user is the creator of the room
        const userIsCreatorResult = await session.run(
            `MATCH (u:User {uid: $userId})-[:CREATED]->(r:Room {roomId: $roomId})
             RETURN u`,
            { roomId, userId }
        );

        if (userIsCreatorResult.records.length > 0) {
            // If the user is the creator, find a new admin
            const newAdminResult = await session.run(
                `MATCH (r:Room {roomId: $roomId})<-[:PARTICIPATES_IN]-(u:User)
                 WHERE u.uid <> $userId
                 RETURN u LIMIT 1`,
                { roomId, userId }
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
            `MATCH (u:User {uid: $userId})-[p:PARTICIPATES_IN]->(r:Room {roomId: $roomId})
             DELETE p`,
            { roomId, userId }
        );

        console.log(`User ${userId} left the room ${roomId}.`);
    } catch (error) {
        console.error('Error leaving room:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Function to kick a user from the room
exports.kickUserFromRoom = async (roomId, adminId, userId) => {
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
            `MATCH (u:User {uid: $userId})-[p:PARTICIPATES_IN]->(r:Room {roomId: $roomId})
             DELETE p`,
            { roomId, userId }
        );

        console.log(`User ${userId} was kicked from the room ${roomId} by admin ${adminId}.`);
        return { success: true, message: 'User kicked successfully.' };
    } catch (error) {
        console.error('Error kicking user from room:', error);
        throw error;
    } finally {
        await session.close();
    }
};


// Add a message to the chat room
exports.addMessageToRoom = async (roomId, userId, message) => {
    try {
        const database = getDatabase(); // Get the database instance
        const messageRef = ref(database, `rooms/${roomId}/messages`);
        const newMessageRef = push(messageRef);
        await set(newMessageRef, {
            userId,
            message,
            timestamp: new Date().toISOString(),
        });

        console.log(`Message added to room ${roomId} by user ${userId}.`);
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

    for (const userId in users) {
        if (users[userId].token) {
            tokens.push(users[userId].token);
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
// Ensure the driver is closed on application exit
process.on('exit', async () => {
    await driver.close();
});
