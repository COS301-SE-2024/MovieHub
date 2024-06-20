import postService  from './post.services';
import responseHandler from '../utils/responseHandler';

exports.addPost = async (req, res) => {
    const { userId, movieId, text, reviewStatus, rating } = req.body;
    try {
        const post = await postService.addPost(userId, movieId, text, reviewStatus, rating);
        responseHandler(res, 201, 'Post added successfully', post);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToPost = async (req, res) => {
    const { userId, postId, movieId, text } = req.body;
    try {
        const comment = await postService.addCommentToPost(userId, postId, movieId, text);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToComment = async (req, res) => {
    const { userId, commentId, movieId, text } = req.body;
    try {
        const comment = await postService.addCommentToComment(userId, commentId, movieId, text);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editPost = async (req, res) => {
    const { postId, text } = req.body;
    try {
        const post = await postService.editPost(postId, text);
        responseHandler(res, 200, 'Post edited successfully', post);
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

exports.removePost = async (req, res) => {
    const { postId } = req.body;
    try {
        await postService.removePost(postId);
        responseHandler(res, 200, 'Post removed successfully');
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


exports.getPostsOfMovie = async (req, res) => {
    const { movieId } = req.params;
    try {
        const posts = await postService.getPostsOfMovie(movieId);
        responseHandler(res, 200, 'Posts fetched successfully', posts);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getReviewsOfMovie = async (req, res) => {
    const { movieId } = req.params;
    try {
        const reviews = await postService.getReviewsOfMovie(movieId);
        responseHandler(res, 200, 'Reviewa fetched successfully', reviews);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCommentsOfPost = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await postService.getCommentsOfPost(postId);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getPostsOfUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await postService.getPostsOfUser(userId);
        responseHandler(res, 200, 'Posts fetched successfully', posts);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getReviewsOfUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const reviews = await postService.getReviewsOfUser(userId);
        responseHandler(res, 200, 'Reviews fetched successfully', reviews);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCommentsOfUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const comments = await postService.getCommentsOfUser(userId);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};
