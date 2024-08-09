import express from 'express';
import postController from './post.controller';

const router = express.Router();

router.post('/add/post', postController.addPost);
router.post('/add/review', postController.addReview);
router.post('/comment/post', postController.addCommentToPost);
router.post('/comment/review', postController.addCommentToReview);
router.post('/comment/comment', postController.addCommentToComment);

router.put('/edit/post', postController.editPost);
router.put('/edit/review', postController.editReview);
router.put('/edit/comment', postController.editComment);

router.delete('/remove/post', postController.removePost);
router.delete('/remove/review', postController.removeReview);
router.delete('/remove/comment', postController.removeComment);

router.get('/movie/:movieId/posts', postController.getPostsOfMovie);
router.get('/movie/:movieId/reviews', postController.getReviewsOfMovie);
router.get('/post/:postId/comments', postController.getCommentsOfPost);
router.get('/review/:reviewId/comments', postController.getCommentsOfReview);
router.get('/user/:uid/posts', postController.getPostsOfUser);
router.get('/user/:uid/comments', postController.getCommentsOfUser);
router.get('/user/:uid/reviews', postController.getReviewsOfUser);
router.get('/movie/:movieId/rating', postController.getAverageRating);
router.get('/post/:postId/comment/count', postController.getCountCommentsOfPost);
router.get('/review/:reviewId/comment/count', postController.getCountCommentsOfReview);

module.exports = router;
