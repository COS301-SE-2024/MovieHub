// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('userRouter');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
