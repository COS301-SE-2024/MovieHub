import express from 'express';
import postController from './post.controller';

const router = express.Router();

router.post('/add', postController.addPost);
router.post('/comment/post', postController.addCommentToPost);
router.post('/comment/comment', postController.addCommentToComment);
router.put('/edit', postController.editPost);
router.put('/edit/comment', postController.editComment);
router.delete('/remove', postController.removePost);
router.delete('/remove/comment', postController.removeComment);
router.get('/movie/:movieId', postController.getPostsOfMovie);
router.get('/post/:postId/comments', postController.getCommentsOfPost);
router.get('/user/:userId/posts', postController.getPostsOfUser);
router.get('/user/:userId/comments', postController.getCommentsOfUser);

module.exports = router;
