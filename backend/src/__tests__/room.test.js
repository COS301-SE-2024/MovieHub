const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const roomRouter = require('../Room/room.router');
const roomService = require('../Room/room.service');
const { error } = require('neo4j-driver');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/rooms', roomRouter);

jest.mock('../Room/room.service');

describe('Room API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /rooms/create/:userId', () => {
        it('should create a room and return the room details', async () => {
            const userId = 'validUserId';
            const roomData = { name: 'New Room' };
            const createdRoom = { id: 'roomId', ...roomData };

            roomService.createRoom.mockResolvedValueOnce(createdRoom);

            const res = await request(app)
                .post(`/rooms/create/${userId}`)
                .send(roomData);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(createdRoom);
        });

        it('should return 500 if room creation fails', async () => {
            const userId = 'validUserId';
            const roomData = { name: 'New Room' };
            const errorMessage = 'Internal Server Error';

            roomService.createRoom.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .post(`/rooms/create/${userId}`)
                .send(roomData);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /rooms/join', () => {
        it('should join a room and return the room ID', async () => {
            const requestBody = { code: 'roomCode', userId: 'validUserId' };
            const result = { success: true, roomId: 'roomId' };

            roomService.joinRoom.mockResolvedValueOnce(result);

            const res = await request(app)
                .post('/rooms/join')
                .send(requestBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ roomId: result.roomId });
        });

        it('should return 400 if joining the room fails', async () => {
            const requestBody = { code: 'roomCode', userId: 'validUserId' };
            const result = { success: false, message: 'Join room failed' };

            roomService.joinRoom.mockResolvedValueOnce(result);

            const res = await request(app)
                .post('/rooms/join')
                .send(requestBody);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: result.message });
        });

        it('should return 500 for an internal server error', async () => {
            const requestBody = { code: 'roomCode', userId: 'validUserId' };
            const errorMessage = 'Internal Server Error';

            roomService.joinRoom.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .post('/rooms/join')
                .send(requestBody);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /rooms/invite', () => {
        it('should invite a user to a room', async () => {
            const requestBody = { adminId: 'adminId', userId: 'validUserId', roomId: 'roomId' };

            roomService.inviteUserToRoom.mockResolvedValueOnce();

            const res = await request(app)
                .post('/rooms/invite')
                .send(requestBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: `User ${requestBody.userId} invited to room ${requestBody.roomId}` });
        });

        it('should return 500 if inviting a user fails', async () => {
            const requestBody = { adminId: 'adminId', userId: 'validUserId', roomId: 'roomId' };
            const errorMessage = 'Internal Server Error';

            roomService.inviteUserToRoom.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .post('/rooms/invite')
                .send(requestBody);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /rooms/decline', () => {
        it('should decline a room invite', async () => {
            const requestBody = { userId: 'validUserId', roomId: 'roomId' };

            roomService.declineRoomInvite.mockResolvedValueOnce();

            const res = await request(app)
                .post('/rooms/decline')
                .send(requestBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: `User ${requestBody.userId} declined invite to room ${requestBody.roomId}` });
        });

        it('should return 500 if declining an invite fails', async () => {
            const requestBody = { userId: 'validUserId', roomId: 'roomId' };
            const errorMessage = 'Internal Server Error';

            roomService.declineRoomInvite.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .post('/rooms/decline')
                .send(requestBody);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /rooms/leave', () => {
        it('should allow a user to leave a room', async () => {
            const requestBody = { roomId: 'roomId', userId: 'validUserId' };

            roomService.leaveRoom.mockResolvedValueOnce();

            const res = await request(app)
                .post('/rooms/leave')
                .send(requestBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: `User ${requestBody.userId} left the room ${requestBody.roomId}.` });
        });

        it('should return 500 if leaving the room fails', async () => {
            const requestBody = { roomId: 'roomId', userId: 'validUserId' };
            const errorMessage = 'Internal Server Error';

            roomService.leaveRoom.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .post('/rooms/leave')
                .send(requestBody);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /rooms/kick', () => {
        it('should kick a user from a room', async () => {
            const requestBody = { roomId: 'roomId', adminId: 'adminId', userId: 'validUserId' };
            const result = { success: true, message: 'User kicked successfully' };

            roomService.kickUserFromRoom.mockResolvedValueOnce(result);

            const res = await request(app)
                .post('/rooms/kick')
                .send(requestBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: result.message });
        });

        it('should return 403 if kicking the user fails due to insufficient permissions', async () => {
            const requestBody = { roomId: 'roomId', adminId: 'adminId', userId: 'validUserId' };
            const result = { success: false, message: 'Insufficient permissions' };

            roomService.kickUserFromRoom.mockResolvedValueOnce(result);

            const res = await request(app)
                .post('/rooms/kick')
                .send(requestBody);

            expect(res.status).toBe(403);
            expect(res.body).toEqual({ error: result.message });
        });

        it('should return 500 for an internal server error', async () => {
            const requestBody = { roomId: 'roomId', adminId: 'adminId', userId: 'validUserId' };
            const errorMessage = 'Internal Server Error';

            roomService.kickUserFromRoom.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .post('/rooms/kick')
                .send(requestBody);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /rooms/message', () => {
        it('should add a message to a room', async () => {
            const requestBody = { roomId: 'roomId', userId: 'validUserId', message: 'Hello, world!' };

            roomService.addMessageToRoom.mockResolvedValueOnce();

            const res = await request(app)
                .post('/rooms/message')
                .send(requestBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ message: 'Message sent' });
        });

        it('should return 500 if adding a message fails', async () => {
            const requestBody = { roomId: 'roomId', userId: 'validUserId', message: 'Hello, world!' };
            const errorMessage = 'Internal Server Error';

            roomService.addMessageToRoom.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .post('/rooms/message')
                .send(requestBody);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('GET /rooms/messages/:roomId', () => {
        it('should retrieve messages from a room', async () => {
            const roomId = 'roomId';
            const messages = [{ userId: 'user1', message: 'Hello' }];

            roomService.getMessagesFromRoom.mockResolvedValueOnce(messages);

            const res = await request(app)
                .get(`/rooms/messages/${roomId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(messages);
        });

        it('should return 500 if retrieving messages fails', async () => {
            const roomId = 'roomId';
            const errorMessage = 'Internal Server Error';

            roomService.getMessagesFromRoom.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .get(`/rooms/messages/${roomId}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('GET /rooms/listen/:roomId', () => {
        it('should listen for messages in a room', async () => {
            const roomId = 'roomId';
            const messages = [{ userId: 'user1', message: 'Hello' }];

            roomService.listenForMessages.mockImplementationOnce((roomId, callback) => {
                callback(messages);
            });

            const res = await request(app)
                .get(`/rooms/listen/${roomId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(messages);
        });

        it('should return 500 if listening for messages fails', async () => {
            const roomId = 'roomId';
            const errorMessage = 'Internal Server Error';

            roomService.listenForMessages.mockImplementationOnce(() => {
                throw new Error(errorMessage);
            });

            const res = await request(app)
                .get(`/rooms/listen/${roomId}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /rooms/notify', () => {
        it('should send a notification to users in a room', async () => {
            const requestBody = { roomId: 'roomId', message: 'Notification message' };

            roomService.sendNotificationToUsers.mockResolvedValueOnce();

            const res = await request(app)
                .post('/rooms/notify')
                .send(requestBody);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Notification sent successfully' });
        });

        it('should return 500 if sending a notification fails', async () => {
            const requestBody = { roomId: 'roomId', message: 'Notification message' };
            const errorMessage = 'Internal Server Error';

            roomService.sendNotificationToUsers.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .post('/rooms/notify')
                .send(requestBody);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });
});
