const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const postController = require('../Post/post.controller');
const postService = require('../Post/post.services'); // Mock this service

const app = express();
app.use(bodyParser.json());

app.post('/posts', postController.addPost);
app.post('/posts/comments', postController.addCommentToPost);
app.post('/comments/replies', postController.addCommentToComment);
app.put('/posts', postController.editPost);
app.put('/comments', postController.editComment);
app.delete('/posts', postController.removePost);
app.delete('/comments', postController.removeComment);
app.get('/movies/:movieId/posts', postController.getPostsOfMovie);
app.get('/movies/:movieId/reviews', postController.getReviewsOfMovie);
app.get('/posts/:post/comments', postController.getCommentsOfPost);
app.get('/users/:userId/posts', postController.getPostsOfUser);
app.get('/users/:userId/reviews', postController.getReviewsOfUser);
app.get('/users/:userId/comments', postController.getCommentsOfUser);

// Mock postService to return expected results
jest.mock('./post.services', () => ({
    addPost: jest.fn(),
    addCommentToPost: jest.fn(),
    addCommentToComment: jest.fn(),
    editPost: jest.fn(),
    editComment: jest.fn(),
    removePost: jest.fn(),
    removeComment: jest.fn(),
    getPostsOfMovie: jest.fn(),
    getReviewsOfMovie: jest.fn(),
    getCommentsOfPost: jest.fn(),
    getPostsOfUser: jest.fn(),
    getReviewsOfUser: jest.fn(),
    getCommentsOfUser: jest.fn(),
}));

describe('Post Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for adding a post
    it('should add a post', async () => {
        const mockPost = { id: '123', text: 'Sample post' };
        postService.addPost.mockResolvedValue(mockPost);

        const response = await request(app)
            .post('/posts')
            .send({ userId: 'user1', movieId: 'movie1', text: 'Sample post', isReview: false, rating: 4 });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Post added successfully');
        expect(response.body.data).toEqual(mockPost);
    });

    // Test for adding a comment to a post
    it('should add a comment to a post', async () => {
        const mockComment = { id: '456', text: 'Sample comment' };
        postService.addCommentToPost.mockResolvedValue(mockComment);

        const response = await request(app)
            .post('/posts/comments')
            .send({ userId: 'user1', postId: 'post1', text: 'Sample comment' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Comment added successfully');
        expect(response.body.data).toEqual(mockComment);
    });

    // Add more tests for other functions following the same pattern...

    // Test for fetching posts of a movie
    it('should fetch posts of a movie', async () => {
        const mockPosts = [{ id: '789', text: 'Movie post' }];
        postService.getPostsOfMovie.mockResolvedValue(mockPosts);

        const response = await request(app)
            .get('/movies/movie1/posts');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Posts fetched successfully');
        expect(response.body.data).toEqual(mockPosts);
    });

    // Test for deleting a post
    it('should delete a post', async () => {
        postService.removePost.mockResolvedValue();

        const response = await request(app)
            .delete('/posts')
            .send({ postId: 'post1' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Post removed successfully');
    });

    // Add more tests for editPost, editComment, removeComment, getReviewsOfMovie, etc.
});
