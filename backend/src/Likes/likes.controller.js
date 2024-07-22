import likesService from './likes.services';
import responseHandler from '../utils/responseHandler';

exports.getLikesOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Fetching user likes for ID: ${userId}`);
        const likes = await likesService.getLikesOfUser(userId);
        responseHandler(res, 200, 'Likes fetched successfully', likes);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getLikesOfMovie = async (req, res) => {
    const movieId = req.params.movieId;
    try {
        const liked = await likesService.getLikesOfMovie(movieId);
        const message = 'Likes of movie fetched successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getLikesOfComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
        const liked = await likesService.getLikesOfComment(commentId);
        const message = 'Likes of comment fetched successfully';
        responseHandler(res, 200, message, liked);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getLikesOfReview = async (req, res) => {
    const reviewId = req.params.reviewId;
    try {
        const liked = await likesService.getLikesOfReview(reviewId);
        const message = 'Likes of review fetched successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getLikesOfPost = async (req, res) => {
    const postId = req.params.postId;
    console.log(req.params.postId);
    try {
        console.log(postId);
        const liked = await likesService.getLikesOfPost(postId);
        const message = 'Likes of post fetched successfully';
        responseHandler(res, 200, message, liked);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.toggleLikeReview = async (req, res) => {
    const userId = req.body.userId;
    const reviewId = req.body.reviewId;
    try {
        const liked = await likesService.toggleLikeReview(userId, reviewId);
        const message = liked ? 'Review liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.toggleLikeComment = async (req, res) => {
    const userId = req.body.userId;
    const commentId = req.body.commentId;
    try {
        const liked = await likesService.toggleLikeComment(userId, commentId);
        const message = liked ? 'Comment liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.toggleLikeMovie = async (req, res) => {
    const userId = req.body.userId;
    const movieId = req.body.movieId;
    try {
        const liked = await likesService.toggleLikeMovie(userId, movieId);
        const message = liked ? 'Movie liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.toggleLikePost = async (req, res) => {
    const userId = req.body.userId;
    const postId = req.body.postId;
    try {
        const liked = await likesService.toggleLikePost(userId, postId);
        const message = liked ? 'Post liked successfully' : 'Like removed successfully';
        responseHandler(res, 200, message);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};