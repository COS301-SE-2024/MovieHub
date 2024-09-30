// backend/src/notification/notification.controller.test.js
const { markNotificationAsRead, deleteNotification, clearNotifications } = require('../Notifications/notification.controller');
const notificationService = require('../Notifications/notification.service');

jest.mock('../Notifications/notification.service');

describe('Notification Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { userId: 'user123', type: 'general', notificationId: 'notif123' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('markNotificationAsRead', () => {
        it('should mark notification as read successfully', async () => {
            notificationService.markNotificationAsRead.mockResolvedValueOnce();

            await markNotificationAsRead(req, res);

            expect(notificationService.markNotificationAsRead).toHaveBeenCalledWith('user123', 'general', 'notif123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Notification marked as read' });
        });

        it('should handle errors while marking notification as read', async () => {
            const error = new Error('Internal error');
            notificationService.markNotificationAsRead.mockRejectedValueOnce(error);

            await markNotificationAsRead(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('deleteNotification', () => {
        it('should delete a notification successfully', async () => {
            notificationService.deleteNotification.mockResolvedValueOnce();

            await deleteNotification(req, res);

            expect(notificationService.deleteNotification).toHaveBeenCalledWith('user123', 'general', 'notif123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Notification deleted' });
        });

        it('should handle errors while deleting a notification', async () => {
            const error = new Error('Internal error');
            notificationService.deleteNotification.mockRejectedValueOnce(error);

            await deleteNotification(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('clearNotifications', () => {
        it('should clear all notifications of a type successfully', async () => {
            notificationService.clearNotifications.mockResolvedValueOnce();

            req.params.notificationId = undefined;  // Remove notificationId since it's not needed for this test
            await clearNotifications(req, res);

            expect(notificationService.clearNotifications).toHaveBeenCalledWith('user123', 'general');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'All notifications cleared' });
        });

        it('should handle errors while clearing notifications', async () => {
            const error = new Error('Internal error');
            notificationService.clearNotifications.mockRejectedValueOnce(error);

            await clearNotifications(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
