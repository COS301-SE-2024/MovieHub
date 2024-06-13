import express from 'express';
import likesController from './likes.controller';

const router = express.Router();

router.post('/toggleLikeReview', likesController.toggleLikeReview);

export default router;
