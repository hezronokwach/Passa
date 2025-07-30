import { Router } from 'express';

const router = Router();

// Placeholder routes for users - will be implemented in user management issue
router.get('/health', (_req, res) => {
  res.json({ message: 'User routes placeholder' });
});

export default router;
