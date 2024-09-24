// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./src/Users/users.router");
const watchlistRouter = require("./src/Watchlist/list.router");
const postRouter = require("./src/Post/post.router");
const likesRouter = require("./src/Likes/likes.router");
const authRouter = require("./src/Auth/auth.router"); // Import Firebase authentication middleware
const movieRouter = require('./src/movieHandeling/movie.router');
const actorRouter = require('./src/actorHandeling/actor.router');
const genreRouter = require('./src/genreHandeling/genre.router');
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
        origin: ["http://localhost:8081", "exp://192.168.225.19:8081"], // all ports used in frontend web and exp
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
app.use('/actor', actorRouter);
app.use('/genre', genreRouter);

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
const broadcast = (roomId, data) => {
    const roomClients = clients[roomId] || [];
    roomClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Set up the WebSocket server to handle new connections
wss.on('connection', (ws, req) => {
    // Extract the roomId from the query parameter (e.g., ?roomId=xxx)
    const params = new URLSearchParams(req.url.split('?')[1]);
    const roomId = params.get('roomId');

    if (!roomId) {
        ws.close();
        return;
    }

    // Add the WebSocket client to the room
    if (!clients[roomId]) {
        clients[roomId] = [];
    }
    clients[roomId].push(ws);

    // Handle messages from clients (playback controls)
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'playback') {
            // Broadcast playback control messages to all other clients
            broadcast(roomId, data);
        }
    });

    // Remove the client when they disconnect
    ws.on('close', () => {
        clients[roomId] = clients[roomId].filter(client => client !== ws);
    });
});