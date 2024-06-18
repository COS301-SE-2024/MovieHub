// backend/src/__tests__/watchlist.test.js
const request = require('supertest');
const express = require('express');
const watchlistRouter = require('../Watchlist/list.router');

const app = express();
app.use(express.json());
app.use('/list', watchlistRouter);

describe('Watchlist API', () => {
    describe('POST /list/:userid', () => {
        it('should create a new watchlist', async () => {
            const userId = 'test-user-id';
            const watchlistDetails = {
                name: 'My Watchlist',
                tags: ['tag1', 'tag2'],
                visibility: 'public',
                ranked: true,
                description: 'My favorite movies',
                collaborative: false,
                movies: ['Inception', 'Interstellar']
            };

            const res = await request(app)
                .post(`/list/${userId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name', watchlistDetails.name);
            expect(res.body).toHaveProperty('movies');
            expect(res.body.movies).toHaveLength(2);
        });

        it('should handle TMDB API failure', async () => {
            const userId = 'test-user-id';
            const watchlistDetails = {
                name: 'My Watchlist',
                tags: ['tag1', 'tag2'],
                visibility: 'public',
                ranked: true,
                description: 'My favorite movies',
                collaborative: false,
                movies: ['Inception', 'Interstellar']
            };

            // Simulate a failure by sending invalid movie names or other conditions

            const res = await request(app)
                .post(`/list/${userId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'TMDB API failure');
        });

        it('should handle server error during watchlist creation', async () => {
            const userId = 'test-user-id';
            const watchlistDetails = {
                name: 'My Watchlist',
                tags: ['tag1', 'tag2'],
                visibility: 'public',
                ranked: true,
                description: 'My favorite movies',
                collaborative: false,
                movies: ['Inception', 'Interstellar']
            };

            // Simulate server error by sending invalid request data or other conditions

            const res = await request(app)
                .post(`/list/${userId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Server error');
        });
    });

    describe('PUT /list/:watchlistId', () => {
        it('should modify an existing watchlist', async () => {
            const userId = 'test-user-id';
            const watchlistId = 'test-watchlist-id';
            const watchlistDetails = {
                name: 'Updated Watchlist',
                tags: ['updated-tag1', 'updated-tag2'],
                visibility: 'private',
                ranked: false,
                description: 'Updated description',
                collaborative: true,
                movies: ['Matrix', 'Avatar']
            };

            const res = await request(app)
                .put(`/list/${userId}/${watchlistId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', watchlistId);
            expect(res.body).toHaveProperty('name', watchlistDetails.name);
            expect(res.body).toHaveProperty('movies');
            expect(res.body.movies).toHaveLength(2);
        });

        it('should handle TMDB API failure during modification', async () => {
            const userId = 'test-user-id';
            const watchlistId = 'test-watchlist-id';
            const watchlistDetails = {
                name: 'Updated Watchlist',
                tags: ['updated-tag1', 'updated-tag2'],
                visibility: 'private',
                ranked: false,
                description: 'Updated description',
                collaborative: true,
                movies: ['Matrix', 'Avatar']
            };

            // Simulate a failure by sending invalid movie names or other conditions

            const res = await request(app)
                .put(`/list/${userId}/${watchlistId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'TMDB API failure');
        });

        it('should handle server error during watchlist modification', async () => {
            const userId = 'test-user-id';
            const watchlistId = 'test-watchlist-id';
            const watchlistDetails = {
                name: 'Updated Watchlist',
                tags: ['updated-tag1', 'updated-tag2'],
                visibility: 'private',
                ranked: false,
                description: 'Updated description',
                collaborative: true,
                movies: ['Matrix', 'Avatar']
            };

            // Simulate server error by sending invalid request data or other conditions

            const res = await request(app)
                .put(`/list/${userId}/${watchlistId}`)
                .send(watchlistDetails);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Server error');
        });
    });

    describe('DELETE /list/:userId/:watchlistId', () => {
        it('should delete an existing watchlist', async () => {
            const userId = 'test-user-id';
            const watchlistId = 'test-watchlist-id';

            const res = await request(app)
                .delete(`/list/${userId}/${watchlistId}`);

            expect(res.status).toBe(204);
        });

        it('should handle server error during watchlist deletion', async () => {
            const userId = 'test-user-id';
            const watchlistId = 'test-watchlist-id';

            // Simulate server error by sending invalid request data or other conditions

            const res = await request(app)
                .delete(`/list/${userId}/${watchlistId}`);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Server error');
        });
    });
});
