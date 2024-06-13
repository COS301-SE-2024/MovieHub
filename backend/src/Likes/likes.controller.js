const likesService = require('./likes.services');
const responseHandler = require('../utils/responseHandler');

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