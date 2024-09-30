// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./src/Users/users.router");
const watchlistRouter = require("./src/Watchlist/list.router");
const postRouter = require("./src/Post/post.router");
const likesRouter = require("./src/Likes/likes.router");
const authRouter = require("./src/Auth/auth.router"); // Import Firebase authentication middleware
const movieRouter = require('./src/movieHandeling/movie.router');
const recommendRouter = require('./src/Recommender/recommender.router.js');
const searchMovieRouter = require('./src/searching/searching.router');


const roomRouter = require('./src/Room/room.router'); // Import the room router
// Import and use the party router
const partyRouter = require('./src/Room/WatchParty/party.router');
const NotRouter = require('./src/Notifications/notification.router');
const { firebaseAdmin } = require('./src/Firebase/firebaseConnection');
const logRouter = require('./src/Log/log.router');
const exploreRouter = require('./src/Explore/explore.router');

const cors = require("cors"); // since we are using more than on port
const https = require("https");
const fs = require("fs");
const ColorThief = require("colorthief");
const bodyParser = require('body-parser');


dotenv.config();

const app = express();
const port = process.env.PORT;

// Import WebSocket and create the server
const WebSocket = require('ws');


app.use(
    cors({
        origin: ["http://localhost:8081", "exp://192.168.225.19:8081", 'chrome-extension://fcjkfolbijgpimiblbheehmbikepaknp', "https://www.netflix.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/list', watchlistRouter);
app.use('/post', postRouter);
app.use('/like', likesRouter);
app.use('/movie', movieRouter);

app.use('/searchMovie', searchMovieRouter);

app.use('/rooms', roomRouter); // Add the room routes
app.use('/party', partyRouter);

app.use('/log', logRouter);
app.use('/explore', exploreRouter);
app.use('/notification', NotRouter);
app.use('/recommend', recommendRouter)

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Code for extracting colors from an image
// For parsing application/json
app.use(bodyParser.json());

// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/extract-colors", async (req, res) => {
    try {
        const image = req.body.imageUrl;
        if (!image) {
            return res.status(400).send("No image file provided.");
        }

        const colors = await ColorThief.getPalette(image);
        res.json({ colors: colors });
    } catch (error) {
        console.error("Error extracting colors:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const server = app.listen(port, () => {
    console.log(`HTTP Server running at http://localhost:${port}`);
});

// Setup WebSocket Server
const wss = new WebSocket.Server({ server }); // Use the same server for WebSocket

// Store connected clients in an object
const clients = {};

// Broadcast to all clients in a watch party room
// Broadcast function to send messages to all clients in a room
function broadcast(roomId, message, sender) {
    if (clients[roomId]) {
        clients[roomId].forEach(client => {
            if (client !== sender && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
}
// WebSocket connection handling
wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const roomId = params.get('roomId');

    if (!roomId) {
        console.warn('Connection closed: roomId is missing');
        return ws.close();
    }

    if (!clients[roomId]) {
        clients[roomId] = [];
    }
    clients[roomId].push(ws);
    console.log(`Client connected to room: ${roomId}`);

    // Handle incoming messages
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(`Message received in room ${roomId}:`, data);

        // Handle 'join-party' message
        if (data.type === 'join-party') {
            const username = data.username;
            const partyCode = data.partyCode;
            const socketId = data.socketId;

            // Broadcast to others in the room that a new user has joined
            broadcast(roomId, {
                type: 'user-joined',
                username: username,
                partyCode: partyCode,
                socketId: socketId,
                message: `${username} has joined the party!`
            }, ws);
            console.log("******",username, "has joined!");
        }
    

        // Broadcast messages based on type
        if ('webrtc-offer'==data.type) {
            console.log("Broadcasting??", data.type);
            broadcast(roomId, {
                type: 'webrtc-offer',
                offer: offer,
                targetroomId: roomId,
}, ws);
        }
        else if ('webrtc-answer' == data.type) {
            console.log("Broadcasting??", data.type);
            broadcast(roomId, {
                type: 'webrtc-offer',
                answer: data.answer,
                targetroomId: roomId,
            }, ws);
        }
        else if ('webrtc-ice-candidate' == data.type) {
            console.log("Broadcasting??", data.type);
            broadcast(roomId, {
                type: 'webrtc-ice-candidate',
                candidate: data.candidate,
                targetroomId: roomId,
            }, ws);
        }
    });

    // Client disconnection handling
    ws.on('close', () => {
        clients[roomId] = clients[roomId].filter(client => client !== ws);
        console.log(`Client disconnected from room: ${roomId}`);
    });
});