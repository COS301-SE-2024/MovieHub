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
    try {
        const result = await session.run(
            'MATCH (r:Room {code: $code}) RETURN r.id AS roomId',
            { code }
        );

        if (result.records.length > 0) {
            const roomId = result.records[0].get('roomId');
            // Optionally add user to the room participants list
            return roomId;
        }

        return null;
    } catch (error) {
        console.error('Error joining room:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Ensure the driver is closed on application exit
process.on('exit', async () => {
    await driver.close();
});
