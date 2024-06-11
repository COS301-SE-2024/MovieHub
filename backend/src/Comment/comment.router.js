import express from 'express';
import commentController from './comment.controller';

const router = express.Router();

router.post('/add', commentController.addComment);
router.put('/edit', commentController.editComment);
router.delete('/remove', commentController.removeComment);
router.post('/toggle-like', commentController.toggleLikeComment);

export default router;
