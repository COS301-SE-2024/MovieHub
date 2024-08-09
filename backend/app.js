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
const roomRouter = require('./src/Room/room.router'); // Import the room router
// Import and use the party router
const partyRouter = require('./src/Room/WatchParty/party.router');
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
app.use('/rooms', roomRouter); // Add the room routes
app.use('/party', partyRouter);
app.use('/log', logRouter);
app.use('/explore', exploreRouter);


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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
