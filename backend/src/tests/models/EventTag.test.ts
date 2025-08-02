import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { EventTagModel, EventTagAssignmentModel } from '@/models/EventTag';
import { EventModel } from '@/models/Event';
import { UserModel } from '@/models/User';
import { EventValidationError } from '@/utils/eventValidation';
import { db } from '@/config/database';

describe('EventTagModel and EventTagAssignmentModel', () => {
  let testTagIds: number[] = [];
  let testEventId: number;
  let testOrganizerId: number;

  // Helper function to generate unique test data
  const generateUniqueTagData = (suffix?: string) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const uniqueSuffix = suffix || `${timestamp}_${randomNum}`;

    return {
      name: `Test Tag ${uniqueSuffix}`,
      description: `Test tag description for ${uniqueSuffix}`,
      color_hex: '#FF5733',
      is_active: true
    };
  };

  const generateUniqueEventData = () => {
    const timestamp = Date.now();
    const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

    return {
      organizer_user_id: testOrganizerId,
      event_name: `Test Event ${timestamp}`,
      description: 'Test event for tag testing',
      location: 'Test Location',
      start_datetime: startDate,
      end_datetime: endDate,
      total_tickets_available: 100
    };
  };

  beforeAll(async () => {
    // Create test organizer user
    const userData = {
      username: `test_tag_organizer_${Date.now()}`,
      email: `test_tag_organizer_${Date.now()}@example.com`,
      password: 'password123',
      first_name: 'Test',
      last_name: 'Organizer',
    };

    const user = await UserModel.create(userData);
    
    // Create organizer record
    await db('organizers').insert({
      user_id: user.user_id,
      company_name: 'Test Tag Event Company',
      business_type: 'llc',
      business_description: 'Test event organization for tags',
      business_email: 'business@testtag.com',
      is_verified: true,
      commission_rate: 0.05
    });

    testOrganizerId = user.user_id;

    // Create test event
    const eventData = generateUniqueEventData();
    const event = await EventModel.create(eventData);
    testEventId = event.event_id;

    // Clean up any existing test tags
    await db('event_tags').where('name', 'like', 'Test Tag%').del();
  });

  afterAll(async () => {
    // Clean up test data
    await db('event_tag_assignments').where('event_id', testEventId).del();
    await db('events').where('event_id', testEventId).del();
    await db('event_tags').whereIn('tag_id', testTagIds).del();
    await db('organizers').where('user_id', testOrganizerId).del();
    await db('users').where('user_id', testOrganizerId).del();
  });

  beforeEach(async () => {
    // Clean up tags created in previous tests
    await db('event_tag_assignments').whereIn('tag_id', testTagIds).del();
    await db('event_tags').whereIn('tag_id', testTagIds).del();
    testTagIds = [];
  });

  describe('EventTagModel CRUD Operations', () => {
    it('should create a new tag with validation', async () => {
      const tagData = generateUniqueTagData();

      const tag = await EventTagModel.create(tagData);
      testTagIds.push(tag.tag_id);

      expect(tag).toBeDefined();
      expect(tag.name).toBe(tagData.name);
      expect(tag.description).toBe(tagData.description);
      expect(tag.color_hex).toBe(tagData.color_hex);
      expect(tag.is_active).toBe(true);
      expect(tag.usage_count).toBe(0);
      expect(tag.slug).toBeDefined();
      expect(tag.slug).toMatch(/^test-tag-/);
    });

    it('should validate required fields', async () => {
      const invalidTagData = {
        // Missing required name field
        description: 'Test description'
      };

      await expect(EventTagModel.create(invalidTagData as any))
        .rejects.toThrow(EventValidationError);
    });

    it('should validate name length', async () => {
      const tagData = generateUniqueTagData();
      tagData.name = 'a'.repeat(51); // Too long

      await expect(EventTagModel.create(tagData))
        .rejects.toThrow(EventValidationError);
    });

    it('should validate color hex format', async () => {
      const tagData = generateUniqueTagData();
      tagData.color_hex = 'invalid-color';

      await expect(EventTagModel.create(tagData))
        .rejects.toThrow(EventValidationError);
    });

    it('should find tag by ID', async () => {
      const tagData = generateUniqueTagData();
      const createdTag = await EventTagModel.create(tagData);
      testTagIds.push(createdTag.tag_id);

      const foundTag = await EventTagModel.findById(createdTag.tag_id);

      expect(foundTag).toBeDefined();
      expect(foundTag?.tag_id).toBe(createdTag.tag_id);
      expect(foundTag?.name).toBe(tagData.name);
    });

    it('should find tag by slug', async () => {
      const tagData = generateUniqueTagData();
      const createdTag = await EventTagModel.create(tagData);
      testTagIds.push(createdTag.tag_id);

      const foundTag = await EventTagModel.findBySlug(createdTag.slug);

      expect(foundTag).toBeDefined();
      expect(foundTag?.tag_id).toBe(createdTag.tag_id);
      expect(foundTag?.slug).toBe(createdTag.slug);
    });

    it('should update tag', async () => {
      const tagData = generateUniqueTagData();
      const createdTag = await EventTagModel.create(tagData);
      testTagIds.push(createdTag.tag_id);

      const updateData = {
        name: 'Updated Tag Name',
        description: 'Updated description',
        color_hex: '#00FF00'
      };

      const updatedTag = await EventTagModel.update(createdTag.tag_id, updateData);

      expect(updatedTag.name).toBe(updateData.name);
      expect(updatedTag.description).toBe(updateData.description);
      expect(updatedTag.color_hex).toBe(updateData.color_hex);
      expect(updatedTag.slug).toMatch(/^updated-tag-name/);
    });

    it('should soft delete tag', async () => {
      const tagData = generateUniqueTagData();
      const createdTag = await EventTagModel.create(tagData);
      testTagIds.push(createdTag.tag_id);

      await EventTagModel.delete(createdTag.tag_id);

      const deletedTag = await EventTagModel.findById(createdTag.tag_id);
      expect(deletedTag?.is_active).toBe(false);
      expect(deletedTag?.usage_count).toBe(0);
    });
  });

  describe('EventTagModel Search and Filtering', () => {
    it('should get all active tags', async () => {
      const activeData = generateUniqueTagData('active');
      const activeTag = await EventTagModel.create(activeData);
      testTagIds.push(activeTag.tag_id);

      const inactiveData = generateUniqueTagData('inactive');
      inactiveData.is_active = false;
      const inactiveTag = await EventTagModel.create(inactiveData);
      testTagIds.push(inactiveTag.tag_id);

      const activeTags = await EventTagModel.getAll({ is_active: true });

      expect(activeTags.every(tag => tag.is_active)).toBe(true);
      expect(activeTags.some(tag => tag.tag_id === activeTag.tag_id)).toBe(true);
      expect(activeTags.some(tag => tag.tag_id === inactiveTag.tag_id)).toBe(false);
    });

    it('should search tags by name', async () => {
      const searchData = generateUniqueTagData('searchable');
      const searchTag = await EventTagModel.create(searchData);
      testTagIds.push(searchTag.tag_id);

      const results = await EventTagModel.search('searchable');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(tag => tag.tag_id === searchTag.tag_id)).toBe(true);
    });

    it('should search tags by description', async () => {
      const searchData = generateUniqueTagData();
      searchData.description = 'unique searchable description';
      const searchTag = await EventTagModel.create(searchData);
      testTagIds.push(searchTag.tag_id);

      const results = await EventTagModel.search('searchable description');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(tag => tag.tag_id === searchTag.tag_id)).toBe(true);
    });

    it('should get popular tags sorted by usage count', async () => {
      const tag1Data = generateUniqueTagData('popular1');
      const tag1 = await EventTagModel.create(tag1Data);
      testTagIds.push(tag1.tag_id);

      const tag2Data = generateUniqueTagData('popular2');
      const tag2 = await EventTagModel.create(tag2Data);
      testTagIds.push(tag2.tag_id);

      // Simulate usage by incrementing counts
      await EventTagModel.incrementUsageCount(tag1.tag_id, 5);
      await EventTagModel.incrementUsageCount(tag2.tag_id, 10);

      const popularTags = await EventTagModel.getPopularTags(10);

      const tag1InResults = popularTags.find(t => t.tag_id === tag1.tag_id);
      const tag2InResults = popularTags.find(t => t.tag_id === tag2.tag_id);

      expect(tag1InResults?.usage_count).toBe(5);
      expect(tag2InResults?.usage_count).toBe(10);

      // Should be sorted by usage count descending
      const tag1Index = popularTags.findIndex(t => t.tag_id === tag1.tag_id);
      const tag2Index = popularTags.findIndex(t => t.tag_id === tag2.tag_id);
      expect(tag2Index).toBeLessThan(tag1Index);
    });

    it('should generate unique slugs for duplicate names', async () => {
      const timestamp = Date.now();
      const tagData1 = generateUniqueTagData();
      tagData1.name = `Duplicate Tag ${timestamp}`;
      const tag1 = await EventTagModel.create(tagData1);
      testTagIds.push(tag1.tag_id);

      const tagData2 = generateUniqueTagData();
      // Create a name that would generate the same slug but is different
      tagData2.name = `Duplicate-Tag ${timestamp}`;
      const tag2 = await EventTagModel.create(tagData2);
      testTagIds.push(tag2.tag_id);

      expect(tag1.slug).toMatch(/^duplicate-tag-/);
      expect(tag2.slug).toMatch(/^duplicate-tag-/);
      expect(tag1.slug).not.toBe(tag2.slug);
    });
  });

  describe('EventTagAssignmentModel Operations', () => {
    it('should assign tags to event', async () => {
      const tag1Data = generateUniqueTagData('assign1');
      const tag1 = await EventTagModel.create(tag1Data);
      testTagIds.push(tag1.tag_id);

      const tag2Data = generateUniqueTagData('assign2');
      const tag2 = await EventTagModel.create(tag2Data);
      testTagIds.push(tag2.tag_id);

      const assignments = await EventTagAssignmentModel.assignTagsToEvent(
        testEventId, 
        [tag1.tag_id, tag2.tag_id]
      );

      expect(assignments).toHaveLength(2);
      expect(assignments.every(a => a.event_id === testEventId)).toBe(true);

      // Check usage counts were incremented
      const updatedTag1 = await EventTagModel.findById(tag1.tag_id);
      const updatedTag2 = await EventTagModel.findById(tag2.tag_id);
      expect(updatedTag1?.usage_count).toBe(1);
      expect(updatedTag2?.usage_count).toBe(1);
    });

    it('should validate tag IDs when assigning', async () => {
      await expect(EventTagAssignmentModel.assignTagsToEvent(testEventId, [999999]))
        .rejects.toThrow(EventValidationError);
    });

    it('should get tags for event', async () => {
      const tag1Data = generateUniqueTagData('event_tags1');
      const tag1 = await EventTagModel.create(tag1Data);
      testTagIds.push(tag1.tag_id);

      const tag2Data = generateUniqueTagData('event_tags2');
      const tag2 = await EventTagModel.create(tag2Data);
      testTagIds.push(tag2.tag_id);

      await EventTagAssignmentModel.assignTagsToEvent(testEventId, [tag1.tag_id, tag2.tag_id]);

      const eventTags = await EventTagModel.getTagsForEvent(testEventId);

      expect(eventTags).toHaveLength(2);
      expect(eventTags.map(t => t.tag_id)).toEqual(expect.arrayContaining([tag1.tag_id, tag2.tag_id]));
    });

    it('should remove tags from event', async () => {
      const tag1Data = generateUniqueTagData('remove1');
      const tag1 = await EventTagModel.create(tag1Data);
      testTagIds.push(tag1.tag_id);

      const tag2Data = generateUniqueTagData('remove2');
      const tag2 = await EventTagModel.create(tag2Data);
      testTagIds.push(tag2.tag_id);

      // Assign tags first
      await EventTagAssignmentModel.assignTagsToEvent(testEventId, [tag1.tag_id, tag2.tag_id]);

      // Remove all tags
      await EventTagAssignmentModel.removeTagsFromEvent(testEventId);

      const eventTags = await EventTagModel.getTagsForEvent(testEventId);
      expect(eventTags).toHaveLength(0);

      // Check usage counts were decremented
      const updatedTag1 = await EventTagModel.findById(tag1.tag_id);
      const updatedTag2 = await EventTagModel.findById(tag2.tag_id);
      expect(updatedTag1?.usage_count).toBe(0);
      expect(updatedTag2?.usage_count).toBe(0);
    });

    it('should remove specific tag from event', async () => {
      const tag1Data = generateUniqueTagData('specific1');
      const tag1 = await EventTagModel.create(tag1Data);
      testTagIds.push(tag1.tag_id);

      const tag2Data = generateUniqueTagData('specific2');
      const tag2 = await EventTagModel.create(tag2Data);
      testTagIds.push(tag2.tag_id);

      // Assign both tags
      await EventTagAssignmentModel.assignTagsToEvent(testEventId, [tag1.tag_id, tag2.tag_id]);

      // Remove only one tag
      await EventTagAssignmentModel.removeTagFromEvent(testEventId, tag1.tag_id);

      const eventTags = await EventTagModel.getTagsForEvent(testEventId);
      expect(eventTags).toHaveLength(1);
      expect(eventTags[0]?.tag_id).toBe(tag2.tag_id);

      // Check usage counts
      const updatedTag1 = await EventTagModel.findById(tag1.tag_id);
      const updatedTag2 = await EventTagModel.findById(tag2.tag_id);
      expect(updatedTag1?.usage_count).toBe(0);
      expect(updatedTag2?.usage_count).toBe(1);
    });

    it('should check if tag is assigned to event', async () => {
      const tagData = generateUniqueTagData('check_assigned');
      const tag = await EventTagModel.create(tagData);
      testTagIds.push(tag.tag_id);

      // Initially not assigned
      let isAssigned = await EventTagAssignmentModel.isTagAssignedToEvent(testEventId, tag.tag_id);
      expect(isAssigned).toBe(false);

      // Assign tag
      await EventTagAssignmentModel.assignTagsToEvent(testEventId, [tag.tag_id]);

      // Now should be assigned
      isAssigned = await EventTagAssignmentModel.isTagAssignedToEvent(testEventId, tag.tag_id);
      expect(isAssigned).toBe(true);
    });

    it('should replace existing tags when reassigning', async () => {
      const tag1Data = generateUniqueTagData('replace1');
      const tag1 = await EventTagModel.create(tag1Data);
      testTagIds.push(tag1.tag_id);

      const tag2Data = generateUniqueTagData('replace2');
      const tag2 = await EventTagModel.create(tag2Data);
      testTagIds.push(tag2.tag_id);

      const tag3Data = generateUniqueTagData('replace3');
      const tag3 = await EventTagModel.create(tag3Data);
      testTagIds.push(tag3.tag_id);

      // Assign first set of tags
      await EventTagAssignmentModel.assignTagsToEvent(testEventId, [tag1.tag_id, tag2.tag_id]);

      // Reassign with different tags
      await EventTagAssignmentModel.assignTagsToEvent(testEventId, [tag2.tag_id, tag3.tag_id]);

      const eventTags = await EventTagModel.getTagsForEvent(testEventId);
      expect(eventTags).toHaveLength(2);
      expect(eventTags.map(t => t.tag_id)).toEqual(expect.arrayContaining([tag2.tag_id, tag3.tag_id]));

      // Check usage counts
      const updatedTag1 = await EventTagModel.findById(tag1.tag_id);
      const updatedTag2 = await EventTagModel.findById(tag2.tag_id);
      const updatedTag3 = await EventTagModel.findById(tag3.tag_id);
      expect(updatedTag1?.usage_count).toBe(0); // Removed
      expect(updatedTag2?.usage_count).toBe(1); // Kept
      expect(updatedTag3?.usage_count).toBe(1); // Added
    });
  });

  describe('Usage Count Management', () => {
    it('should increment and decrement usage counts', async () => {
      const tagData = generateUniqueTagData('usage_count');
      const tag = await EventTagModel.create(tagData);
      testTagIds.push(tag.tag_id);

      // Increment usage count
      await EventTagModel.incrementUsageCount(tag.tag_id, 3);
      let updatedTag = await EventTagModel.findById(tag.tag_id);
      expect(updatedTag?.usage_count).toBe(3);

      // Decrement usage count
      await EventTagModel.decrementUsageCount(tag.tag_id, 1);
      updatedTag = await EventTagModel.findById(tag.tag_id);
      expect(updatedTag?.usage_count).toBe(2);
    });

    it('should not decrement usage count below zero', async () => {
      const tagData = generateUniqueTagData('no_negative');
      const tag = await EventTagModel.create(tagData);
      testTagIds.push(tag.tag_id);

      // Try to decrement when count is 0
      await EventTagModel.decrementUsageCount(tag.tag_id, 5);
      const updatedTag = await EventTagModel.findById(tag.tag_id);
      expect(updatedTag?.usage_count).toBe(0); // Should remain 0
    });
  });
});
