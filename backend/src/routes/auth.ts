import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '@/controllers/AuthController';
import { validateRequest } from '@/middleware/validateRequest';

const router = Router();
const authController = new AuthController();

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('role').isIn(['fan', 'creator', 'organizer', 'brand']),
  validateRequest,
], authController.register);

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest,
], authController.login);

// Refresh token
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
  validateRequest,
], authController.forgotPassword);

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
  validateRequest,
], authController.resetPassword);

// Verify email
router.post('/verify-email', [
  body('token').notEmpty(),
  validateRequest,
], authController.verifyEmail);

// Connect Stellar wallet
router.post('/connect-wallet', [
  body('publicKey').notEmpty(),
  body('signature').notEmpty(),
  validateRequest,
], authController.connectWallet);

export default router;
