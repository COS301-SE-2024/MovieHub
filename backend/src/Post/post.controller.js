import postService from './post.services';
import responseHandler from '../utils/responseHandler';

// POSTS //
exports.addPost = async (req, res) => {
    const { uid, movieId, text, postTitle, img } = req.body;
    try {
        const post = await postService.addPost(uid, movieId, text, postTitle, img);
        responseHandler(res, 201, 'Post added successfully', post);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addReview = async (req, res) => {
    const { uid, movieId, text, rating, reviewTitle } = req.body;
    try {
        const review = await postService.addReview(uid, movieId, text, rating, reviewTitle);
        responseHandler(res, 201, 'Review added successfully', review);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToPost = async (req, res) => {
    const { uid, text, postId } = req.body;
    try {
        const comment = await postService.addCommentToPost(uid, postId, text);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToReview = async (req, res) => {
    const { uid, reviewId, text } = req.body;
    try {
        const comment = await postService.addCommentToReview(uid, reviewId, text);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToComment = async (req, res) => {
    const { uid, comOnId, text } = req.body;
    try {
        const comment = await postService.addCommentToComment(uid, comOnId, text);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

// PUTS //
exports.editPost = async (req, res) => {
    const { postId, text } = req.body;
    try {
        const post = await postService.editPost(postId, text);
        responseHandler(res, 200, 'Post edited successfully', post);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editReview = async (req, res) => {
    const { reviewId, text } = req.body;
    try {
        const review = await postService.editReview(reviewId, text);
        responseHandler(res, 200, 'Review edited successfully', review);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editComment = async (req, res) => {
    const { commentId, text } = req.body;
    try {
        const comment = await postService.editComment(commentId, text);
        responseHandler(res, 200, 'Comment edited successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

// DELETES //
exports.removePost = async (req, res) => {
    const { postId } = req.body;
    try {
        await postService.removePost(postId);
        responseHandler(res, 200, 'Post removed successfully');
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.removeReview = async (req, res) => {
    const { reviewId } = req.body;
    try {
        await postService.removeReview(reviewId);
        responseHandler(res, 200, 'Review removed successfully');
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.removeComment = async (req, res) => {
    const { commentId } = req.body;
    try {
        await postService.removeComment(commentId);
        responseHandler(res, 200, 'Comment removed successfully');
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

// GETS //
exports.getPostsOfMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const posts = await postService.getPostsOfMovie(movieId);
        responseHandler(res, 200, 'Posts fetched successfully', posts);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getReviewsOfMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const reviews = await postService.getReviewsOfMovie(movieId);
        responseHandler(res, 200, 'Reviews fetched successfully', reviews);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCommentsOfPost = async (req, res) => {
    try {
        console.log('Getting comments');
        const postId = req.params.postId;
        const comments = await postService.getCommentsOfPost(postId);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCommentsOfReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const comments = await postService.getCommentsOfReview(reviewId);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getPostsOfUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        const posts = await postService.getPostsOfUser(uid);
        responseHandler(res, 200, 'Posts fetched successfully', posts);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getReviewsOfUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        const reviews = await postService.getReviewsOfUser(uid);
        responseHandler(res, 200, 'Reviews fetched successfully', reviews);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCommentsOfUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        const comments = await postService.getCommentsOfUser(uid);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const averageRating = await postService.getAverageRating(movieId);
                   responseHandler(res, 200, 'Average rating fetched successfully', { averageRating });
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCountCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const postCommentCount = await postService.getCountCommentsOfPost(postId);
                   responseHandler(res, 200, 'Post comment count fetched successfully', { postCommentCount });
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCountCommentsOfReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const reviewCommentCount = await postService.getCountCommentsOfReview(reviewId);
                   responseHandler(res, 200, 'Review comment count fetched successfully', { reviewCommentCount });
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};
