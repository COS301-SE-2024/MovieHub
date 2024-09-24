const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const WebSocket = require('ws');
const axios = require('axios');
const { getDatabase, ref, push, set } = require('firebase/database');
const { sendNotification } = require('../../Notifications/notification.service'); // Assuming you have this for notifications
const db = getDatabase();
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const WS_SERVER_URL = process.env.WS_SERVER_URL;
const HYPERBEAM_API_URL = 'https://engine.hyperbeam.com/v0/vm';
const HYPERBEAM_API_KEY = process.env.HYPERBEAM_API_KEY;

// // Setup WebSocket Server
// //const wss = new WebSocket.Server({ port: process.env.WS_PORT || 3000 });

// // Store connected clients in an object
// const clients = {};

// // Broadcast to all clients in a watch party room
// const broadcast = (roomId, data) => {
//     const roomClients = clients[roomId] || [];
//     roomClients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(data));
//         }
//     });
// };

// // Set up the WebSocket server to handle new connections
// wss.on('connection', (ws, req) => {
//     // Extract the roomId from the query parameter (e.g., ?roomId=xxx)
//     const params = new URLSearchParams(req.url.split('?')[1]);
//     const roomId = params.get('roomId');

//     if (!roomId) {
//         ws.close();
//         return;
//     }

//     // Add the WebSocket client to the room
//     if (!clients[roomId]) {
//         clients[roomId] = [];
//     }
//     clients[roomId].push(ws);

//     // Handle messages from clients (playback controls)
//     ws.on('message', (message) => {
//         const data = JSON.parse(message);
//         if (data.type === 'playback') {
//             // Broadcast playback control messages to all other clients
//             broadcast(roomId, data);
//         }
//     });

//     // Remove the client when they disconnect
//     ws.on('close', () => {
//         clients[roomId] = clients[roomId].filter(client => client !== ws);
//     });
// });

// Function to generate unique party code
const generatePartyCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
};

exports.startWatchParty = async (username, partyCode, roomShortCode) => {
    const session = driver.session();
    const timestamp = Date.now();
    let roomId;

    try {
        // Retrieve the room ID using the room short code
        const roomResult = await session.run(
            `MATCH (r:Room {shortCode: $roomShortCode}) 
             RETURN r.roomId AS roomId`,
            { roomShortCode }
        );

        const record = roomResult.records[0];
        if (!record) {
            return { success: false, error: 'Invalid room short code' };
        }
        roomId = record.get('roomId');
        console.log('Room ID:', roomId);

        // Check if the user has permission to start the watch party
        const permissionResult = await session.run(
            `MATCH (u:User {username: $username})-[:CREATED|PARTICIPATES_IN]->(r:Room {roomId: $roomId})
             RETURN u`,
            { username, roomId }
        );

        if (permissionResult.records.length === 0) {
            return { success: false, error: 'User does not have permission to start the watch party' };
        }

        // Create the WatchParty node and establish HOSTS relationship
        const watchPartyResult = await session.run(
            `CREATE (p:WatchParty {partyCode: $partyCode, roomId: $roomId, createdAt: $timestamp})
             WITH p
             MATCH (u:User {username: $username})
             CREATE (u)-[:HOSTS]->(p)
             RETURN p`,
            { partyCode, roomId, timestamp, username }
        );

        const watchPartyNode = watchPartyResult.records[0];
        if (!watchPartyNode) {
            return { success: false, error: 'Failed to create watch party' };
        }

        // Store the party message in Firebase Realtime Database (for the room)
        const watchPartyMessageRef = ref(db, `rooms/${roomId}/WatchParty`);
        await set(push(watchPartyMessageRef), {
            message: `Watch party started! Join with the code: ${partyCode}`,
            partyCode,
            createdAt: timestamp
        });

        return { success: true, partyCode, roomId };
    } catch (error) {
        console.error('Error starting watch party:', error);
        return { success: false, error: 'Failed to start watch party' };
    } finally {
        await session.close();
    }
};

    // Function to handle joining a watch party
exports.joinWatchParty = async ( username, partyCode) => {
        const session = driver.session();

        try {
            // Retrieve the watch party details from Neo4j
            const result = await session.run(
                `MATCH (p:WatchParty {partyCode: $partyCode}) 
                 RETURN p.roomId AS roomId, p.createdBy AS createdBy, p.createdAt AS createdAt`,
                { partyCode }
            );

            const record = result.records[0];
            if (!record) {
                return { success: false, error: 'Invalid party code' };
            }

            const roomId = record.get('roomId');
            const createdBy = record.get('createdBy');
            const createdAt = record.get('createdAt');

            // Send a message to the room about the new user joining
            const joinMessageRef = ref(db, `rooms/${roomId}/WatchParty`);
            await set(push(joinMessageRef), {
                message: `User ${username} has joined the watch party!`,
                username,
                createdAt: Date.now()
            });

            return {
                success: true,
                roomId,
                partyDetails: {
                    createdBy,
                    createdAt
                }
            };
        } catch (error) {
            console.error('Error joining watch party:', error);
            return { success: false, error: 'Failed to join watch party' };
        } finally {
            await session.close();
        }
    };

// Sync playback controls from extension to mobile chat room
exports.syncPlaybackControls = async (roomId, controls) => {
    const db = getDatabase();

    try {
        const playbackControlsRef = ref(db, `rooms/${roomId}/WatchPartyPlaybackControls`);
        await update(playbackControlsRef, controls);

        // Broadcast playback controls via WebSocket
        broadcast(roomId, { type: 'playback', controls });

        return { success: true };
    } catch (error) {
        console.error('Error syncing playback controls:', error);
        return { success: false, error: 'Failed to sync playback controls' };
    }
};

exports.deleteWatchParty = async (username, partyCode) => {
    const session = driver.session();

    try {
        // Check if the user is hosting the watch party
        const watchPartyResult = await session.run(
            `MATCH (p:WatchParty {partyCode: $partyCode})<-[:HOSTS]-(u:User {username: $username})
             RETURN p, u`,
            { partyCode, username }
        );

        if (watchPartyResult.records.length === 0) {
            return { success: false, error: 'You do not have permission to delete this watch party or the party does not exist' };
        }

        // Get roomId for the WatchParty
        const roomId = watchPartyResult.records[0].get('p').properties.roomId;

        // Delete the WatchParty node
        await session.run(
            `MATCH (p:WatchParty {partyCode: $partyCode})
             DETACH DELETE p`,
            { partyCode }
        );

        // Remove WatchParty data from Firebase
        const watchPartyRef = ref(db, `rooms/${roomId}/WatchParty`);
        await set(watchPartyRef, null);  // Removes the data at this reference

        return { success: true, message: 'Watch party deleted successfully' };
    } catch (error) {
        console.error('Error deleting watch party:', error);
        return { success: false, error: 'Failed to delete watch party' };
    } finally {
        await session.close();
    }
};


// Function to schedule a watch party (Needs to be revisited)
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
exports.createWatchParty = async (userId,roomId, partyData) => {
    const session = driver.session();
    const partyId = uuidv4(); 
    const createdAt = new Date().toISOString();
    const { partyName, startTime, streamingPlatform } = partyData;

    try {
        // Create a Hyperbeam session
        const hyperbeamSession = await createHyperbeamSession(streamingPlatform);

        console.log("Transaction??");
        // Start a transaction
        const tx = session.beginTransaction();

        // Create the watch party in Neo4j
        const result = await tx.run(
            `CREATE (p:WatchParty {
                partyId: $partyId,
                partyName: $partyName,
                startTime: $startTime,
                streamingPlatform: $streamingPlatform,
                createdBy: $createdBy,
                createdAt: $createdAt,
                hyperbeamSessionUrl: $hyperbeamSessionUrl,
                hyperbeamEmbedUrl: $hyperbeamEmbedUrl
             })
             MERGE (u:User {uid: $userId})
             CREATE (u)-[:HOSTS]->(p)
             RETURN p`,
            {
                partyId,
                partyName,
                startTime,
                streamingPlatform,
                createdBy: userId,
                createdAt,
                hyperbeamSessionUrl: hyperbeamSession.session_id,
                hyperbeamEmbedUrl: hyperbeamSession.embed_url,
                userId
            }
        );

        if (result.records.length === 0) {
            throw new Error("Failed to create watch party.");
        }

        // Commit the transaction
        await tx.commit();

        // Sync watch party data with the extension
      //  await syncWithExtension(partyId, { partyName, startTime, createdAt, hyperbeamSession });

        // Send the iframe embed URL dynamically to the room
        await sendWatchPartyUrlToRoom(roomId, hyperbeamSession.embed_url);


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
async function createHyperbeamSession(streamingPlatform) {
    try {
        const platformUrls = {
            'Netflix': `https://www.netflix.com`,
            'Hulu': `https://www.hulu.com/watch`,
            'DisneyPlus': `https://www.disneyplus.com/video`,
            'AmazonPrime': `https://www.amazon.com/dp`,
            // Add other platforms as needed
        };

        const websiteUrl = platformUrls[streamingPlatform];
        console.log("Check the website: " + websiteUrl);
        if (!websiteUrl) {
            throw new Error('Unsupported streaming platform');
        }
        console.log('Starting Hyperbeam session with URL:', websiteUrl);

        const response = await axios.post(HYPERBEAM_API_URL, {
            start_url: websiteUrl,
            offline_timeout: 300,
            control_disable_default: true //If true, users cannot control the browser by default, and need to be manually granted access by an admin user(in this case our host)
        }, {
            headers: {
                'Authorization': `Bearer ${HYPERBEAM_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Here's the sessions info: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating Hyperbeam session:', error);
        throw error;
    }
}

// Function to end a Hyperbeam session
exports.endHyperbeamSession = async (sessionId) => {
    try {
        await axios.delete(`${HYPERBEAM_API_URL}/${sessionId}`, {
            headers: {
                'Authorization': `Bearer ${HYPERBEAM_API_KEY}`
            }
        });
        console.log('Hyperbeam session ended.');
    } catch (error) {
        console.error('Error ending Hyperbeam session:', error);
        throw error;
    }
};

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

// Function to send the Hyperbeam embed URL to the room
//TO DO: Add paramater to attach the movie's playback timestamp
async function sendWatchPartyUrlToRoom(roomId, hyperbeamUrl) {
    try {
        const database = getDatabase(); // Get the database instance
        const watchPartyRef = ref(database, `rooms/${roomId}/WatchParty`);

        const message = `A new watch party has been created. Join using this link: ${hyperbeamUrl}`;

        // Push the message to the room members
        await push(watchPartyRef, {
            text: message,
            embed_url: hyperbeamUrl,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('Error sending watch party URL to room:', error);
        throw error;
    }
}

// Ensure the driver is closed on application exit
process.on('exit', async () => {
    await driver.close();
});
