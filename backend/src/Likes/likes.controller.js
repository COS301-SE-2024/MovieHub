import likesService from './likes.services';
import responseHandler from '../utils/responseHandler';

exports.getLikesOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Fetching user likes for ID: ${userId}`);
        const likes = await likesService.getLikesOfUser(userId);
        responseHandler(res, 200, 'Likes fetched successfully', likes);
    } catch (error) {
        // console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getLikesOfMovie = async (req, res) => {
    const movieIdStr = req.params.movieId;
    const movieId = parseFloat(movieIdStr);
    if (isNaN(movieId)) {
        return res.status(400).send({ error: 'Invalid movieId' });
    }
    try {
        const likes = await likesService.getLikesOfMovie(movieId);
        console.log("response: ", likes);
        if (likes)
            responseHandler(res, 200, 'Likes fetched successfully', likes);
        else
            res.status(400).json({ message: 'Error fetching likes' });
    } catch (error) {
        // console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getLikesOfComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
        const likes = await likesService.getLikesOfComment(commentId);
        responseHandler(res, 200, 'Likes fetched successfully', likes);
    } catch (error) {
        // console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getLikesOfReview = async (req, res) => {
    const reviewId = req.params.reviewId;
    try {
        const likes = await likesService.getLikesOfReview(reviewId);
        responseHandler(res, 200, 'Likes fetched successfully', likes);
    } catch (error) {
        // console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getLikesOfPost = async (req, res) => {
    const postId = req.params.postId;
    console.log(req.params.postId);
    try {
        console.log(postId);
        const likes = await likesService.getLikesOfPost(postId);
        responseHandler(res, 200, 'Likes fetched successfully', likes);
    } catch (error) {
        // console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.toggleLikeReview = async (req, res) => {
    const userId = req.body.userId;
    const reviewId = req.body.reviewId;
    try {
        const liked = await likesService.toggleLikeReview(userId, reviewId);
        const message = liked ? 'Review liked successfully' : 'Like removed successfully';
        if (liked !== null)
            responseHandler(res, 200, message);
        else
            res.status(400).json({ message: 'Error toggling like' });
    } catch (error) {
        // console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.toggleLikeComment = async (req, res) => {
    const userId = req.body.userId;
    const commentId = req.body.commentId;
    try {
        const liked = await likesService.toggleLikeComment(userId, commentId);
        const message = liked ? 'Comment liked successfully' : 'Like removed successfully';
        if (liked !== null)
            responseHandler(res, 200, message);
        else
            res.status(400).json({ message: 'Error toggling like' });
    } catch (error) {
        // console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.toggleLikeMovie = async (req, res) => {
    const userId = req.body.userId;
    const movieId = req.body.movieId;
    try {
        const liked = await likesService.toggleLikeMovie(userId, movieId);
        const message = liked ? 'Movie liked successfully' : 'Like removed successfully';
        if (liked !== null)
            responseHandler(res, 200, message);
        else
            res.status(400).json({ message: 'Error toggling like' });
    } catch (error) {
        // console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.toggleLikePost = async (req, res) => {
    const userId = req.body.userId;
    const postId = req.body.postId;
    try {
        const liked = await likesService.toggleLikePost(userId, postId);
        const message = liked ? 'Post liked successfully' : 'Like removed successfully';
        if (liked !== null)
            responseHandler(res, 200, message);
        else
            res.status(400).json({ message: 'Error toggling like' });
    } catch (error) {
        // console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Check if a user has liked a specific entity
exports.checkLike = async (req, res) => {
    const { uid, entityId, entityType } = req.params;

    try {
        const hasLiked = await likesService.hasUserLikedEntity(uid, entityId, entityType);

        res.status(200).json({
            success: true,
            hasLiked,
        });
    } catch (error) {
        console.error(`Error checking like for entity ${entityType}:`, error);
        res.status(500).json({
            success: false,
            message: `An error occurred while checking like for the ${entityType.toLowerCase()}.`,
        });
    }
};