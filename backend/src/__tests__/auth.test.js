const request = require('supertest');
const express = require('express');
const authRouter = require('../Auth/auth.router');
const authService = require('../Auth/auth.services');

jest.mock('../Auth/auth.services');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/register', () => {
        it('should register a user successfully', async () => {
            const user = { email: 'test@example.com', password: 'password123', username: 'testuser' };
            const userRecord = { uid: '12345', displayName: 'testuser' };
            const customToken = 'customToken123';

            authService.registerUser.mockResolvedValueOnce({ userRecord, customToken });

            const res = await request(app)
                .post('/auth/register')
                .send(user);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                message: 'User registered successfully',
                data: { uid: userRecord.uid, username: user.username, token: customToken }
            });
        });

        it('should return 400 for missing fields', async () => {
            const user = { email: 'test@example.com', password: 'password123' };

            const res = await request(app).post('/auth/register').send(user);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Missing required fields: email, password, username' });
        });

        it('should return 500 for internal server error', async () => {
            const user = { email: 'test@example.com', password: 'password123', username: 'testuser' };
            const errorMessage = 'Internal server error';

            authService.registerUser.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app).post('/auth/register').send(user);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
        });
    });

    describe('POST /auth/login', () => {
        it('should login a user successfully', async () => {
            const user = { email: 'test@example.com', password: 'password123' };
            const userRecord = { uid: '12345', displayName: 'testuser' };
            const customToken = 'customToken123';

            authService.loginUser.mockResolvedValueOnce({ user: userRecord, customToken });

            const res = await request(app).post('/auth/login').send(user);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: 'User logged in successfully',
                data: { uid: userRecord.uid, username: userRecord.displayName, token: customToken }
            });
        });

        it('should return 400 for missing fields', async () => {
            const user = { email: 'test@example.com' };

            const res = await request(app).post('/auth/login').send(user);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Missing required fields: email, password' });
        });

        it('should return 400 for invalid email or password', async () => {
            const user = { email: 'test@example.com', password: 'password123' };

            authService.loginUser.mockResolvedValueOnce({ user: null, customToken: null });

            const res = await request(app).post('/auth/login').send(user);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Invalid email or password' });
        });

        it('should return 500 for internal server error', async () => {
            const user = { email: 'test@example.com', password: 'password123' };
            const errorMessage = 'Internal server error';

            authService.loginUser.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app).post('/auth/login').send(user);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout a user successfully', async () => {
            authService.logoutUser.mockResolvedValueOnce(true);

            const res = await request(app).post('/auth/logout');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'User logged out successfully' });
        });

        it('should return 400 for unsuccessful logout', async () => {
            authService.logoutUser.mockResolvedValueOnce(false);

            const res = await request(app).post('/auth/logout');

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: 'Logout unsuccessful' });
        });

        it('should return 500 for internal server error', async () => {
            const errorMessage = 'Internal server error';

            authService.logoutUser.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app).post('/auth/logout');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
        });
    });
});
