const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');

// Initialize Neo4j driver using environment variables
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

exports.createRoom = async (hostId) => {
    const roomId = uuidv4();
    const watchPartyCode = uuidv4();

    try {
        await session.run(
            'CREATE (r:Room {id: $roomId, hostId: $hostId, code: $watchPartyCode, createdAt: timestamp()})',
            { roomId, hostId, watchPartyCode }
        );

        return { roomId, watchPartyCode };
    } catch (error) {
        console.error('Error creating room:', error);
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
