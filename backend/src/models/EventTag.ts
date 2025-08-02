import { db } from '@/config/database';
import {
  EventTag,
  CreateEventTagInput,
  UpdateEventTagInput,
  EventTagAssignment
} from '@/types/event';
import { EventValidation, EventValidationError } from '@/utils/eventValidation';

export class EventTagModel {
  private static readonly TABLE = 'event_tags';

  /**
   * Create a new event tag
   */
  static async create(tagData: CreateEventTagInput): Promise<EventTag> {
    try {
      // Validate input first
      this.validateTagInput(tagData);

      // Generate slug from name (validation ensures name exists)
      const slug = EventValidation.generateSlug(tagData.name);
      const uniqueSlug = await this.generateUniqueSlug(slug);

      const [tag] = await db(this.TABLE)
        .insert({
          name: tagData.name.trim(),
          slug: uniqueSlug,
          description: tagData.description?.trim(),
          color_hex: tagData.color_hex,
          usage_count: 0,
          is_active: tagData.is_active !== undefined ? tagData.is_active : true,
        })
        .returning('*');

      return tag;
    } catch (error) {
      if (error instanceof EventValidationError) {
        throw error;
      }
      throw new Error(`Failed to create tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find tag by ID
   */
  static async findById(id: number): Promise<EventTag | null> {
    const tag = await db(this.TABLE)
      .where('tag_id', id)
      .first();

    return tag || null;
  }

  /**
   * Find tag by slug
   */
  static async findBySlug(slug: string): Promise<EventTag | null> {
    const tag = await db(this.TABLE)
      .where('slug', slug)
      .first();

    return tag || null;
  }

  /**
   * Update tag
   */
  static async update(id: number, tagData: UpdateEventTagInput): Promise<EventTag> {
    try {
      const existingTag = await this.findById(id);
      if (!existingTag) {
        throw new EventValidationError('Tag not found');
      }

      // Validate input
      this.validateTagInput(tagData);

      // Generate new slug if name changed
      let slug = existingTag.slug;
      if (tagData.name && tagData.name !== existingTag.name) {
        const baseSlug = EventValidation.generateSlug(tagData.name);
        slug = await this.generateUniqueSlug(baseSlug, id);
      }

      const updateData: Record<string, unknown> = { ...tagData };
      if (tagData.name) {
        updateData['slug'] = slug;
        updateData['name'] = tagData.name.trim();
      }
      if (tagData.description) {
        updateData['description'] = tagData.description.trim();
      }

      const [updatedTag] = await db(this.TABLE)
        .where('tag_id', id)
        .update(updateData)
        .returning('*');

      return updatedTag;
    } catch (error) {
      if (error instanceof EventValidationError) {
        throw error;
      }
      throw new Error(`Failed to update tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete tag (soft delete by setting is_active to false)
   */
  static async delete(id: number): Promise<void> {
    const existingTag = await this.findById(id);
    if (!existingTag) {
      throw new EventValidationError('Tag not found');
    }

    // Remove all tag assignments
    await db('event_tag_assignments')
      .where('tag_id', id)
      .del();

    // Set tag as inactive
    await db(this.TABLE)
      .where('tag_id', id)
      .update({ 
        is_active: false,
        usage_count: 0
      });
  }

  /**
   * Get all tags with optional filters
   */
  static async getAll(filters: {
    is_active?: boolean;
    include_inactive?: boolean;
    sort_by?: 'name' | 'usage_count' | 'created_at';
    sort_order?: 'asc' | 'desc';
    limit?: number;
  } = {}): Promise<EventTag[]> {
    let query = db(this.TABLE);

    if (filters.is_active !== undefined) {
      query = query.where('is_active', filters.is_active);
    } else if (!filters.include_inactive) {
      query = query.where('is_active', true);
    }

    const sortBy = filters.sort_by || 'name';
    const sortOrder = filters.sort_order || 'asc';
    query = query.orderBy(sortBy, sortOrder);

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    return query;
  }

  /**
   * Get popular tags (sorted by usage count)
   */
  static async getPopularTags(limit: number = 20): Promise<EventTag[]> {
    return this.getAll({
      is_active: true,
      sort_by: 'usage_count',
      sort_order: 'desc',
      limit
    });
  }

  /**
   * Search tags
   */
  static async search(query: string, limit: number = 20): Promise<EventTag[]> {
    return db(this.TABLE)
      .where('is_active', true)
      .where(function() {
        this.where('name', 'ilike', `%${query}%`)
          .orWhere('description', 'ilike', `%${query}%`);
      })
      .orderBy('usage_count', 'desc')
      .orderBy('name', 'asc')
      .limit(limit);
  }

  /**
   * Get tags for an event
   */
  static async getTagsForEvent(eventId: number): Promise<EventTag[]> {
    return db(this.TABLE)
      .join('event_tag_assignments', 'event_tags.tag_id', 'event_tag_assignments.tag_id')
      .where('event_tag_assignments.event_id', eventId)
      .where('event_tags.is_active', true)
      .select('event_tags.*')
      .orderBy('event_tags.name', 'asc');
  }

  /**
   * Increment usage count
   */
  static async incrementUsageCount(tagId: number, increment: number = 1): Promise<void> {
    await db(this.TABLE)
      .where('tag_id', tagId)
      .increment('usage_count', increment);
  }

  /**
   * Decrement usage count
   */
  static async decrementUsageCount(tagId: number, decrement: number = 1): Promise<void> {
    await db(this.TABLE)
      .where('tag_id', tagId)
      .where('usage_count', '>=', decrement)
      .decrement('usage_count', decrement);
  }

  /**
   * Validate tag input
   */
  private static validateTagInput(tagData: CreateEventTagInput | UpdateEventTagInput): void {
    // Check if name exists and is valid
    if (!tagData.name || typeof tagData.name !== 'string' || tagData.name.trim().length === 0) {
      throw new EventValidationError('Tag name is required', 'name');
    }

    if (tagData.name.length > 50) {
      throw new EventValidationError('Tag name must be less than 50 characters', 'name');
    }

    if (tagData.description && tagData.description.length > 500) {
      throw new EventValidationError('Tag description must be less than 500 characters', 'description');
    }

    if (tagData.color_hex) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(tagData.color_hex)) {
        throw new EventValidationError('Invalid color hex format. Use #RRGGBB format', 'color_hex');
      }
    }
  }

  /**
   * Generate unique slug
   */
  private static async generateUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let query = db(this.TABLE).where('slug', slug);

      if (excludeId) {
        query = query.where('tag_id', '!=', excludeId);
      }

      const existing = await query.first();

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
}

export class EventTagAssignmentModel {
  private static readonly TABLE = 'event_tag_assignments';

  /**
   * Assign tags to an event
   */
  static async assignTagsToEvent(eventId: number, tagIds: number[]): Promise<EventTagAssignment[]> {
    try {
      // Validate that all tags exist and are active
      const validTags = await db('event_tags')
        .whereIn('tag_id', tagIds)
        .where('is_active', true);

      if (validTags.length !== tagIds.length) {
        throw new EventValidationError('One or more invalid tag IDs provided');
      }

      // Remove existing assignments for this event
      await this.removeTagsFromEvent(eventId);

      // Create new assignments
      const assignments = tagIds.map(tagId => ({
        event_id: eventId,
        tag_id: tagId,
      }));

      const insertedAssignments = await db(this.TABLE)
        .insert(assignments)
        .returning('*');

      // Update usage counts
      await db('event_tags')
        .whereIn('tag_id', tagIds)
        .increment('usage_count', 1);

      return insertedAssignments;
    } catch (error) {
      if (error instanceof EventValidationError) {
        throw error;
      }
      throw new Error(`Failed to assign tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Remove tags from an event
   */
  static async removeTagsFromEvent(eventId: number): Promise<void> {
    // Get current tag assignments to update usage counts
    const currentAssignments = await db(this.TABLE)
      .where('event_id', eventId)
      .select('tag_id');

    if (currentAssignments.length > 0) {
      const tagIds = currentAssignments.map(a => a.tag_id);

      // Remove assignments
      await db(this.TABLE)
        .where('event_id', eventId)
        .del();

      // Decrement usage counts
      await db('event_tags')
        .whereIn('tag_id', tagIds)
        .decrement('usage_count', 1);
    }
  }

  /**
   * Remove specific tag from an event
   */
  static async removeTagFromEvent(eventId: number, tagId: number): Promise<void> {
    const assignment = await db(this.TABLE)
      .where('event_id', eventId)
      .where('tag_id', tagId)
      .first();

    if (assignment) {
      await db(this.TABLE)
        .where('event_id', eventId)
        .where('tag_id', tagId)
        .del();

      // Decrement usage count
      await db('event_tags')
        .where('tag_id', tagId)
        .decrement('usage_count', 1);
    }
  }

  /**
   * Get events by tag
   */
  static async getEventsByTag(tagId: number, filters: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<unknown[]> {
    let query = db('events')
      .join(this.TABLE, 'events.event_id', 'event_tag_assignments.event_id')
      .where('event_tag_assignments.tag_id', tagId)
      .where('events.is_deleted', false)
      .select('events.*');

    if (filters.status) {
      query = query.where('events.status', filters.status);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return query.orderBy('events.start_datetime', 'asc');
  }

  /**
   * Get tag assignments for an event
   */
  static async getAssignmentsForEvent(eventId: number): Promise<EventTagAssignment[]> {
    return db(this.TABLE)
      .where('event_id', eventId);
  }

  /**
   * Check if tag is assigned to event
   */
  static async isTagAssignedToEvent(eventId: number, tagId: number): Promise<boolean> {
    const assignment = await db(this.TABLE)
      .where('event_id', eventId)
      .where('tag_id', tagId)
      .first();

    return !!assignment;
  }
}
