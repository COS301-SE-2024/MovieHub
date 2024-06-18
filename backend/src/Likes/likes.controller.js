import likesService from './likes.services';
import responseHandler from '../utils/responseHandler';

exports.toggleLikeReview = async (req, res) => {
    const { userId, reviewId } = req.body;
    try {
        const liked = await likesService.toggleLikeReview(userId, reviewId);
        const message = liked ? 'Review liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.toggleLikeComment = async (req, res) => {
    const { userId, commentId } = req.body;
    try {
        const liked = await likesService.toggleLikeComment(userId, commentId);
        const message = liked ? 'Comment liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.toggleLikeMovie = async (req, res) => {
    const { userId, movieId } = req.body;
    try {
        const liked = await likesService.toggleLikeMovie(userId, movieId);
        const message = liked ? 'Movie liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};