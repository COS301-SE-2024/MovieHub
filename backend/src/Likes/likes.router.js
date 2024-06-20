import express from 'express';
import likesController from './likes.controller';

const router = express.Router();

router.post('/toggleLikeReview', likesController.toggleLikeReview);
router.post('/toggleLikeComment', likesController.toggleLikeComment);
router.post('/toggleLikeMovie', likesController.toggleLikeMovie);

export default router;
