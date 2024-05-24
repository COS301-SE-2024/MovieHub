const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('../Users/users.router');

dotenv.config();

// Create an instance of the app with the userRouter
const app = express();
app.use(express.json());
app.use('/users', userRouter);

jest.mock('../Users/users.services');

const userService = require('../Users/users.services');

describe('GET /users/:userId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return user profile for a valid user ID', async () => {
        const userId = 'user1';
        const userProfile = { id: 'user1', name: 'John Doe' };

        userService.getUserProfile.mockResolvedValueOnce(userProfile);

        const res = await request(app).get(`/users/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(userProfile);
    });

    it('should return 404 for an invalid user ID', async () => {
        const userId = 'invalidUser';

        userService.getUserProfile.mockResolvedValueOnce(null);

        const res = await request(app).get(`/users/${userId}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 for an internal server error', async () => {
        const userId = 'user1';
        const errorMessage = 'Internal server error';

        userService.getUserProfile.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/users/${userId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});
