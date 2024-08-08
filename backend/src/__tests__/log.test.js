const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const logRouter = require('../Log/log.router');
const logService = require('../Log/log.services');

dotenv.config();

// Create an instance of the app with the logRouter
const app = express();
app.use(express.json());
app.use('/log', logRouter);

jest.mock('../Log/log.services');

describe('POST /log/add', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a log successfully', async () => {
        const logData = { uid: 'testUser', movieId: 'testMovie', date: '2024-08-07' };
        const addedLog = { ...logData, logId: 'testLogId' };

        logService.addLog.mockResolvedValueOnce(addedLog);

        const res = await request(app)
            .post('/log/add')
            .send(logData);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Log added successfully', data: addedLog });
    });

    it('should return 400 if adding log fails', async () => {
        const logData = { uid: 'testUser', movieId: 'testMovie', date: '2024-08-07' };

        logService.addLog.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/log/add')
            .send(logData);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error adding log' });
    });

    it('should return 500 for an internal server error', async () => {
        const logData = { uid: 'testUser', movieId: 'testMovie', date: '2024-08-07' };
        const errorMessage = 'Internal server error';

        logService.addLog.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/log/add')
            .send(logData);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('PUT /log/edit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update log successfully', async () => {
        const logData = { uid: 'testUser', logId: 'testLogId', date: '2024-08-08', description: 'Updated description' };
        const updatedLog = { ...logData };

        logService.editLog.mockResolvedValueOnce(updatedLog);

        const res = await request(app)
            .put('/log/edit')
            .send(logData);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Log updated successfully', data: updatedLog });
    });

    it('should return 400 if updating log fails', async () => {
        const logData = { uid: 'testUser', logId: 'testLogId', date: '2024-08-08', description: 'Updated description' };

        logService.editLog.mockResolvedValueOnce(null);

        const res = await request(app)
            .put('/log/edit')
            .send(logData);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error updating log' });
    });

    it('should return 500 for an internal server error', async () => {
        const logData = { uid: 'testUser', logId: 'testLogId', date: '2024-08-08', description: 'Updated description' };
        const errorMessage = 'Internal server error';

        logService.editLog.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .put('/log/edit')
            .send(logData);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('DELETE /log/remove', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should remove log successfully', async () => {
        const logData = { uid: 'testUser', logId: 'testLogId' };

        logService.removeLog.mockResolvedValueOnce(true);

        const res = await request(app)
            .delete('/log/remove')
            .send(logData);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Log removed successfully', data: null });
    });

    it('should return 400 if removing log fails', async () => {
        const logData = { uid: 'testUser', logId: 'testLogId' };

        logService.removeLog.mockResolvedValueOnce(false);

        const res = await request(app)
            .delete('/log/remove')
            .send(logData);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error removing log' });
    });

    it('should return 500 for an internal server error', async () => {
        const logData = { uid: 'testUser', logId: 'testLogId' };
        const errorMessage = 'Internal server error';

        logService.removeLog.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .delete('/log/remove')
            .send(logData);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /log/:uid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return logs for a valid user ID', async () => {
        const uid = 'testUser';
        const logs = [{ logId: 'testLogId1', date: '2024-08-07', description: 'First log' }];

        logService.getLogsOfUser.mockResolvedValueOnce(logs);

        const res = await request(app)
            .get(`/log/${uid}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Logs fetched successfully', data: logs });
    });

    it('should return 400 if fetching logs fails', async () => {
        const uid = 'testUser';

        logService.getLogsOfUser.mockResolvedValueOnce(null);

        const res = await request(app)
            .get(`/log/${uid}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching logs' });
    });

    it('should return 500 for an internal server error', async () => {
        const uid = 'testUser';
        const errorMessage = 'Internal server error';

        logService.getLogsOfUser.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .get(`/log/${uid}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});
