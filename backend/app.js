// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./src/Users/users.router");
const watchlistRouter = require("./src/Watchlist/list.router");
const postRouter = require("./src/Post/post.router");
const likesRouter = require("./src/Likes/likes.router");
const authRouter = require("./src/Auth/auth.router"); // Import Firebase authentication middleware
const cors = require("cors"); // since we are using more than on port
const http = require("http");
const fs = require("fs");
const ColorThief = require("colorthief");
const bodyParser = require("body-parser");
const websocket = require("ws");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
    cors({
        origin: ["http://localhost:8081", "exp://10.0.0.107:8081"], // all ports used in frontend web and exp
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/list", watchlistRouter);
app.use("/post", postRouter);
app.use("/like", likesRouter);

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

/**** CHAT SERVER */

const server = http.createServer(app);
const wss = new websocket.Server({ server });

// in-memory data structure for room
const rooms = {};
const users = {}; 

wss.on("connection", (ws) => {
    console.log("Client connected");

    // Send existing rooms to the newly connected client
    ws.send(
        JSON.stringify({
            type: "existing_rooms",
            rooms: Object.values(rooms).map((room) => ({
                roomId: room.roomId,
                roomName: room.name,
                accessLevel: room.accessLevel,
            })),
        })
    );

    ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "auth") {
            const token = parsedMessage.token;
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                ws.user = user;
                ws.send(JSON.stringify({ type: "auth", status: "success", user }));
            } catch (error) {
                ws.send(JSON.stringify({ type: "auth", status: "error", message: "Invalid token" }));
                ws.close();
            }
        } else {
            handleMessage(ws, parsedMessage);
        }

        ws.on("close", () => {
            handleDisconnect(ws);
        });
    });
});

// Handles incoming messages
// Handles incoming messages
const handleMessage = (ws, message) => {
    switch (message.type) {
        case "create_room":
            handleCreateRoom(ws, message.roomName, message.userInfo);
            break;
        case "join_room":
            handleJoinRoom(ws, message.roomName, message.userInfo);
            break;
        // case "message":
        //     handleMessageRoom(ws, message.roomName, message.userInfo, message.text);
        //     break;
        // case "leave_room":
        //     handleLeaveRoom(ws, message.roomName, message.userInfo);
        //     break;
        // case "delete_room":
        //     handleDeleteRoom(ws, message.roomName, message.userInfo);
            // break;
        case 'existing_rooms':
            handleExistingRooms(ws);
            break;
        default:
            console.log("Unknown message type: " + message.type);
    }
};

const handleExistingRooms = (ws) => {
    ws.send(
        JSON.stringify({
            type: "existing_rooms",
            rooms: Object.values(rooms).map((room) => ({
                roomId: room.roomId,
                roomName: room.name,
                accessLevel: room.accessLevel,
            })),
        })
    );
};

const handleCreateRoom = (ws, roomName, userInfo) => {
    const roomId = uuidv4();

    if (users[userInfo.id]) {
        ws.send(JSON.stringify({ type: "error", message: `User already has a room ${users[userInfo.id]}` }));
        console.log(`User ${userInfo.username} already has a room ${users[userInfo.id]}`);
        return;
    }

    rooms[roomId] = {
        roomId: roomId,
        name: roomName,
        users: [],
        creatorId: userInfo.id,
        accessLevel: userInfo.accessLevel,
    };

    users[userInfo.id] = { ws, roomId, username: userInfo.username };
    ws.roomId = roomId;
    ws.username = userInfo.username;

    ws.send(
        JSON.stringify({
            type: "room_created",
            message: "Room created successfully.",
            roomDetails: {
                roomId,
                roomName,
            },
        })
    );
    console.log(`User ${userInfo.username} created room ${roomName}`);
};

const handleJoinRoom = (ws, roomName, userInfo) => {
    const room = Object.values(rooms).find((r) => r.name === roomName);

    if (!room) {
        ws.send(JSON.stringify({ type: "error", message: "Room does not exist." }));
        return;
    }

    if (room.accessLevel === "inviteonly" && room.creatorId !== userInfo.id) {
        ws.send(JSON.stringify({ type: "error", message: "Room is invite-only." }));
        return;
    }

    if (room.accessLevel === "followers" && !isFollower(userInfo.id, room.creatorId)) {
        ws.send(JSON.stringify({ type: "error", message: "You are not a follower of the room creator." }));
        return;
    }

    ws.roomId = room.roomId;
    users[userInfo.id] = { ws, roomId: room.roomId, username: userInfo.username };
    room.users.push({ ws, username: userInfo.username });

    broadcast(room.roomId, { type: "user_joined", roomName, username: userInfo.username });

    const userCount = room.users.length;
    broadcast(room.roomId, { type: "user_count", count: userCount });

    const roomId = room.roomId;
    ws.send(
        JSON.stringify({
            type: "room_joined",
            message: "Room joined successfully.",
            roomDetails: {
                roomId,
                roomName,
            },
        })
    );

    console.log(`${userInfo.username} joined room: ${roomName}`);
};

const handleMessageRoom = (ws, roomName, userInfo, text) => {
    const room = Object.values(rooms).find((r) => r.name === roomName);

    if (!room) {
        ws.send(JSON.stringify({ type: "error", message: "Room does not exist." }));
        return;
    }

    broadcast(room.roomId, { type: "message", username: userInfo.username, text });
    console.log(`Message from ${userInfo.username} in room ${roomName}: ${text}`);
};

const handleLeaveRoom = (ws, roomName, userInfo) => {
    const room = Object.values(rooms).find((r) => r.name === roomName);

    if (!room) {
        ws.send(JSON.stringify({ type: "error", message: "Room does not exist." }));
        return;
    }

    room.users = room.users.filter((user) => user.ws !== ws);
    delete users[userInfo.id];

    broadcast(room.roomId, { type: "user_left", username: userInfo.username });
    console.log(`User ${userInfo.username} left room ${roomName}`);
};

const handleDeleteRoom = (ws, roomName, userInfo) => {
    const room = Object.values(rooms).find((r) => r.name === roomName);

    if (!room) {
        ws.send(JSON.stringify({ type: "error", message: "Room does not exist." }));
        return;
    }

    if (room.creatorId !== userInfo.id) {
        ws.send(JSON.stringify({ type: "error", message: "Only the creator can delete the room" }));
        return;
    }

    room.users.forEach((user) => {
        if (user.ws.readyState === websocket.OPEN) {
            user.ws.send(JSON.stringify({ type: "room_deleted", roomName }));
        }
    });

    delete rooms[room.roomId];
    console.log(`Room ${roomName} deleted by ${userInfo.username}`);
};

const handleDisconnect = (ws) => {
    // const roomId = ws.roomId;
    // const username = ws.username;
    // if (roomId && username) {
    //     handleLeaveRoom(ws, rooms[roomId].name, { id: ws.user.id, username });
    // }
    console.log(`User]disconnected`);
};

const broadcast = (roomId, message) => {
    const room = rooms[roomId];
    room.users.forEach((user) => {
        if (user.ws.readyState === websocket.OPEN) {
            user.ws.send(JSON.stringify(message));
        }
    });
};

const isFollower = (userId, creatorId) => {
    // Implement your logic to check if userId is a follower of creatorId
    return true; // Placeholder, adjust accordingly
}; 


server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });
