import { Router } from 'express';
import { UserController } from '@/controllers/UserController';

const router = Router();
const userController = new UserController();

// Get current user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Get user's events
router.get('/events', userController.getUserEvents);

// Get user's tickets
router.get('/tickets', userController.getUserTickets);

export default router;
