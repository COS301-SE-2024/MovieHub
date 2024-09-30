const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const roomRouter = require('../Room/room.router');
const roomService = require('../Room/room.service');

dotenv.config();

// Create an instance of the app with the roomRouter
const app = express();
app.use(express.json());
app.use('/room', roomRouter);

jest.mock('../Room/room.service');

describe('POST /room/create/:uid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a room successfully', async () => {
        const uid = 'testUser';
        const roomData = { name: 'Test Room' };
        const createdRoom = { roomId: 'testRoomId', name: 'Test Room', creator: uid };

        roomService.createRoom.mockResolvedValueOnce(createdRoom);

        const res = await request(app)
            .post(`/room/create/${uid}`)
            .send(roomData);

        expect(res.status).toBe(201);
        expect(res.body).toEqual(createdRoom);
    });

    it('should return 500 if room creation fails', async () => {
        const uid = 'testUser';
        const roomData = { name: 'Test Room' };
        const errorMessage = 'Internal server error';

        roomService.createRoom.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post(`/room/create/${uid}`)
            .send(roomData);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: errorMessage });
    });
});

describe('GET /room/:roomId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get room details successfully', async () => {
        const roomId = 'testRoomId';
        const roomDetails = { roomId: 'testRoomId', name: 'Test Room' };

        roomService.getRoomDetails.mockResolvedValueOnce({ success: true, ...roomDetails });

        const res = await request(app)
            .get(`/room/${roomId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, ...roomDetails });
    });

    it('should return 404 if room is not found', async () => {
        const roomId = 'nonExistentRoomId';

        roomService.getRoomDetails.mockResolvedValueOnce({ success: false, message: 'Room not found' });

        const res = await request(app)
            .get(`/room/${roomId}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ success: false, message: 'Room not found' });
    });

    it('should return 500 for an internal server error', async () => {
        const roomId = 'testRoomId';
        const errorMessage = 'Internal server error';

        roomService.getRoomDetails.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .get(`/room/${roomId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ success: false, message: 'Internal server error' });
    });
});

describe('GET /room/:roomId/participants', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get room participants successfully', async () => {
        const roomId = 'testRoomId';
        const participants = ['user1', 'user2'];
        const creator = 'testCreator';

        roomService.getRoomParticipants.mockResolvedValueOnce({ success: true, participants, creator });

        const res = await request(app)
            .get(`/room/${roomId}/participants`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, participants, creator });
    });

    it('should return 404 if room participants are not found', async () => {
        const roomId = 'nonExistentRoomId';

        roomService.getRoomParticipants.mockResolvedValueOnce({ success: false, message: 'Participants not found' });

        const res = await request(app)
            .get(`/room/${roomId}/participants`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ success: false, message: 'Participants not found' });
    });

    it('should return 500 for an internal server error', async () => {
        const roomId = 'testRoomId';
        const errorMessage = 'Internal server error';

        roomService.getRoomParticipants.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .get(`/room/${roomId}/participants`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ success: false, message: 'An error occurred while retrieving room participants.' });
    });
});

describe('POST /room/join', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should join a room successfully', async () => {
        const roomData = { code: 'testRoomCode', uid: 'testUser' };
        const result = { success: true, roomId: 'testRoomId' };

        roomService.joinRoom.mockResolvedValueOnce(result);

        const res = await request(app)
            .post('/room/join')
            .send(roomData);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ roomId: 'testRoomId' });
    });

    it('should return 400 if joining room fails', async () => {
        const roomData = { code: 'testRoomCode', uid: 'testUser' };
        const result = { success: false, message: 'Invalid code' };

        roomService.joinRoom.mockResolvedValueOnce(result);

        const res = await request(app)
            .post('/room/join')
            .send(roomData);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid code' });
    });

    it('should return 500 for an internal server error', async () => {
        const roomData = { code: 'testRoomCode', uid: 'testUser' };
        const errorMessage = 'Internal server error';

        roomService.joinRoom.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/room/join')
            .send(roomData);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
});
