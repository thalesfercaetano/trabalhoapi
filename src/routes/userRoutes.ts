import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// GET /users/age-range
router.get('/age-range', UserController.getUsersByAgeRange);

// GET /users/:id
router.get('/:id', UserController.getUserById);

// PUT /users/:id
router.put('/:id', UserController.updateUser);

// DELETE /users/cleanup-inactive
router.delete('/cleanup-inactive', UserController.cleanupInactiveUsers);

export default router;
