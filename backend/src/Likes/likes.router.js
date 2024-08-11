import express from 'express';
import likesController from './likes.controller';

const router = express.Router();

router.get('/:userId/likes', likesController.getLikesOfUser); // likes tab  (Returns only posts that a user has liked)
router.get('/movie/:movieId', likesController.getLikesOfMovie); // 
router.get('/comment/:commentId', likesController.getLikesOfComment); // postTab
router.get('/review/:reviewId', likesController.getLikesOfReview); // "
router.get('/post/:postId', likesController.getLikesOfPost); // 

// Route to check if a user has liked an entity
router.get('/check-like/:uid/:entityId/:entityType', likesController.checkLike);

router.post('/toggleLikeReview', likesController.toggleLikeReview); // LikesTab / posttab
router.post('/toggleLikeComment', likesController.toggleLikeComment); // PostsTab
router.post('/toggleLikeMovie', likesController.toggleLikeMovie);
router.post('/toggleLikePost', likesController.toggleLikePost);

module.exports = router;
