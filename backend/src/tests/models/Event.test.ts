import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { EventModel, EventValidationError } from '@/models/Event';
import { EventCategoryModel } from '@/models/EventCategory';
import { EventTagModel } from '@/models/EventTag';
import { UserModel } from '@/models/User';
import { db } from '@/config/database';

describe('EventModel', () => {
  let testOrganizerId: number;
  let testCategoryId: number;
  let testTagIds: number[] = [];

  // Helper function to generate unique test data
  const generateUniqueEventData = (suffix?: string) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const uniqueSuffix = suffix || `${timestamp}_${randomNum}`;
    const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later

    return {
      organizer_user_id: testOrganizerId,
      category_id: testCategoryId,
      event_name: `Test Event ${uniqueSuffix}`,
      description: `This is a test event description for ${uniqueSuffix}`,
      short_description: `Short description for ${uniqueSuffix}`,
      location: `Test Location ${uniqueSuffix}`,
      latitude: 40.7128,
      longitude: -74.0060,
      venue_name: `Test Venue ${uniqueSuffix}`,
      venue_address: `123 Test St, Test City, TC 12345`,
      start_datetime: startDate,
      end_datetime: endDate,
      timezone: 'America/New_York',
      total_tickets_available: 100,
      min_ticket_price: 25.00,
      max_ticket_price: 75.00,
      currency: 'USD',
      cover_image_url: 'https://example.com/cover.jpg',
      gallery_images: ['https://example.com/gallery1.jpg', 'https://example.com/gallery2.jpg'],
      metadata: { test: true, suffix: uniqueSuffix },
      is_featured: false,
      is_private: false,
      tag_ids: testTagIds.slice(0, 2)
    };
  };

  beforeAll(async () => {
    // Create test organizer user
    const userData = {
      username: `test_organizer_${Date.now()}`,
      email: `test_organizer_${Date.now()}@example.com`,
      password: 'password123',
      first_name: 'Test',
      last_name: 'Organizer',
    };

    const user = await UserModel.create(userData);
    
    // Create organizer record
    await db('organizers').insert({
      user_id: user.user_id,
      company_name: 'Test Event Company',
      business_type: 'llc',
      business_description: 'Test event organization',
      business_email: 'business@test.com',
      is_verified: true,
      commission_rate: 0.05
    });

    testOrganizerId = user.user_id;

    // Create test category
    const category = await EventCategoryModel.create({
      name: 'Test Category',
      description: 'Test category for events',
      color_hex: '#FF0000',
      sort_order: 1
    });
    testCategoryId = category.category_id;

    // Create test tags
    const tag1 = await EventTagModel.create({
      name: 'Test Tag 1',
      description: 'First test tag',
      color_hex: '#00FF00'
    });

    const tag2 = await EventTagModel.create({
      name: 'Test Tag 2',
      description: 'Second test tag',
      color_hex: '#0000FF'
    });

    testTagIds = [tag1.tag_id, tag2.tag_id];
  });

  afterAll(async () => {
    // Clean up test data
    await db('event_tag_assignments').where('event_id', 'in', 
      db('events').select('event_id').where('organizer_user_id', testOrganizerId)
    ).del();
    
    await db('events').where('organizer_user_id', testOrganizerId).del();
    await db('event_tags').whereIn('tag_id', testTagIds).del();
    await db('event_categories').where('category_id', testCategoryId).del();
    await db('organizers').where('user_id', testOrganizerId).del();
    await db('users').where('user_id', testOrganizerId).del();
  });

  beforeEach(async () => {
    // Clean up any events created in previous tests
    await db('event_tag_assignments').where('event_id', 'in', 
      db('events').select('event_id').where('organizer_user_id', testOrganizerId)
    ).del();
    await db('events').where('organizer_user_id', testOrganizerId).del();
  });

  describe('CRUD Operations', () => {
    it('should create a new event with validation', async () => {
      const eventData = generateUniqueEventData();

      const event = await EventModel.create(eventData);

      expect(event).toBeDefined();
      expect(event.event_name).toBe(eventData.event_name);
      expect(event.organizer_user_id).toBe(eventData.organizer_user_id);
      expect(event.category_id).toBe(eventData.category_id);
      expect(event.location).toBe(eventData.location);
      expect(event.status).toBe('draft');
      expect(event.tickets_sold).toBe(0);
      expect(event.is_deleted).toBe(false);
      expect(event.slug).toBeDefined();
      expect(event.slug).toMatch(/^test-event-/);
    });

    it('should validate required fields', async () => {
      const invalidEventData = {
        organizer_user_id: testOrganizerId,
        // Missing required fields
      };

      await expect(EventModel.create(invalidEventData as any)).rejects.toThrow(EventValidationError);
    });

    it('should validate event dates', async () => {
      const eventData = generateUniqueEventData();
      // Set start date in the past
      eventData.start_datetime = new Date(Date.now() - 24 * 60 * 60 * 1000);

      await expect(EventModel.create(eventData)).rejects.toThrow(EventValidationError);
    });

    it('should validate end date after start date', async () => {
      const eventData = generateUniqueEventData();
      // Set end date before start date
      eventData.end_datetime = new Date(eventData.start_datetime.getTime() - 60 * 60 * 1000);

      await expect(EventModel.create(eventData)).rejects.toThrow(EventValidationError);
    });

    it('should validate ticket capacity', async () => {
      const eventData = generateUniqueEventData();
      eventData.total_tickets_available = -1;

      await expect(EventModel.create(eventData)).rejects.toThrow(EventValidationError);
    });

    it('should validate ticket pricing', async () => {
      const eventData = generateUniqueEventData();
      eventData.min_ticket_price = 100;
      eventData.max_ticket_price = 50; // Max less than min

      await expect(EventModel.create(eventData)).rejects.toThrow(EventValidationError);
    });

    it('should find event by ID', async () => {
      const eventData = generateUniqueEventData();
      const createdEvent = await EventModel.create(eventData);

      const foundEvent = await EventModel.findById(createdEvent.event_id);

      expect(foundEvent).toBeDefined();
      expect(foundEvent?.event_id).toBe(createdEvent.event_id);
      expect(foundEvent?.event_name).toBe(eventData.event_name);
    });

    it('should find event by slug', async () => {
      const eventData = generateUniqueEventData();
      const createdEvent = await EventModel.create(eventData);

      const foundEvent = await EventModel.findBySlug(createdEvent.slug);

      expect(foundEvent).toBeDefined();
      expect(foundEvent?.event_id).toBe(createdEvent.event_id);
      expect(foundEvent?.slug).toBe(createdEvent.slug);
    });

    it('should update event', async () => {
      const eventData = generateUniqueEventData();
      const createdEvent = await EventModel.create(eventData);

      const updateData = {
        event_name: 'Updated Event Name',
        description: 'Updated description',
        total_tickets_available: 200
      };

      const updatedEvent = await EventModel.update(createdEvent.event_id, updateData);

      expect(updatedEvent.event_name).toBe(updateData.event_name);
      expect(updatedEvent.description).toBe(updateData.description);
      expect(updatedEvent.total_tickets_available).toBe(updateData.total_tickets_available);
      expect(updatedEvent.slug).toMatch(/^updated-event-name/);
    });

    it('should soft delete event', async () => {
      const eventData = generateUniqueEventData();
      const createdEvent = await EventModel.create(eventData);

      await EventModel.delete(createdEvent.event_id);

      const deletedEvent = await EventModel.findById(createdEvent.event_id);
      expect(deletedEvent).toBeNull();

      // Verify it's soft deleted in database
      const softDeletedEvent = await db('events')
        .where('event_id', createdEvent.event_id)
        .first();
      expect(softDeletedEvent.is_deleted).toBe(true);
      expect(softDeletedEvent.deleted_at).toBeDefined();
    });
  });

  describe('Status Management', () => {
    it('should update event status', async () => {
      const eventData = generateUniqueEventData();
      const createdEvent = await EventModel.create(eventData);

      const publishedEvent = await EventModel.updateStatus(createdEvent.event_id, 'published');

      expect(publishedEvent.status).toBe('published');
      expect(publishedEvent.published_at).toBeDefined();
    });

    it('should validate status values', async () => {
      const eventData = generateUniqueEventData();
      const createdEvent = await EventModel.create(eventData);

      await expect(EventModel.updateStatus(createdEvent.event_id, 'invalid-status' as any))
        .rejects.toThrow(EventValidationError);
    });
  });

  describe('Search and Filtering', () => {
    it('should search events by name', async () => {
      const eventData = generateUniqueEventData('search');
      await EventModel.create(eventData);

      const result = await EventModel.search({ event_name: 'search' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.event_name).toContain('search');
      expect(result.total).toBe(1);
    });

    it('should filter events by organizer', async () => {
      const eventData = generateUniqueEventData('organizer');
      await EventModel.create(eventData);

      const result = await EventModel.search({ organizer_user_id: testOrganizerId });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]?.organizer_user_id).toBe(testOrganizerId);
    });

    it('should filter events by category', async () => {
      const eventData = generateUniqueEventData('category');
      await EventModel.create(eventData);

      const result = await EventModel.search({ category_id: testCategoryId });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]?.category_id).toBe(testCategoryId);
    });

    it('should filter events by status', async () => {
      const eventData = generateUniqueEventData('status');
      const createdEvent = await EventModel.create(eventData);
      await EventModel.updateStatus(createdEvent.event_id, 'published');

      const result = await EventModel.search({ status: 'published' });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]?.status).toBe('published');
    });

    it('should paginate search results', async () => {
      // Create multiple events
      for (let i = 0; i < 5; i++) {
        const eventData = generateUniqueEventData(`pagination_${i}`);
        await EventModel.create(eventData);
      }

      const result = await EventModel.search({ 
        organizer_user_id: testOrganizerId,
        page: 1,
        limit: 3
      });

      expect(result.data.length).toBeLessThanOrEqual(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(3);
      expect(result.total).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Tag Integration', () => {
    it('should create event with tags', async () => {
      const eventData = generateUniqueEventData('tags');
      const createdEvent = await EventModel.create(eventData);

      const tags = await EventTagModel.getTagsForEvent(createdEvent.event_id);

      expect(tags).toHaveLength(2);
      expect(tags.map(t => t.tag_id)).toEqual(expect.arrayContaining(testTagIds.slice(0, 2)));
    });

    it('should update event tags', async () => {
      const eventData = generateUniqueEventData('update_tags');
      const createdEvent = await EventModel.create(eventData);

      // Update with only one tag - we need to use the tag assignment model directly
      // since tag_ids is not a database column but handled through the assignment table
      const { EventTagAssignmentModel } = await import('@/models/EventTag');
      await EventTagAssignmentModel.assignTagsToEvent(createdEvent.event_id, [testTagIds[0]!]);

      const tags = await EventTagModel.getTagsForEvent(createdEvent.event_id);

      expect(tags).toHaveLength(1);
      expect(tags[0]?.tag_id).toBe(testTagIds[0]);
    });

    it('should filter events by tags', async () => {
      const eventData = generateUniqueEventData('tag_filter');
      await EventModel.create(eventData);

      const result = await EventModel.search({ tag_ids: [testTagIds[0]!] });

      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('Event Statistics', () => {
    it('should get event statistics for organizer', async () => {
      const eventData1 = generateUniqueEventData('stats1');
      const eventData2 = generateUniqueEventData('stats2');

      const event1 = await EventModel.create(eventData1);
      await EventModel.create(eventData2);

      await EventModel.updateStatus(event1.event_id, 'published');

      const stats = await EventModel.getStatistics(testOrganizerId);

      expect(stats['total_events']).toBeGreaterThanOrEqual(2);
      expect(stats['published_events']).toBeGreaterThanOrEqual(1);
      expect(stats['draft_events']).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Ticket Management', () => {
    it('should increment tickets sold', async () => {
      const eventData = generateUniqueEventData('tickets');
      const createdEvent = await EventModel.create(eventData);

      await EventModel.incrementTicketsSold(createdEvent.event_id, 5);

      const updatedEvent = await EventModel.findById(createdEvent.event_id);
      expect(updatedEvent?.tickets_sold).toBe(5);
    });

    it('should not allow overselling tickets', async () => {
      const eventData = generateUniqueEventData('oversell');
      eventData.total_tickets_available = 10;
      const createdEvent = await EventModel.create(eventData);

      await expect(EventModel.incrementTicketsSold(createdEvent.event_id, 15))
        .rejects.toThrow(EventValidationError);
    });

    it('should decrement tickets sold for refunds', async () => {
      const eventData = generateUniqueEventData('refund');
      const createdEvent = await EventModel.create(eventData);

      await EventModel.incrementTicketsSold(createdEvent.event_id, 10);
      await EventModel.decrementTicketsSold(createdEvent.event_id, 3);

      const updatedEvent = await EventModel.findById(createdEvent.event_id);
      expect(updatedEvent?.tickets_sold).toBe(7);
    });
  });

  describe('Utility Methods', () => {
    it('should check if event exists', async () => {
      const eventData = generateUniqueEventData('exists');
      const createdEvent = await EventModel.create(eventData);

      const exists = await EventModel.exists(createdEvent.event_id);
      expect(exists).toBe(true);

      const notExists = await EventModel.exists(999999);
      expect(notExists).toBe(false);
    });

    it('should check if slug exists', async () => {
      const eventData = generateUniqueEventData('slug_exists');
      const createdEvent = await EventModel.create(eventData);

      const exists = await EventModel.slugExists(createdEvent.slug);
      expect(exists).toBe(true);

      const notExists = await EventModel.slugExists('non-existent-slug');
      expect(notExists).toBe(false);
    });

    it('should get featured events', async () => {
      const eventData = generateUniqueEventData('featured');
      eventData.is_featured = true;
      const createdEvent = await EventModel.create(eventData);
      await EventModel.updateStatus(createdEvent.event_id, 'published');

      const featuredEvents = await EventModel.getFeaturedEvents(10);

      expect(featuredEvents.length).toBeGreaterThan(0);
      expect(featuredEvents.every(e => e.is_featured)).toBe(true);
      expect(featuredEvents.every(e => e.status === 'published')).toBe(true);
    });

    it('should get upcoming events', async () => {
      const eventData = generateUniqueEventData('upcoming');
      const createdEvent = await EventModel.create(eventData);
      await EventModel.updateStatus(createdEvent.event_id, 'published');

      const upcomingEvents = await EventModel.getUpcomingEvents(10);

      expect(upcomingEvents.length).toBeGreaterThan(0);
      expect(upcomingEvents.every(e => e.status === 'published')).toBe(true);
      expect(upcomingEvents.every(e => new Date(e.start_datetime) > new Date())).toBe(true);
    });
  });
});
