import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware as any);

// User profile routes
router.get('/profile/:userId(\\d+)', UserController.getProfile);
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.put('/profile/details', UserController.updateProfileDetails);

// User dashboard route
router.get('/dashboard', UserController.getDashboard);

// User settings route
router.put('/settings', UserController.updateSettings);

// User activity routes
router.get('/activity', UserController.getActivityHistory);

// User search route
router.get('/search', UserController.searchUsers);

// User statistics route
router.get('/stats/:userId(\\d+)', UserController.getUserStats);
router.get('/stats', UserController.getUserStats);

// Account management routes
router.put('/deactivate', UserController.deactivateAccount);
router.delete('/delete', UserController.deleteAccount);

// User following routes
router.post('/follow/:userId(\\d+)', UserController.followUser);
router.delete('/unfollow/:userId(\\d+)', UserController.unfollowUser);
router.get('/followers/:userId(\\d+)', UserController.getFollowers);
router.get('/following/:userId(\\d+)', UserController.getFollowing);
router.get('/following/check/:userId(\\d+)', UserController.checkFollowing);

export default router;
