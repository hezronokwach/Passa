import { Router } from 'express';

const router = Router();

// Placeholder routes for auth - will be implemented in authentication issue
router.get('/health', (_req, res) => {
  res.json({ message: 'Auth routes placeholder' });
});

export default router;
