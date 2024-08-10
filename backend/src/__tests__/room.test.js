const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const roomRouter = require('./roomRouter');
const roomService = require('./roomService');

dotenv.config();

// Create an instance of the app with the roomRouter
const app = express();
app.use(express.json());
app.use('/rooms', roomRouter);

jest.mock('./roomService');

describe('POST /rooms/create', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a room and return room ID and watch party code', async () => {
        const hostId = 'host123';
        const roomId = 'roomId123';
        const watchPartyCode = 'watchPartyCode123';

        roomService.createRoom.mockResolvedValueOnce({ roomId, watchPartyCode });

        const res = await request(app)
            .post('/rooms/create')
            .send({ hostId });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ roomId, watchPartyCode });
    });

    it('should return 500 for an internal server error', async () => {
        const hostId = 'host123';
        const errorMessage = 'Internal server error';

        roomService.createRoom.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/rooms/create')
            .send({ hostId });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
});

describe('POST /rooms/join', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should join a room and return the room ID', async () => {
        const code = 'watchPartyCode123';
        const userId = 'user123';
        const roomId = 'roomId123';

        roomService.joinRoom.mockResolvedValueOnce(roomId);

        const res = await request(app)
            .post('/rooms/join')
            .send({ code, userId });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ roomId });
    });

    it('should return 404 if the room is not found', async () => {
        const code = 'invalidCode';
        const userId = 'user123';

        roomService.joinRoom.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/rooms/join')
            .send({ code, userId });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'Room not found' });
    });

    it('should return 500 for an internal server error', async () => {
        const code = 'watchPartyCode123';
        const userId = 'user123';
        const errorMessage = 'Internal server error';

        roomService.joinRoom.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/rooms/join')
            .send({ code, userId });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
});
