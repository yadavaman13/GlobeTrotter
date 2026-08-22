import { Router } from 'express';
import * as communityController from '../controllers/community.controller.js';
import { protect } from '../../auth/middleware/auth.middleware.js';
import {
    createPostValidator,
    updatePostValidator,
    getPostsValidator,
} from '../validators/community.validator.js';

const router = Router();

// Public feeds
router.get('/posts', getPostsValidator, communityController.getPosts);
router.get('/posts/:postId', communityController.getPostById);
router.get('/posts/:postId/comments', communityController.getComments);

// Authenticated endpoints
router.use(protect);
router.post('/posts', createPostValidator, communityController.createPost);
router.patch('/posts/:postId', updatePostValidator, communityController.updatePost);
router.delete('/posts/:postId', communityController.deletePost);
router.post('/posts/:postId/like', communityController.toggleLikePost);
router.post('/posts/:postId/comments', communityController.addComment);

export default router;
