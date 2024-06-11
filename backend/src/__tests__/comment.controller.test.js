const commentService = require('../Comment/comment.services');
const responseHandler = require('../utils/responseHandler');
const commentController = require('../Comment/comment.controller');

jest.mock('./comment.service');
jest.mock('../utils/responseHandler');

describe('Comment Controller', () => {
    const req = { body: { userId: 'user1', movieId: 'movie1', text: 'Great movie!', commentId: 'comment1', parentCommentId: 'comment1', newText: 'Updated comment' } };
    const res = {};

    beforeEach(() => {
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn().mockReturnThis();
        jest.clearAllMocks();
    });

    test('addComment should add a comment', async () => {
        const comment = { id: 'comment1', text: 'Great movie!' };
        commentService.addComment.mockResolvedValue(comment);

        await commentController.addComment(req, res);

        expect(commentService.addComment).toHaveBeenCalledWith(req.body.userId, req.body.movieId, req.body.text, req.body.parentCommentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 201, 'Comment added successfully', comment);
    });

    test('editComment should edit a comment', async () => {
        const comment = { id: 'comment1', text: 'Updated comment' };
        commentService.editComment.mockResolvedValue(comment);

        await commentController.editComment(req, res);

        expect(commentService.editComment).toHaveBeenCalledWith(req.body.commentId, req.body.newText);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment edited successfully', comment);
    });

    test('removeComment should remove a comment', async () => {
        commentService.removeComment.mockResolvedValue(true);

        await commentController.removeComment(req, res);

        expect(commentService.removeComment).toHaveBeenCalledWith(req.body.commentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment removed successfully');
    });

    test('toggleLikeComment should like a comment', async () => {
        commentService.toggleLikeComment.mockResolvedValue(true);

        await commentController.toggleLikeComment(req, res);

        expect(commentService.toggleLikeComment).toHaveBeenCalledWith(req.body.userId, req.body.commentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Comment liked successfully');
    });

    test('toggleLikeComment should remove like from a comment', async () => {
        commentService.toggleLikeComment.mockResolvedValue(false);

        await commentController.toggleLikeComment(req, res);

        expect(commentService.toggleLikeComment).toHaveBeenCalledWith(req.body.userId, req.body.commentId);
        expect(responseHandler).toHaveBeenCalledWith(res, 200, 'Like removed successfully');
    });
});
