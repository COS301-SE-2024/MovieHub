const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const likesRouter = require('../Likes/likes.router');
const likesService = require('../Likes/likes.services');
const responseHandler = require('../utils/responseHandler');

dotenv.config();

// Create an instance of the app with the likesRouter
const app = express();
app.use(express.json());
app.use('/likes', likesRouter);

jest.mock('../Likes/likes.services');
jest.mock('../utils/responseHandler');

describe('GET /likes/:userId/likes', () => {
    // it('should return likes for a valid user ID', async () => {
    //     const userId = 'validUserId';
    //     const userLikes = [{ id: 'like1' }, { id: 'like2' }];
        
    //     console.log('Mocking getLikesOfUser');
    //     likesService.getLikesOfUser.mockResolvedValueOnce(userLikes);

    //     console.log('Sending request');
    //     const res = await request(app).get(`/likes/${userId}/likes`);

    //     console.log('Asserting response');
    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Likes fetched successfully', userLikes);
    // });

    it('should return 400 if no likes found', async () => {
        const userId = 'validUserId';

        likesService.getLikesOfUser.mockResolvedValueOnce(null);

        const res = await request(app).get(`/likes/${userId}/likes`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching likes' });
    });

    it('should return 500 for an internal server error', async () => {
        const userId = 'validUserId';
        const errorMessage = 'Internal server error';

        likesService.getLikesOfUser.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/likes/${userId}/likes`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /likes/movie/:movieId', () => {
    // it('should return likes for a valid movie ID', async () => {
    //     const movieId = 'validMovieId';
    //     const movieLikes = [{ id: 'like1' }, { id: 'like2' }];

    //     likesService.getLikesOfMovie.mockResolvedValueOnce(movieLikes);

    //     const res = await request(app).get(`/likes/movie/${movieId}`);

    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Likes fetched successfully', movieLikes);
    // });

    it('should return 400 if no likes found', async () => {
        const movieId = 'validMovieId';

        likesService.getLikesOfMovie.mockResolvedValueOnce(null);

        const res = await request(app).get(`/likes/movie/${movieId}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching likes' });
    });

    it('should return 500 for an internal server error', async () => {
        const movieId = 'validMovieId';
        const errorMessage = 'Internal server error';

        likesService.getLikesOfMovie.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/likes/movie/${movieId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /likes/comment/:commentId', () => {
    // it('should return likes for a valid comment ID', async () => {
    //     const commentId = 'validCommentId';
    //     const commentLikes = [{ id: 'like1' }, { id: 'like2' }];

    //     likesService.getLikesOfComment.mockResolvedValueOnce(commentLikes);

    //     const res = await request(app).get(`/likes/comment/${commentId}`);

    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Likes fetched successfully', commentLikes);
    // });

    it('should return 400 if no likes found', async () => {
        const commentId = 'validCommentId';

        likesService.getLikesOfComment.mockResolvedValueOnce(null);

        const res = await request(app).get(`/likes/comment/${commentId}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching likes' });
    });

    it('should return 500 for an internal server error', async () => {
        const commentId = 'validCommentId';
        const errorMessage = 'Internal server error';

        likesService.getLikesOfComment.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/likes/comment/${commentId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /likes/review/:reviewId', () => {
    // it('should return likes for a valid review ID', async () => {
    //     const reviewId = 'validReviewId';
    //     const reviewLikes = [{ id: 'like1' }, { id: 'like2' }];

    //     likesService.getLikesOfReview.mockResolvedValueOnce(reviewLikes);

    //     const res = await request(app).get(`/likes/review/${reviewId}`);

    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Likes fetched successfully', reviewLikes);
    // });

    it('should return 400 if no likes found', async () => {
        const reviewId = 'validReviewId';

        likesService.getLikesOfReview.mockResolvedValueOnce(null);

        const res = await request(app).get(`/likes/review/${reviewId}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching likes' });
    });

    it('should return 500 for an internal server error', async () => {
        const reviewId = 'validReviewId';
        const errorMessage = 'Internal server error';

        likesService.getLikesOfReview.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/likes/review/${reviewId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /likes/post/:postId', () => {
    // it('should return likes for a valid post ID', async () => {
    //     const postId = 'validPostId';
    //     const postLikes = [{ id: 'like1' }, { id: 'like2' }];

    //     likesService.getLikesOfPost.mockResolvedValueOnce(postLikes);

    //     const res = await request(app).get(`/likes/post/${postId}`);

    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Likes fetched successfully', postLikes);
    // });

    it('should return 400 if no likes found', async () => {
        const postId = 'validPostId';

        likesService.getLikesOfPost.mockResolvedValueOnce(null);

        const res = await request(app).get(`/likes/post/${postId}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching likes' });
    });

    it('should return 500 for an internal server error', async () => {
        const postId = 'validPostId';
        const errorMessage = 'Internal server error';

        likesService.getLikesOfPost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/likes/post/${postId}`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /likes/toggleLikeReview', () => {
    // it('should toggle like for a valid review ID', async () => {
    //     const requestBody = { userId: 'validUserId', reviewId: 'validReviewId' };
    //     likesService.toggleLikeReview.mockResolvedValueOnce(true);

    //     const res = await request(app)
    //         .post('/likes/toggleLikeReview')
    //         .send(requestBody);

    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Review liked successfully');
    // });

    it('should return 400 if toggling like fails', async () => {
        const requestBody = { userId: 'validUserId', reviewId: 'validReviewId' };
        likesService.toggleLikeReview.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/likes/toggleLikeReview')
            .send(requestBody);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error toggling like' });
    });

    it('should return 500 for an internal server error', async () => {
        const requestBody = { userId: 'validUserId', reviewId: 'validReviewId' };
        const errorMessage = 'Internal server error';

        likesService.toggleLikeReview.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/likes/toggleLikeReview')
            .send(requestBody);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /likes/toggleLikeComment', () => {
    // it('should toggle like for a valid comment ID', async () => {
    //     const requestBody = { userId: 'validUserId', commentId: 'validCommentId' };
    //     likesService.toggleLikeComment.mockResolvedValueOnce(true);

    //     const res = await request(app)
    //         .post('/likes/toggleLikeComment')
    //         .send(requestBody);

    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Comment liked successfully');
    // });

    it('should return 400 if toggling like fails', async () => {
        const requestBody = { userId: 'validUserId', commentId: 'validCommentId' };
        likesService.toggleLikeComment.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/likes/toggleLikeComment')
            .send(requestBody);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error toggling like' });
    });

    it('should return 500 for an internal server error', async () => {
        const requestBody = { userId: 'validUserId', commentId: 'validCommentId' };
        const errorMessage = 'Internal server error';

        likesService.toggleLikeComment.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/likes/toggleLikeComment')
            .send(requestBody);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /likes/toggleLikeMovie', () => {
    // it('should toggle like for a valid movie ID', async () => {
    //     const requestBody = { userId: 'validUserId', movieId: 'validMovieId' };
    //     likesService.toggleLikeMovie.mockResolvedValueOnce(true);

    //     const res = await request(app)
    //         .post('/likes/toggleLikeMovie')
    //         .send(requestBody);

    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Movie liked successfully');
    // });

    it('should return 400 if toggling like fails', async () => {
        const requestBody = { userId: 'validUserId', movieId: 'validMovieId' };
        likesService.toggleLikeMovie.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/likes/toggleLikeMovie')
            .send(requestBody);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error toggling like' });
    });

    it('should return 500 for an internal server error', async () => {
        const requestBody = { userId: 'validUserId', movieId: 'validMovieId' };
        const errorMessage = 'Internal server error';

        likesService.toggleLikeMovie.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/likes/toggleLikeMovie')
            .send(requestBody);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /likes/toggleLikePost', () => {
    // it('should toggle like for a valid post ID', async () => {
    //     const requestBody = { userId: 'validUserId', postId: 'validPostId' };
    //     likesService.toggleLikePost.mockResolvedValueOnce(true);

    //     const res = await request(app)
    //         .post('/likes/toggleLikePost')
    //         .send(requestBody);

    //     expect(res.status).toBe(200);
    //     expect(responseHandler).toHaveBeenCalledWith(expect.any(Object), 200, 'Post liked successfully');
    // });

    it('should return 400 if toggling like fails', async () => {
        const requestBody = { userId: 'validUserId', postId: 'validPostId' };
        likesService.toggleLikePost.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/likes/toggleLikePost')
            .send(requestBody);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error toggling like' });
    });

    it('should return 500 for an internal server error', async () => {
        const requestBody = { userId: 'validUserId', postId: 'validPostId' };
        const errorMessage = 'Internal server error';

        likesService.toggleLikePost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .post('/likes/toggleLikePost')
            .send(requestBody);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});
