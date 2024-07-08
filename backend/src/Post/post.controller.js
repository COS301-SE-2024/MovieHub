import postService  from './post.services';
import responseHandler from '../utils/responseHandler';

//POSTS//
exports.addPost = async (req, res) => {
    const userId = req.body.userId;
    const movieId = req.body.movieId;
    const text = req.body.text;
    const isReview = req.body.isReview;
    const rating = req.body.rating;
    const postTitle = req.body.postTitle;
    console.log(userId, movieId, text, isReview, rating, postTitle);
    try {
        const post = await postService.addPost(userId, movieId, text, isReview, rating, postTitle);
        responseHandler(res, 201, 'Post added successfully', post);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToPost = async (req, res) => {
    const userId = req.body.userId;
    const text = req.body.text;
    const postId = req.body.postId;
    try {
        const comment = await postService.addCommentToPost(userId, postId, text);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.addCommentToComment = async (req, res) => {
    const userId = req.body.userId;
    const commentId = req.body.commentId;
    const text = req.body.text;
    try {
        const comment = await postService.addCommentToComment(userId, commentId, text);
        responseHandler(res, 201, 'Comment added successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

//PUTS//

exports.editPost = async (req, res) => {
    const postId = req.body.postId;
    const text = req.body.text;
    try {
        const post = await postService.editPost(postId, text);
        responseHandler(res, 200, 'Post edited successfully', post);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.editComment = async (req, res) => {
    const commentId = req.body.commentId;
    const text = req.body.text;
    try {
        const comment = await postService.editComment(commentId, text);
        responseHandler(res, 200, 'Comment edited successfully', comment);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

//DELETES//

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

//GETS//

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
        const postId = req.params.post;
        const comments = await postService.getCommentsOfPost(postId);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getPostsOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Fetching user posts for ID: ${userId}`);
        const posts = await postService.getPostsOfUser(userId);
        responseHandler(res, 200, 'Posts fetched successfully', posts);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getReviewsOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Fetching user posts for ID: ${userId}`);
        const reviews = await postService.getReviewsOfUser(userId);
        responseHandler(res, 200, 'Reviews fetched successfully', reviews);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};

exports.getCommentsOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const comments = await postService.getCommentsOfUser(userId);
        responseHandler(res, 200, 'Comments fetched successfully', comments);
    } catch (error) {
        responseHandler(res, 400, error.message);
    }
};
