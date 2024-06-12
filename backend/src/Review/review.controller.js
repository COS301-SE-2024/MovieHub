import reviewService  from './review.services';
import responseHandler from '../utils/responseHandler';

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
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToComment = async (req, res) => {
    const { userId, commentId, movieId, text } = req.body;
    try {
        const comment = await reviewService.addCommentToComment(userId, commentId, movieId, text);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editReview = async (req, res) => {
    const { reviewId, text } = req.body;
    try {
        const review = await reviewService.editReview(reviewId, text);
        responseHandler(res, 200, 'Review edited successfully', review);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editComment = async (req, res) => {
    const { commentId, text } = req.body;
    try {
        const comment = await reviewService.editComment(commentId, text);
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
        responseHandler(res, 200, `Review ${liked ? 'liked' : 'unliked'} successfully`, { liked });
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getReviewsOfMovie = async (req, res) => {
    const { movieId } = req.params;
    try {
        const reviews = await reviewService.getReviewsOfMovie(movieId);
        responseHandler(res, 200, 'Reviews fetched successfully', reviews);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCommentsOfReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
        const comments = await reviewService.getCommentsOfReview(reviewId);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getReviewsOfUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const reviews = await reviewService.getReviewsOfUser(userId);
        responseHandler(res, 200, 'Reviews fetched successfully', reviews);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCommentsOfUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const comments = await reviewService.getCommentsOfUser(userId);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};
