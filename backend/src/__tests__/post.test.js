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

describe('POST /posts/add/post', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new post', async () => {
        const newPost = { uid: '1', movieId: '1', text: 'Great movie!', postTitle: 'My Review', img: 'image.jpg' };
        const addedPost = { ...newPost, id: '1' };

        postService.addPost.mockResolvedValueOnce(addedPost);

        const res = await request(app).post('/posts/add/post').send(newPost);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Post added successfully', data: addedPost });
    });

    it('should return 400 if there is an error adding the post', async () => {
        const newPost = { uid: '1', movieId: '1', text: 'Great movie!', postTitle: 'My Review', img: 'image.jpg' };

        postService.addPost.mockResolvedValueOnce(null);

        const res = await request(app).post('/posts/add/post').send(newPost);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error adding post' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const newPost = { uid: '1', movieId: '1', text: 'Great movie!', postTitle: 'My Review', img: 'image.jpg' };
        const errorMessage = 'Internal server error';

        postService.addPost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).post('/posts/add/post').send(newPost);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /posts/add/review', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new review', async () => {
        const newReview = { uid: '1', movieId: '1', text: 'Amazing!', rating: 5, reviewTitle: 'Fantastic' };
        const addedReview = { ...newReview, id: '1' };

        postService.addReview.mockResolvedValueOnce(addedReview);

        const res = await request(app).post('/posts/add/review').send(newReview);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Review added successfully', data: addedReview });
    });

    it('should return 400 if there is an error adding the review', async () => {
        const newReview = { uid: '1', movieId: '1', text: 'Amazing!', rating: 5, reviewTitle: 'Fantastic' };

        postService.addReview.mockResolvedValueOnce(null);

        const res = await request(app).post('/posts/add/review').send(newReview);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error adding review' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const newReview = { uid: '1', movieId: '1', text: 'Amazing!', rating: 5, reviewTitle: 'Fantastic' };
        const errorMessage = 'Internal server error';

        postService.addReview.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).post('/posts/add/review').send(newReview);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /posts/comment/post', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a comment to a post', async () => {
        const newComment = { uid: '1', text: 'Nice post!', postId: '1' };
        const addedComment = { ...newComment, id: '1' };

        postService.addCommentToPost.mockResolvedValueOnce(addedComment);

        const res = await request(app).post('/posts/comment/post').send(newComment);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Comment added successfully', data: addedComment });
    });

    it('should return 400 if there is an error adding the comment', async () => {
        const newComment = { uid: '1', text: 'Nice post!', postId: '1' };

        postService.addCommentToPost.mockResolvedValueOnce(null);

        const res = await request(app).post('/posts/comment/post').send(newComment);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error adding comment' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const newComment = { uid: '1', text: 'Nice post!', postId: '1' };
        const errorMessage = 'Internal server error';

        postService.addCommentToPost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).post('/posts/comment/post').send(newComment);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /posts/comment/review', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a comment to a review', async () => {
        const newComment = { uid: '1', text: 'Nice review!', reviewId: '1' };
        const addedComment = { ...newComment, id: '1' };

        postService.addCommentToReview.mockResolvedValueOnce(addedComment);

        const res = await request(app).post('/posts/comment/review').send(newComment);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Comment added successfully', data: addedComment });
    });

    it('should return 400 if there is an error adding the comment', async () => {
        const newComment = { uid: '1', text: 'Nice review!', reviewId: '1' };

        postService.addCommentToReview.mockResolvedValueOnce(null);

        const res = await request(app).post('/posts/comment/review').send(newComment);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error adding comment' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const newComment = { uid: '1', text: 'Nice review!', reviewId: '1' };
        const errorMessage = 'Internal server error';

        postService.addCommentToReview.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).post('/posts/comment/review').send(newComment);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('POST /posts/comment/comment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a comment to a comment', async () => {
        const newComment = { uid: '1', text: 'Nice comment!', comOnId: '1' };
        const addedComment = { ...newComment, id: '1' };

        postService.addCommentToComment.mockResolvedValueOnce(addedComment);

        const res = await request(app).post('/posts/comment/comment').send(newComment);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Comment added successfully to comment', data: addedComment });
    });

    it('should return 400 if there is an error adding the comment', async () => {
        const newComment = { uid: '1', text: 'Nice comment!', comOnId: '1' };

        postService.addCommentToComment.mockResolvedValueOnce(null);

        const res = await request(app).post('/posts/comment/comment').send(newComment);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error adding comment to comment' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const newComment = { uid: '1', text: 'Nice comment!', comOnId: '1' };
        const errorMessage = 'Internal server error';

        postService.addCommentToComment.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).post('/posts/comment/comment').send(newComment);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('PUT /posts/edit/post', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should edit a post', async () => {
        const updatedPost = { postId: '1', newText: 'Updated text', newTitle: 'Updated title' };

        postService.editPost.mockResolvedValueOnce(updatedPost);

        const res = await request(app).put('/posts/edit/post').send(updatedPost);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Post edited successfully', data: updatedPost });
    });

    it('should return 400 if there is an error editing the post', async () => {
        const updatedPost = { postId: '1', newText: 'Updated text', newTitle: 'Updated title' };

        postService.editPost.mockResolvedValueOnce(false);

        const res = await request(app).put('/posts/edit/post').send(updatedPost);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error editing post' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const updatedPost = { postId: '1', newText: 'Updated text', newTitle: 'Updated title' };
        const errorMessage = 'Internal server error';

        postService.editPost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).put('/posts/edit/post').send(updatedPost);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('PUT /posts/edit/review', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should edit a review', async () => {
        const updatedReview = { reviewId: '1', newText: 'Updated review text', newTitle: 'Updated review title' };

        postService.editReview.mockResolvedValueOnce(updatedReview);

        const res = await request(app).put('/posts/edit/review').send(updatedReview);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Review edited successfully', data: updatedReview });
    });

    it('should return 400 if there is an error editing the review', async () => {
        const updatedReview = { reviewId: '1', newText: 'Updated review text', newTitle: 'Updated review title' };

        postService.editReview.mockResolvedValueOnce(false);

        const res = await request(app).put('/posts/edit/review').send(updatedReview);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error editing review' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const updatedReview = { reviewId: '1', newText: 'Updated review text', newTitle: 'Updated review title' };
        const errorMessage = 'Internal server error';

        postService.editReview.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).put('/posts/edit/review').send(updatedReview);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('PUT /posts/edit/comment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should edit a comment', async () => {
        const updatedComment = { commentId: '1', newText: 'Updated comment text' };

        postService.editComment.mockResolvedValueOnce(updatedComment);

        const res = await request(app).put('/posts/edit/comment').send(updatedComment);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Comment edited successfully', data: updatedComment });
    });

    it('should return 400 if there is an error editing the comment', async () => {
        const updatedComment = { commentId: '1', newText: 'Updated comment text' };

        postService.editComment.mockResolvedValueOnce(false);

        const res = await request(app).put('/posts/edit/comment').send(updatedComment);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error editing comment' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const updatedComment = { commentId: '1', newText: 'Updated comment text' };
        const errorMessage = 'Internal server error';

        postService.editComment.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).put('/posts/edit/comment').send(updatedComment);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

// describe('DELETE /posts/delete/post', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should delete a post', async () => {
//         const postId = '1';

//         postService.deletePost.mockResolvedValueOnce(true);

//         const res = await request(app).delete(`/posts/delete/post?postId=${postId}`);

//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({ message: 'Post deleted successfully' });
//     });

//     it('should return 400 if there is an error deleting the post', async () => {
//         const postId = '1';

//         postService.deletePost.mockResolvedValueOnce(false);

//         const res = await request(app).delete(`/posts/delete/post?postId=${postId}`);

//         expect(res.status).toBe(400);
//         expect(res.body).toEqual({ message: 'Error deleting post' });
//     });

//     it('should return 500 if there is an internal server error', async () => {
//         const postId = '1';
//         const errorMessage = 'Internal server error';

//         postService.deletePost.mockRejectedValueOnce(new Error(errorMessage));

//         const res = await request(app).delete(`/posts/delete/post?postId=${postId}`);

//         expect(res.status).toBe(500);
//         expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
//     });
// });

// describe('DELETE /posts/delete/review', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should delete a review', async () => {
//         const reviewId = '1';

//         postService.deleteReview.mockResolvedValueOnce(true);

//         const res = await request(app).delete(`/posts/delete/review?reviewId=${reviewId}`);

//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({ message: 'Review deleted successfully' });
//     });

//     it('should return 400 if there is an error deleting the review', async () => {
//         const reviewId = '1';

//         postService.deleteReview.mockResolvedValueOnce(false);

//         const res = await request(app).delete(`/posts/delete/review?reviewId=${reviewId}`);

//         expect(res.status).toBe(400);
//         expect(res.body).toEqual({ message: 'Error deleting review' });
//     });

//     it('should return 500 if there is an internal server error', async () => {
//         const reviewId = '1';
//         const errorMessage = 'Internal server error';

//         postService.deleteReview.mockRejectedValueOnce(new Error(errorMessage));

//         const res = await request(app).delete(`/posts/delete/review?reviewId=${reviewId}`);

//         expect(res.status).toBe(500);
//         expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
//     });
// });

// describe('DELETE /posts/remove/comment', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should delete a comment', async () => {
//         const commentId = '1';

//         postService.removeComment.mockResolvedValueOnce(true);

//         const res = await request(app).delete(`/posts/remove/comment?commentId=${commentId}`);

//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({ message: 'Comment deleted successfully' });
//     });

//     it('should return 400 if there is an error deleting the comment', async () => {
//         const commentId = '1';

//         postService.removeComment.mockResolvedValueOnce(false);

//         const res = await request(app).delete(`/posts/remove/comment?commentId=${commentId}`);

//         expect(res.status).toBe(400);
//         expect(res.body).toEqual({ message: 'Error deleting comment' });
//     });

//     it('should return 500 if there is an internal server error', async () => {
//         const commentId = '1';
//         const errorMessage = 'Internal server error';

//         postService.removeComment.mockRejectedValueOnce(new Error(errorMessage));

//         const res = await request(app).delete(`/posts/remove/comment?commentId=${commentId}`);

//         expect(res.status).toBe(500);
//         expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
//     });
// });

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
        expect(res.body).toEqual({ message: 'Error fetching posts' });
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

describe('GET /posts/movie/:movieId/reviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get reviews of a movie', async () => {
        const movieId = '1';
        const reviews = [{ id: '1', text: 'Amazing movie!' }];

        postService.getReviewsOfMovie.mockResolvedValueOnce(reviews);

        const res = await request(app).get(`/posts/movie/${movieId}/reviews`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Reviews fetched successfully', data: reviews });
    });

    it('should return 400 if there is an error fetching reviews', async () => {
        const movieId = '1';

        postService.getReviewsOfMovie.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/movie/${movieId}/reviews`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching reviews' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const movieId = '1';
        const errorMessage = 'Internal server error';

        postService.getReviewsOfMovie.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/posts/movie/${movieId}/reviews`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /posts/post/:postId/comments', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get comments of a post', async () => {
        const postId = '1';
        const comments = [{ id: '1', text: 'Great comment!' }];

        postService.getCommentsOfPost.mockResolvedValueOnce(comments);

        const res = await request(app).get(`/posts/post/${postId}/comments`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Comments fetched successfully', data: comments });
    });

    it('should return 400 if there is an error fetching comments', async () => {
        const postId = '1';

        postService.getCommentsOfPost.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/post/${postId}/comments`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching comments' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const postId = '1';
        const errorMessage = 'Internal server error';

        postService.getCommentsOfPost.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/posts/post/${postId}/comments`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /posts/review/:reviewId/comments', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get comments of a review', async () => {
        const reviewId = '1';
        const comments = [{ id: '1', text: 'Great review comment!' }];

        postService.getCommentsOfReview.mockResolvedValueOnce(comments);

        const res = await request(app).get(`/posts/review/${reviewId}/comments`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Comments fetched successfully', data: comments });
    });

    it('should return 400 if there is an error fetching comments', async () => {
        const reviewId = '1';

        postService.getCommentsOfReview.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/review/${reviewId}/comments`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching comments' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const reviewId = '1';
        const errorMessage = 'Internal server error';

        postService.getCommentsOfReview.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/posts/review/${reviewId}/comments`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /posts/user/:uid/posts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get posts of a user', async () => {
        const uid = '1';
        const posts = [{ id: '1', text: 'User post!' }];

        postService.getPostsOfUser.mockResolvedValueOnce(posts);

        const res = await request(app).get(`/posts/user/${uid}/posts`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Posts fetched successfully', data: posts });
    });

    it('should return 400 if there is an error fetching posts', async () => {
        const uid = '1';

        postService.getPostsOfUser.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/user/${uid}/posts`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching posts' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const uid = '1';
        const errorMessage = 'Internal server error';

        postService.getPostsOfUser.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/posts/user/${uid}/posts`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /posts/user/:uid/comments', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get comments of a user', async () => {
        const uid = '1';
        const comments = [{ id: '1', text: 'User comment!' }];

        postService.getCommentsOfUser.mockResolvedValueOnce(comments);

        const res = await request(app).get(`/posts/user/${uid}/comments`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Comments fetched successfully', data: comments });
    });

    it('should return 400 if there is an error fetching comments', async () => {
        const uid = '1';

        postService.getCommentsOfUser.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/user/${uid}/comments`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching comments' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const uid = '1';
        const errorMessage = 'Internal server error';

        postService.getCommentsOfUser.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/posts/user/${uid}/comments`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /posts/user/:uid/reviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get reviews of a user', async () => {
        const uid = '1';
        const reviews = [{ id: '1', text: 'User review!' }];

        postService.getReviewsOfUser.mockResolvedValueOnce(reviews);

        const res = await request(app).get(`/posts/user/${uid}/reviews`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Reviews fetched successfully', data: reviews });
    });

    it('should return 400 if there is an error fetching reviews', async () => {
        const uid = '1';

        postService.getReviewsOfUser.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/user/${uid}/reviews`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching reviews' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const uid = '1';
        const errorMessage = 'Internal server error';

        postService.getReviewsOfUser.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/posts/user/${uid}/reviews`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});

describe('GET /posts/movie/:movieId/rating', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get the average rating of a movie', async () => {
        const movieId = '1';
        const averageRating = 4.5;

        postService.getAverageRating.mockResolvedValueOnce(averageRating);

        const res = await request(app).get(`/posts/movie/${movieId}/rating`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Average rating fetched successfully', data: averageRating });
    });

    it('should return 400 if there is an error fetching the average rating', async () => {
        const movieId = '1';

        postService.getAverageRating.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/movie/${movieId}/rating`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Error fetching average rating' });
    });

    it('should return 500 if there is an internal server error', async () => {
        const movieId = '1';
        const errorMessage = 'Internal server error';

        postService.getAverageRating.mockRejectedValueOnce(new Error(errorMessage));

        const res = await request(app).get(`/posts/movie/${movieId}/rating`);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Internal server error', error: errorMessage });
    });
});
