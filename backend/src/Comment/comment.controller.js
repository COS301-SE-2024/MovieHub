const commentService = require('./comment.services');
const responseHandler = require('../utils/responseHandler');

exports.addComment = async (req, res) => {
    const { userId, movieId, text, parentCommentId } = req.body;
    try {
        const comment = await commentService.addComment(userId, movieId, text, parentCommentId);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editComment = async (req, res) => {
    const { commentId, newText } = req.body;
    try {
        const comment = await commentService.editComment(commentId, newText);
        responseHandler(res, 200, 'Comment edited successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.removeComment = async (req, res) => {
    const { commentId } = req.body;
    try {
        await commentService.removeComment(commentId);
        responseHandler(res, 200, 'Comment removed successfully');
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.toggleLikeComment = async (req, res) => {
    const { userId, commentId } = req.body;
    try {
        const liked = await commentService.toggleLikeComment(userId, commentId);
        const message = liked ? 'Comment liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};
