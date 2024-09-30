// backend/src/notification/notification.router.test.js
const request = require('supertest');
const express = require('express');
const notificationRouter = require('../Notifications/notification.router');
const notificationService = require('../Notifications/notification.service');

jest.mock('../Notifications/notification.service');

const app = express();
app.use(express.json());
app.use('/notifications', notificationRouter);

describe('Notification Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('PATCH /notifications/:userId/:type/:notificationId/read', () => {
        it('should mark a notification as read', async () => {
            const userId = 'user123';
            const type = 'general';
            const notificationId = 'notif123';

            notificationService.markNotificationAsRead.mockResolvedValueOnce();

            const res = await request(app)
                .patch(`/notifications/${userId}/${type}/${notificationId}/read`)
                .send();

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Notification marked as read' });
        });

        it('should return 500 for an internal server error', async () => {
            const userId = 'user123';
            const type = 'general';
            const notificationId = 'notif123';
            const errorMessage = 'Internal server error';

            notificationService.markNotificationAsRead.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .patch(`/notifications/${userId}/${type}/${notificationId}/read`)
                .send();

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('DELETE /notifications/:userId/:type/:notificationId', () => {
        it('should delete a notification', async () => {
            const userId = 'user123';
            const type = 'general';
            const notificationId = 'notif123';

            notificationService.deleteNotification.mockResolvedValueOnce();

            const res = await request(app)
                .delete(`/notifications/${userId}/${type}/${notificationId}`)
                .send();

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Notification deleted' });
        });

        it('should return 500 for an internal server error', async () => {
            const userId = 'user123';
            const type = 'general';
            const notificationId = 'notif123';
            const errorMessage = 'Internal server error';

            notificationService.deleteNotification.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .delete(`/notifications/${userId}/${type}/${notificationId}`)
                .send();

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });

    describe('DELETE /notifications/:userId/:type', () => {
        it('should clear all notifications of a specific type', async () => {
            const userId = 'user123';
            const type = 'general';

            notificationService.clearNotifications.mockResolvedValueOnce();

            const res = await request(app)
                .delete(`/notifications/${userId}/${type}`)
                .send();

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'All notifications cleared' });
        });

        it('should return 500 for an internal server error', async () => {
            const userId = 'user123';
            const type = 'general';
            const errorMessage = 'Internal server error';

            notificationService.clearNotifications.mockRejectedValueOnce(new Error(errorMessage));

            const res = await request(app)
                .delete(`/notifications/${userId}/${type}`)
                .send();

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });
});
