import postService from'../Post/post.services';
import responseHandler from'../utils/responseHandler';
import postController from'../Post/post.controller';

jest.mock('../Post/post.services');
jest.mock('../utils/responseHandler');

describe('post Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    test('addpost should add a post', async () => {
        req.body = { userId: 'user1', movieId: 'movie1', text: 'Great movie!',isReview: true, text: 5 };
        const post = { id: 'post1', text: 'Great movie!' };
        postService.addPost.mockResolvedValue(post);

        await postController.addpost(req, res);

        expect(postService.addPost).toHaveBeenCalledWith(req.body.userId, req.body.movieId, req.body.text, req.body.isReview, req.body.rating);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'post added successfully', post);
    });

    test('addCommentTopost should add a comment to a post', async () => {
        req.body = { userId: 'user1', postId: 'post1', movieId: 'movie1', text: 'I agree!' };
        const comment = { id: 'comment1', text: 'I agree!', movieId: 'movie1' };
        postService.addCommentToPost.mockResolvedValue(comment);

        await postController.addCommentToPost(req, res);

        expect(postService.addCommentToPost).toHaveBeenCalledWith(req.body.userId, req.body.postId, req.body.movieId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Comment added successfully', comment);
    });

    test('addCommentToComment should add a comment to a comment', async () => {
        req.body = { userId: 'user1', commentId: 'comment1', movieId: 'movie1', text: 'I agree!' };
        const comment = { id: 'comment2', text: 'I agree!', movieId: 'movie1' };
        postService.addCommentToComment.mockResolvedValue(comment);

        await postController.addCommentToComment(req, res);

        expect(postService.addCommentToComment).toHaveBeenCalledWith(req.body.userId, req.body.commentId, req.body.movieId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Comment added successfully', comment);
    });

    test('editPost should edit a post', async () => {
        req.body = { postId: 'post1', text: 'Updated text' };
        const post = { id: 'post1', text: 'Updated text' };
        postService.editPost.mockResolvedValue(post);

        await postController.editPost(req, res);

        expect(postService.editPost).toHaveBeenCalledWith(req.body.postId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'post edited successfully', post);
    });

    test('editComment should edit a comment', async () => {
        req.body = { commentId: 'comment1', text: 'Updated text' };
        const comment = { id: 'comment1', text: 'Updated text' };
        postService.editComment.mockResolvedValue(comment);

        await postController.editComment(req, res);

        expect(postService.editComment).toHaveBeenCalledWith(req.body.commentId, req.body.text);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment edited successfully', comment);
    });

    test('removepost should remove a post', async () => {
        req.body = { postId: 'post1' };
        postService.removePost.mockResolvedValue(true);

        await postController.removePost(req, res);

        expect(postService.removePost).toHaveBeenCalledWith(req.body.postId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'post removed successfully');
    });

    test('removeComment should remove a comment', async () => {
        req.body = { commentId: 'comment1' };
        postService.removeComment.mockResolvedValue(true);

        await postController.removeComment(req, res);

        expect(postService.removeComment).toHaveBeenCalledWith(req.body.commentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment removed successfully');
    });

    test('toggleLikePost should like/unlike a post', async () => {
        req.body = { userId: 'user1', postId: 'post1' };
        postService.toggleLikePost.mockResolvedValue(true);

        await postController.toggleLikePost(req, res);

        expect(postService.toggleLikePost).toHaveBeenCalledWith(req.body.userId, req.body.postId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'post liked successfully', { liked: true });
    });

    test('getpostsOfMovie should fetch posts of a specific movie', async () => {
        req.params = { movieId: 'movie1' };
        const posts = [{ id: 'post1', text: 'Great movie!' }];
        postService.getPostsOfMovie.mockResolvedValue(posts);

        await postController.getPostsOfMovie(req, res);

        expect(postService.getPostsOfMovie).toHaveBeenCalledWith(req.params.movieId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'posts fetched successfully', posts);
    });

    test('getCommentsOfpost should fetch comments of a specific post', async () => {
        req.params = { postId: 'post1' };
        const comments = [{ id: 'comment1', text: 'I agree!' }];
        postService.getCommentsOfPost.mockResolvedValue(comments);

        await postController.getCommentsOfPost(req, res);

        expect(postService.getCommentsOfPost).toHaveBeenCalledWith(req.params.postId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comments fetched successfully', comments);
    });

    test('getpostsOfUser should fetch posts of a specific user', async () => {
        req.params = { userId: 'user1' };
        const posts = [{ id: 'post1', text: 'Great movie!' }];
        postService.getPostsOfUser.mockResolvedValue(posts);

        await postController.getPostsOfUser(req, res);

        expect(postService.getPostsOfUser).toHaveBeenCalledWith(req.params.userId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'posts fetched successfully', posts);
    });

    test('getCommentsOfUser should fetch comments of a specific user', async () => {
        req.params = { userId: 'user1' };
        const comments = [{ id: 'comment1', text: 'I agree!' }];
        postService.getCommentsOfUser.mockResolvedValue(comments);

        await postController.getCommentsOfUser(req, res);

        expect(postService.getCommentsOfUser).toHaveBeenCalledWith(req.params.userId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comments fetched successfully', comments);
    });
});