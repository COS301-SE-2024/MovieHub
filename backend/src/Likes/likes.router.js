import express from 'express';
import likesController from './likes.controller';

const router = express.Router();

router.get('/:userId/likes', likesController.getLikesOfUser); // likes tab  (Returns only posts that a user has liked)
// router.get('/movie', likesController.getLikesOfMovie); // 
// router.get('/comment', likesController.getLikesOfComment); // postTab
// router.get('/review', likesController.getLikesOfReview); // "

router.post('/toggleLikeReview', likesController.toggleLikeReview); // LikesTab / posttab
router.post('/toggleLikeComment', likesController.toggleLikeComment); // PostsTab
router.post('/toggleLikeMovie', likesController.toggleLikeMovie);
router.post('/toggleLikePost', likesController.toggleLikePost);

module.exports = router;
