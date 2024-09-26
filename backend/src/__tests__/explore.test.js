const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const exploreRouter = require('../Explore/explore.router');
const exploreService = require('../Explore/explore.service');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/explore', exploreRouter);

jest.mock('../Explore/explore.service');
describe('Explore API', () => {

    describe('GET /explore/friends-content', () => {
        it('should fetch friends content successfully', async () => {
            const mockContent = { posts: [], reviews: [] };
            exploreService.fetchFriendsContent.mockResolvedValueOnce(mockContent);

            const res = await request(app)
                .get('/explore/friends-content')
                .set('x-user-id', 'userId'); // Set mock user ID

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockContent);
        });

        it('should return 400 if user ID is not provided', async () => {
            const res = await request(app)
                .get('/explore/friends-content');

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'User ID not provided' });
        });

        it('should return 500 if fetching friends content fails', async () => {
            exploreService.fetchFriendsContent.mockRejectedValueOnce(new Error('Failed to fetch friends content'));

            const res = await request(app)
                .get('/explore/friends-content')
                .set('x-user-id', 'userId');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch friends\' content' });
        });
    });

    describe('GET /explore/friends-of-friends-content', () => {
        it('should fetch friends of friends content successfully', async () => {
            const mockContent = [{ fof: {}, post: {}, review: {}, movie: {} }];
            exploreService.fetchFriendsOfFriendsContent.mockResolvedValueOnce(mockContent);

            const res = await request(app)
                .get('/explore/friends-of-friends-content')
                .set('x-user-id', 'userId');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockContent);
        });

        it('should return 400 if user ID is not provided', async () => {
            const res = await request(app)
                .get('/explore/friends-of-friends-content');

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'User ID not provided' });
        });

        it('should return 500 if fetching friends of friends content fails', async () => {
            exploreService.fetchFriendsOfFriendsContent.mockRejectedValueOnce(new Error('Failed to fetch friends of friends content'));

            const res = await request(app)
                .get('/explore/friends-of-friends-content')
                .set('x-user-id', 'userId');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch friends of friends\' content' });
        });
    });

    describe('GET /explore/random-users-content', () => {
        it('should fetch random users content successfully', async () => {
            const mockContent = [{ user: {}, post: {} }];
            exploreService.fetchRandomUsersContent.mockResolvedValueOnce(mockContent);

            const res = await request(app)
                .get('/explore/random-users-content')
                .set('x-user-id', 'userId');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockContent);
        });

        it('should return 500 if fetching random users content fails', async () => {
            exploreService.fetchRandomUsersContent.mockRejectedValueOnce(new Error('Failed to fetch random users content'));

            const res = await request(app)
                .get('/explore/random-users-content')
                .set('x-user-id', 'userId');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch random users\' content' });
        });
    });

    describe('GET /explore/find-users', () => {
        it('should find users successfully', async () => {
            const mockUsers = [{ uid: 'uid', username: 'username' }];
            exploreService.findOtherUsers.mockResolvedValueOnce(mockUsers);

            const res = await request(app)
                .get('/explore/find-users')
                .set('x-user-id', 'userId');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUsers);
        });

        it('should return 400 if user ID is not provided', async () => {
            const res = await request(app)
                .get('/explore/find-users');

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'User ID not provided' });
        });

        it('should return 500 if finding users fails', async () => {
            exploreService.findOtherUsers.mockRejectedValueOnce(new Error('Failed to find users'));

            const res = await request(app)
                .get('/explore/find-users')
                .set('x-user-id', 'userId');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to find users' });
        });
    });

    describe('GET /explore/latest-posts', () => {
        it('should fetch latest posts successfully', async () => {
            const mockPosts = [{ user: {}, post: {} }];
            exploreService.fetchLatestPosts.mockResolvedValueOnce(mockPosts);

            const res = await request(app)
                .get('/explore/latest-posts');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockPosts);
        });

        it('should return 500 if fetching latest posts fails', async () => {
            exploreService.fetchLatestPosts.mockRejectedValueOnce(new Error('Failed to fetch latest posts'));

            const res = await request(app)
                .get('/explore/latest-posts');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch latest posts' });
        });
    });

    describe('GET /explore/top-reviews', () => {
        it('should fetch top reviews successfully', async () => {
            const mockReviews = [{ review: {}, user: {}, movie: {} }];
            exploreService.fetchTopReviews.mockResolvedValueOnce(mockReviews);

            const res = await request(app)
                .get('/explore/top-reviews');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockReviews);
        });

        it('should return 500 if fetching top reviews fails', async () => {
            exploreService.fetchTopReviews.mockRejectedValueOnce(new Error('Failed to fetch top reviews'));

            const res = await request(app)
                .get('/explore/top-reviews');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch top reviews' });
        });
    });

});
