import express from 'express';
import reviewController from './review.controller';

const router = express.Router();

router.post('/add-review', reviewController.addReview);
router.post('/comment', reviewController.addCommentToReview);
router.post('/comment-to-comment', reviewController.addCommentToComment);
router.put('/edit-review', reviewController.editReview);
router.put('/edit-comment', reviewController.editComment);
router.delete('/remove-review', reviewController.removeReview);
router.delete('/remove-comment', reviewController.removeComment);
router.post('/toggle-like', reviewController.toggleLikeReview);

export default router;
