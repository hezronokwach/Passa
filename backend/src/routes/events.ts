import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { EventController } from '@/controllers/EventController';
import { authMiddleware, requireRole } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';

const router = Router();
const eventController = new EventController();

// Get all events (public)
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('location').optional().isString(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  validateRequest,
], eventController.getEvents);

// Get single event (public)
router.get('/:id', [
  param('id').isUUID(),
  validateRequest,
], eventController.getEvent);

// Create new event (organizers only)
router.post('/', [
  authMiddleware,
  requireRole(['organizer', 'admin']),
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('category').isIn(['music', 'comedy', 'conference', 'festival', 'sports', 'other']),
  body('venue').isObject(),
  body('venue.name').trim().isLength({ min: 2 }),
  body('venue.address').trim().isLength({ min: 5 }),
  body('venue.capacity').isInt({ min: 1 }),
  body('dateTime').isISO8601(),
  body('pricing').isArray({ min: 1 }),
  body('pricing.*.tier').isString(),
  body('pricing.*.price').isFloat({ min: 0 }),
  body('pricing.*.quantity').isInt({ min: 1 }),
  validateRequest,
], eventController.createEvent);

// Update event
router.put('/:id', [
  authMiddleware,
  requireRole(['organizer', 'admin']),
  param('id').isUUID(),
  validateRequest,
], eventController.updateEvent);

// Delete event
router.delete('/:id', [
  authMiddleware,
  requireRole(['organizer', 'admin']),
  param('id').isUUID(),
  validateRequest,
], eventController.deleteEvent);

// Get event analytics
router.get('/:id/analytics', [
  authMiddleware,
  requireRole(['organizer', 'admin']),
  param('id').isUUID(),
  validateRequest,
], eventController.getEventAnalytics);

// Add creator partner to event
router.post('/:id/creators', [
  authMiddleware,
  requireRole(['organizer', 'admin']),
  param('id').isUUID(),
  body('creatorId').isUUID(),
  body('commissionRate').isFloat({ min: 0, max: 50 }),
  validateRequest,
], eventController.addCreatorPartner);

// Add brand sponsor to event
router.post('/:id/sponsors', [
  authMiddleware,
  requireRole(['organizer', 'admin']),
  param('id').isUUID(),
  body('brandId').isUUID(),
  body('sponsorshipAmount').isFloat({ min: 0 }),
  body('sponsorshipType').isIn(['title', 'presenting', 'supporting', 'media']),
  validateRequest,
], eventController.addBrandSponsor);

export default router;
