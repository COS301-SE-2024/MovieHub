const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('../Users/users.router');
const userService = require('../Users/users.services');

dotenv.config();

// Create an instance of the app with the userRouter
const app = express();
app.use(express.json());
app.use('/users', userRouter);

jest.mock('../Users/users.services');

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


describe('PATCH /users/:userId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update user profile for a valid user ID', async () => {
        const userId = 'user1';
        const userUpdate = { name: 'Jane Doe' };
        const updatedUser = { id: 'user1', name: 'Jane Doe' };

        userService.updateUserProfile.mockResolvedValueOnce(updatedUser);

        const res = await request(app)
            .patch(`/users/${userId}`)
            .send(userUpdate);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedUser);
    });

    it('should return 404 for an invalid user ID', async () => {
        const userId = 'invalidUser';
        const userUpdate = { name: 'Jane Doe' };

        userService.updateUserProfile.mockResolvedValueOnce(null);

        const res = await request(app)
            .patch(`/users/${userId}`)
            .send(userUpdate);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 for an internal server error', async () => {
        const userId = 'user1';
        const userUpdate = { name: 'Jackie' };
        const errorMessage = 'Internal server error';

        userService.updateUserProfile.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .patch(`/users/${userId}`)
            .send(userUpdate);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('DELETE /users/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete user profile for a valid user ID', async () => {
        const userId = 'temp_user';

        userService.deleteUserProfile.mockResolvedValueOnce(true);

        const res = await request(app)
            .delete(`/users/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'User deleted successfully' });
    });

    it('should return 404 for an invalid user ID', async () => {
        const userId = 'invalidUser';

        userService.deleteUserProfile.mockResolvedValueOnce(false);

        const res = await request(app)
            .delete(`/users/${userId}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 for an internal server error', async () => {
        const userId = 'user1';
        const errorMessage = 'Internal server error';

        userService.deleteUserProfile.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .delete(`/users/${userId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Error deleting user profile', error: errorMessage });
    });
});

describe('GET /users/:id/watchlists', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return watchlists for a valid user ID', async () => {
        const userId = 'tempUser';
        const watchlists = { id: 'tempUser', name: 'My Watchlist' };

        userService.getUserWatchlists.mockResolvedValueOnce(watchlists);

        const res = await request(app).get(`/users/${userId}/watchlists`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(watchlists);
    });

    it('should return 404 for an invalid user ID', async () => {
        const userId = 'invalidUser';

        userService.getUserWatchlists.mockResolvedValueOnce(null);

        const res = await request(app).get(`/users/${userId}/watchlists`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 for an internal server error', async () => {
        const userId = 'tempUser';
        const errorMessage = 'Internal server error';

        userService.getUserWatchlists.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/users/${userId}/watchlists`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /users/follow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should follow a user with valid follower and followee IDs', async () => {
        const followerId = 'follower';
        const followeeId = 'followee';
        const response = { success: true };

        userService.followUser.mockResolvedValueOnce(response);

        const res = await request(app)
            .post('/users/follow')
            .send({ followerId, followeeId });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(response);
    });

    it('should return 400 for missing follower or followee ID', async () => {
        const res = await request(app)
            .post('/users/follow')
            .send({ followerId: 'follower' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Follower ID and Followee ID are required' });
    });

    it('should return 500 for an internal server error', async () => {
        const followerId = 'follower';
        const followeeId = 'followee';
        const errorMessage = 'Error following user';

        userService.followUser.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/users/follow')
            .send({ followerId, followeeId });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Error following user', error: errorMessage });
    });
});

describe('POST /users/unfollow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should unfollow a user with valid follower and followee IDs', async () => {
        const followerId = 'follower';
        const followeeId = 'followee';
        const response = { success: true };

        userService.unfollowUser.mockResolvedValueOnce(response);

        const res = await request(app)
            .post('/users/unfollow')
            .send({ followerId, followeeId });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(response);
    });

    it('should return 400 for missing follower or followee ID', async () => {
        const res = await request(app)
            .post('/users/unfollow')
            .send({ followerId: 'follower' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Follower ID and Followee ID are required' });
    });

    it('should return 500 for an internal server error', async () => {
        const followerId = 'follower';
        const followeeId = 'followee';
        const errorMessage = 'Error unfollowing user';

        userService.unfollowUser.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/users/unfollow')
            .send({ followerId, followeeId });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Error unfollowing user', error: errorMessage });
    });
});

describe('GET /users/friends/:userId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return friends for a valid user ID', async () => {
        const userId = 'tempUser';
        const friends = [{ id: 'friend1', name: 'Friend One' }];

        userService.getFriends.mockResolvedValueOnce(friends);

        const res = await request(app).get(`/users/friends/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(friends);
    });

    it('should return 404 for an invalid user ID', async () => {
        const userId = 'invalidUser';

        userService.getFriends.mockResolvedValueOnce(null);

        const res = await request(app).get(`/users/friends/${userId}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 for an internal server error', async () => {
        const userId = 'tempUser';
        const errorMessage = 'Error fetching friends';

        userService.getFriends.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/users/friends/${userId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Error fetching friends', error: errorMessage });
    });
});