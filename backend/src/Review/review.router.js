import express from 'express';
import reviewController from './review.controller';

const router = express.Router();

router.post('/add', reviewController.addReview);
router.post('/comment/review', reviewController.addCommentToReview);
router.post('/comment/comment', reviewController.addCommentToComment);
router.put('/edit', reviewController.editReview);
router.put('/edit/comment', reviewController.editComment);
router.delete('/remove', reviewController.removeReview);
router.delete('/remove/comment', reviewController.removeComment);
router.post('/like', reviewController.toggleLikeReview);
router.get('/movie/:movieId', reviewController.getReviewsOfMovie);
router.get('/review/:reviewId/comments', reviewController.getCommentsOfReview);
router.get('/user/:userId/reviews', reviewController.getReviewsOfUser);
router.get('/user/:userId/comments', reviewController.getCommentsOfUser);

module.exports = router;
