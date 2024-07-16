import postService from './post.services';
import responseHandler from '../utils/responseHandler';

// POSTS //
exports.addPost = async (req, res) => {
    const { userId, movieId, text, postTitle, img } = req.body;
    try {
        const post = await postService.addPost(userId, movieId, text, postTitle, img);
        if (post)
            responseHandler(res, 201, 'Post added successfully', post);
        else 
            res.status(400).json({ message: 'Error adding post' });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.addReview = async (req, res) => {
    const { userId, movieId, text, rating, reviewTitle } = req.body;
    try {
        const review = await postService.addReview(userId, movieId, text, rating, reviewTitle);
        if (review)
            responseHandler(res, 201, 'Review added successfully', review);
        else 
            res.status(400).json({ message: 'Error adding review' });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.addCommentToPost = async (req, res) => {
    const { userId, text, postId } = req.body;
    try {
        const comment = await postService.addCommentToPost(userId, postId, text);
        if (comment)
            responseHandler(res, 201, 'Comment added successfully', comment);
        else
            res.status(400).json({ message: 'Error adding comment' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.addCommentToReview = async (req, res) => {
    const { userId, reviewId, text } = req.body;
    try {
        const comment = await postService.addCommentToReview(userId, reviewId, text);
        if (comment)
            responseHandler(res, 201, 'Comment added successfully', comment);
        else
            res.status(400).json({ message: 'Error adding comment' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.addCommentToComment = async (req, res) => {
    const { userId, comOnId, text } = req.body;
    try {
        const comment = await postService.addCommentToComment(userId, comOnId, text);
        if (comment)
            responseHandler(res, 201, 'Comment added successfully to comment', comment);
        else
            res.status(400).json({ message: 'Error adding comment to comment' });
    } catch (error) {
        console.error('Error adding comment to comment:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// PUTS //
exports.editPost = async (req, res) => {
    const { postId, text } = req.body;
    try {
        const post = await postService.editPost(postId, text);
        if (post)
            responseHandler(res, 200, 'Post edited successfully', post);
        else
            res.status(400).json({ message: 'Error editing post' });
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.editReview = async (req, res) => {
    const { reviewId, text } = req.body;
    try {
        const review = await postService.editReview(reviewId, text);
        if (review)
            responseHandler(res, 200, 'Review edited successfully', review);
        else
            res.status(400).json({ message: 'Error editing review' });
    } catch (error) {
        console.error('Error editing review:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.editComment = async (req, res) => {
    const { commentId, text } = req.body;
    try {
        const comment = await postService.editComment(commentId, text);
        if (comment)
            responseHandler(res, 200, 'Comment edited successfully', comment);
        else
            res.status(400).json({ message: 'Error editing comment' });
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// DELETES //
exports.removePost = async (req, res) => {
    const { postId } = req.body;
    try {
        const result = await postService.removePost(postId);
        if (result.success)
            responseHandler(res, 200, 'Post removed successfully');
        else
            res.status(400).json({ message: 'Error removing post' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.removeReview = async (req, res) => {
    const { reviewId } = req.body;
    try {
        const result = await postService.removeReview(reviewId);
        if (result.success)
            responseHandler(res, 200, 'Review removed successfully');
        else
            res.status(400).json({ message: 'Error removing review' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.removeComment = async (req, res) => {
    const { commentId } = req.body;
    try {
        const result = await postService.removeComment(commentId);
        if (result.success)
            responseHandler(res, 200, 'Comment removed successfully');
        else
            res.status(400).json({ message: 'Error removing comment' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// GETS //
exports.getPostsOfMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const posts = await postService.getPostsOfMovie(movieId);
        if (posts)
            responseHandler(res, 200, 'Posts fetched successfully', posts);
        else
            res.status(400).json({ message: 'Error fetching post' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getReviewsOfMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const reviews = await postService.getReviewsOfMovie(movieId);
        if (reviews)
            responseHandler(res, 200, 'Reviews fetched successfully', reviews);
        else
            res.status(400).json({ message: 'Error fetching reviews' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await postService.getCommentsOfPost(postId);
        if (comments)
            responseHandler(res, 200, 'Comments fetched successfully', comments);
        else
            res.status(400).json({ message: 'Error fetching comments' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getCommentsOfReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const comments = await postService.getCommentsOfReview(reviewId);
        if (comments)
            responseHandler(res, 200, 'Comments fetched successfully', comments);
        else
            res.status(400).json({ message: 'Error fetching comments' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getPostsOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await postService.getPostsOfUser(userId);
        if (posts)
            responseHandler(res, 200, 'Posts fetched successfully', posts);
        else
            res.status(400).json({ message: 'Error fetching post' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getReviewsOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reviews = await postService.getReviewsOfUser(userId);
        if (reviews)
            responseHandler(res, 200, 'Reviews fetched successfully', reviews);
        else
            res.status(400).json({ message: 'Error fetching reviews' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getCommentsOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const comments = await postService.getCommentsOfUser(userId);
        if (comments)
            responseHandler(res, 200, 'Comments fetched successfully', comments);
        else
            res.status(400).json({ message: 'Error fetching comments' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const averageRating = await postService.getAverageRating(movieId);
        if (averageRating)
            responseHandler(res, 200, 'Average rating fetched successfully', { averageRating });
        else
            res.status(400).json({ message: 'Error fetching average rating' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
