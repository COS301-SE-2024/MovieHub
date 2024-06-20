// backend/src/__tests__/likes.test.js
const request = require('supertest');
const express = require('express');
const likesRouter = require('../Likes/likes.router');

const app = express();
app.use(express.json());
app.use('/likes', likesRouter);

describe('Likes API', () => {
    describe('POST /likes/toggleLikeReview', () => {
        it('should toggle like for a review', async () => {
            const toggleLikeReviewData = {
                userId: 'test-user-id',
                reviewId: 'test-review-id'
            };

            const res = await request(app)
                .post('/likes/toggleLikeReview')
                .send(toggleLikeReviewData);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');
        });

        it('should handle server error during review like toggling', async () => {
            const toggleLikeReviewData = {
                userId: 'invalid-user-id',
                reviewId: 'invalid-review-id'
            };

            const res = await request(app)
                .post('/likes/toggleLikeReview')
                .send(toggleLikeReviewData);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /likes/toggleLikeComment', () => {
        it('should toggle like for a comment', async () => {
            const toggleLikeCommentData = {
                userId: 'test-user-id',
                commentId: 'test-comment-id'
            };

            const res = await request(app)
                .post('/likes/toggleLikeComment')
                .send(toggleLikeCommentData);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');
        });

        it('should handle server error during comment like toggling', async () => {
            const toggleLikeCommentData = {
                userId: 'invalid-user-id',
                commentId: 'invalid-comment-id'
            };

            const res = await request(app)
                .post('/likes/toggleLikeComment')
                .send(toggleLikeCommentData);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /likes/toggleLikeMovie', () => {
        it('should toggle like for a movie', async () => {
            const toggleLikeMovieData = {
                userId: 'test-user-id',
                movieId: 'test-movie-id'
            };

            const res = await request(app)
                .post('/likes/toggleLikeMovie')
                .send(toggleLikeMovieData);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');
        });

        it('should handle server error during movie like toggling', async () => {
            const toggleLikeMovieData = {
                userId: 'invalid-user-id',
                movieId: 'invalid-movie-id'
            };

            const res = await request(app)
                .post('/likes/toggleLikeMovie')
                .send(toggleLikeMovieData);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });
});
