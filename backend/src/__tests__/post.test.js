const request = require('supertest');
const express = require('express');
const dotenv = require('dotenv');
const postRouter = require('../Post/post.router');
const postService = require('../Post/post.services');

dotenv.config();

// Create an instance of the app with the postRouter
const app = express();
app.use(express.json());
app.use('/posts', postRouter);

jest.mock('../Post/post.services');

describe('POST /posts/add', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new post', async () => {
        const newPost = { userId: '1', movieId: '1', text: 'Great movie!', postTitle: 'My Review', img: 'image.jpg' };
        const addedPost = { ...newPost, id: '1' };

        postService.addPost.mockResolvedValueOnce(addedPost);

        const res = await request(app).post('/posts/add').send(newPost);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({message: 'Post added successfully', data: addedPost});
    });

    it('should return 400 if there is an error adding the post', async () => {
        const newPost = { userId: '1', movieId: '1', text: 'Great movie!', postTitle: 'My Review', img: 'image.jpg' };

        postService.addPost.mockResolvedValueOnce(null);

        const res = await request(app).post('/posts/add').send(newPost);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error adding post' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const newPost = { userId: '1', movieId: '1', text: 'Great movie!', postTitle: 'My Review', img: 'image.jpg' };
        const errorMessage = 'Internal server error';

        postService.addPost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).post('/posts/add').send(newPost);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('PUT /posts/edit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should edit an existing post', async () => {
        const updatedPost = { postId: '1', text: 'Updated review' };
        const editedPost = { id: '1', ...updatedPost };

        postService.editPost.mockResolvedValueOnce(editedPost);

        const res = await request(app).put('/posts/edit').send(updatedPost);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Post edited successfully', data: editedPost });
    });

    it('should return 400 if there is an error editing the post', async () => {
        const updatedPost = { postId: '1', text: 'Updated review' };

        postService.editPost.mockResolvedValueOnce(null);

        const res = await request(app).put('/posts/edit').send(updatedPost);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error editing post' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const updatedPost = { postId: '1', text: 'Updated review' };
        const errorMessage = 'Internal server error';

        postService.editPost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).put('/posts/edit').send(updatedPost);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('DELETE /posts/remove', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // it('should remove an existing post', async () => {
    //     const postId = '1';

    //     postService.removePost.mockResolvedValueOnce({ success: true });

    //     const res = await request(app).delete('/posts/remove').send({ postId });

    //     expect(res.status).toBe(200);
    //     expect(res.body).toEqual({ message: 'Post removed successfully' });
    // });

    it('should return 400 if there is an error removing the post', async () => {
        const postId = '1';

        postService.removePost.mockResolvedValueOnce({ success: false });

        const res = await request(app).delete('/posts/remove').send({ postId });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error removing post' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const postId = '1';
        const errorMessage = 'Internal server error';

        postService.removePost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app)
            .delete('/posts/remove')
            .send({ postId });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /posts/movie/:movieId/posts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get posts of a movie', async () => {
        const movieId = '1';
        const posts = [{ id: '1', text: 'Great movie!' }];

        postService.getPostsOfMovie.mockResolvedValueOnce(posts);

        const res = await request(app).get(`/posts/movie/${movieId}/posts`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Posts fetched successfully', data: posts });
    });

    it('should return 400 if there is an error fetching posts', async () => {
        const movieId = '1';

        postService.getPostsOfMovie.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/movie/${movieId}/posts`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching post' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const movieId = '1';
        const errorMessage = 'Internal server error';

        postService.getPostsOfMovie.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/posts/movie/${movieId}/posts`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});
