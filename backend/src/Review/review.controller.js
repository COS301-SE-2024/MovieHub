const reviewService = require('./review.service');
const responseHandler = require('../utils/responseHandler');

exports.addReview = async (req, res) => {
    const { userId, movieId, text } = req.body;
    try {
        const review = await reviewService.addReview(userId, movieId, text);
        responseHandler(res, 201, 'Review added successfully', review);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToReview = async (req, res) => {
    const { userId, reviewId, movieId, text } = req.body;
    try {
        const comment = await reviewService.addCommentToReview(userId, reviewId, movieId, text);
        responseHandler(res, 201, 'Comment added to review successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToComment = async (req, res) => {
    const { userId, commentId, movieId, text } = req.body;
    try {
        const comment = await reviewService.addCommentToComment(userId, commentId, movieId, text);
        responseHandler(res, 201, 'Comment added to comment successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editReview = async (req, res) => {
    const { reviewId, newText } = req.body;
    try {
        const review = await reviewService.editReview(reviewId, newText);
        responseHandler(res, 200, 'Review edited successfully', review);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editComment = async (req, res) => {
    const { commentId, newText } = req.body;
    try {
        const comment = await reviewService.editComment(commentId, newText);
        responseHandler(res, 200, 'Comment edited successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.removeReview = async (req, res) => {
    const { reviewId } = req.body;
    try {
        await reviewService.removeReview(reviewId);
        responseHandler(res, 200, 'Review removed successfully');
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.removeComment = async (req, res) => {
    const { commentId } = req.body;
    try {
        await reviewService.removeComment(commentId);
        responseHandler(res, 200, 'Comment removed successfully');
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.toggleLikeReview = async (req, res) => {
    const { userId, reviewId } = req.body;
    try {
        const liked = await reviewService.toggleLikeReview(userId, reviewId);
        const message = liked ? 'Review liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};
