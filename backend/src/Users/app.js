// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./users.router');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/users', userRouter);

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

