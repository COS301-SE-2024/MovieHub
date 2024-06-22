// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./src/Users/users.router');
const watchlistRouter = require('./src/Watchlist/list.router');
const postRouter = require('./src/Post/post.router');
const cors = require('cors'); // since we are using more than on port
const https = require('https');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: ['http://localhost:8081', 'exp://10.0.0.107:8081'],// all ports used in frontend web and exp
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
  }));

app.use(express.json());
app.use('/users', userRouter);
app.use('/list', watchlistRouter);
app.use('/post', postRouter);

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

