const neo4j = require('neo4j-driver');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

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

        return { roomId, ...roomData, createdBy: userId, createdAt, updatedAt, isActive };
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
        const result = await session.run(
            'MATCH (r:Room {roomId: $code}) RETURN r, size((r)<-[:PARTICIPATES_IN]-(:User)) AS currentParticipants',
            { code }
        );

        if (result.records.length > 0) {
            const room = result.records[0].get('r').properties;
            const currentParticipants = result.records[0].get('currentParticipants');

            // Check if the user can join the room based on the access level
            if (room.accessLevel === 'invite' || room.accessLevel === 'followers') {
                // Implement your logic for checking user access
                // This is a placeholder for actual access check logic
                const hasAccess = await checkUserAccess(userId, room.accessLevel);
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
                'MATCH (r:Room {roomId: $code}), (u:User {uid: $userId}) MERGE (u)-[:PARTICIPATES_IN]->(r)',
                { code, userId }
            );

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

// Ensure the driver is closed on application exit
process.on('exit', async () => {
    await driver.close();
});
