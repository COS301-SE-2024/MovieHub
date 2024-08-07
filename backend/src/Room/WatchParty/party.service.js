const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const WebSocket = require('ws');
const axios = require('axios');

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// WebSocket server URL or endpoint
const WS_SERVER_URL = process.env.WS_SERVER_URL;

// Hyperbeam API URL and key
const HYPERBEAM_API_URL = process.env.HYPERBEAM_API_URL;
const HYPERBEAM_API_KEY = process.env.HYPERBEAM_API_KEY;

// Function to schedule a watch party (Needs to be revisted)
exports.scheduleWatchParty = async (userId, partyData) => {
    const session = driver.session();
    const partyId = uuidv4();
    const { roomId, startTime, title, description } = partyData;

    try {
        // Start a transaction
        const tx = session.beginTransaction();

        // Create the watch party node and relationships
        const result = await tx.run(
            `MATCH (r:Room {roomId: $roomId})
             CREATE (p:WatchParty {
                partyId: $partyId,
                title: $title,
                description: $description,
                startTime: $startTime,
                createdBy: $userId
             })
             MERGE (u:User {uid: $userId})
             MERGE (u)-[:HOSTS]->(p)
             MERGE (r)-[:HOSTS]->(p)
             RETURN p`,
            {
                partyId,
                roomId,
                startTime,
                title,
                description,
                userId
            }
        );

        // Commit the transaction
        await tx.commit();

        return result.records.length > 0 ? result.records[0].get('p').properties : null;
    } catch (error) {
        console.error('Error scheduling watch party:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Function to create a watch party
exports.createWatchParty = async (userId, partyData) => {
    const session = driver.session();
    const partyId = uuidv4();
    const createdAt = new Date().toISOString();
    const { partyName, movieId, startTime, streamingPlatform } = partyData;

    try {
        // Start a transaction
        const tx = session.beginTransaction();

        // Create the watch party in Neo4j
        const result = await tx.run(
            `CREATE (p:WatchParty {
                partyId: $partyId,
                partyName: $partyName,
                movieId: $movieId,
                startTime: $startTime,
                streamingPlatform: $streamingPlatform,
                createdBy: $createdBy,
                createdAt: $createdAt
             })
             MERGE (u:User {uid: $userId})
             CREATE (u)-[:HOSTS]->(p)
             RETURN p`,
            {
                partyId,
                partyName,
                movieId,
                startTime,
                streamingPlatform,
                createdBy: userId,
                createdAt,
                userId
            }
        );

        if (result.records.length === 0) {
            throw new Error("Failed to create watch party.");
        }

        // Commit the transaction
        await tx.commit();

        // Create a Hyperbeam session
        const hyperbeamSession = await createHyperbeamSession(streamingPlatform, movieId);

        // Sync watch party data with the extension
        await syncWithExtension(partyId, { partyName, movieId, startTime, createdAt, hyperbeamSession });

        return { partyId, ...partyData, createdBy: userId, createdAt, hyperbeamSession };
    } catch (error) {
        console.error("Error creating watch party:", error);
        if (tx) await tx.rollback();
        throw error;
    } finally {
        await session.close();
    }
};

// Function to create a Hyperbeam session
async function createHyperbeamSession(streamingPlatform, movieId) {
    try {
        // Mapping of supported streaming platforms to their URLs
        const platformUrls = {
            'Netflix': `https://www.netflix.com/watch/${movieId}`,
            'Hulu': `https://www.hulu.com/watch/${movieId}`,
            'DisneyPlus': `https://www.disneyplus.com/video/${movieId}`,
            'AmazonPrime': `https://www.amazon.com/dp/${movieId}`,
            // Add other platforms as needed
        };

        const websiteUrl = platformUrls[streamingPlatform];

        if (!websiteUrl) {
            throw new Error('Unsupported streaming platform');
        }

        const response = await axios.post(`${HYPERBEAM_API_URL}/sessions`, {
            website: websiteUrl
        }, {
            headers: {
                'Authorization': `Bearer ${HYPERBEAM_API_KEY}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating Hyperbeam session:', error);
        throw error;
    }
}

// Function to sync watch party data with the Chrome extension
async function syncWithExtension(partyId, data) {
    try {
        await sendToExtension(partyId, data);
        console.log('Watch party data synchronized with extension.');
    } catch (error) {
        console.error('Error syncing with extension:', error);
        throw error;
    }
}

// Function to send data to the Chrome extension using WebSocket
async function sendToExtension(partyId, data) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(WS_SERVER_URL);

        ws.on('open', () => {
            ws.send(JSON.stringify({ partyId, ...data }), (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
                ws.close();
            });
        });

        ws.on('error', (error) => {
            reject(error);
        });
    });
}

// Ensure the driver is closed on application exit
process.on('exit', async () => {
    await driver.close();
});
