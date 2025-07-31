import { Router } from 'express';

const router = Router();

// Placeholder routes for events - will be implemented in event management issue
router.get('/health', (_req, res) => {
  res.json({ message: 'Event routes placeholder' });
});

export default router;
