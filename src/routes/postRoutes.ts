import { Router } from 'express';
import { PostController } from '../controllers/PostController';

const router = Router();

// GET /posts
router.get('/', PostController.getPosts);

// POST /posts
router.post('/', PostController.createPost);

// PATCH /posts/:id
router.patch('/:id', PostController.updatePost);

// DELETE /posts/:id
router.delete('/:id', PostController.deletePost);

export default router;
