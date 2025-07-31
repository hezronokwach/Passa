import { db } from '@/config/database';
import {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventWithDetails
} from '@/types/event';
import { EventValidation, EventValidationError } from '@/utils/eventValidation';

// Re-export validation error for convenience
export { EventValidationError };

export class EventCoreModel {
  private static readonly TABLE = 'events';

  /**
   * Create a new event with validation
   */
  static async create(eventData: CreateEventInput): Promise<Event> {
    try {
      // Sanitize and validate input
      const sanitizedData = EventValidation.sanitizeEventInput(eventData) as CreateEventInput;
      EventValidation.validateCreateEventInput(sanitizedData);

      // Generate slug from event name
      const baseSlug = EventValidation.generateSlug(sanitizedData.event_name);
      const slug = await this.generateUniqueSlug(baseSlug);

      // Check if organizer exists and has organizer role
      const organizer = await db('organizers')
        .where('user_id', sanitizedData.organizer_user_id)
        .first();

      if (!organizer) {
        throw new EventValidationError('Organizer not found or user is not an organizer', 'organizer_user_id');
      }

      // Validate category if provided
      if (sanitizedData.category_id) {
        const category = await db('event_categories')
          .where('category_id', sanitizedData.category_id)
          .where('is_active', true)
          .first();

        if (!category) {
          throw new EventValidationError('Invalid or inactive category', 'category_id');
        }
      }

      const [event] = await db(this.TABLE)
        .insert({
          organizer_user_id: sanitizedData.organizer_user_id,
          category_id: sanitizedData.category_id,
          event_name: sanitizedData.event_name,
          slug,
          description: sanitizedData.description,
          short_description: sanitizedData.short_description,
          location: sanitizedData.location,
          latitude: sanitizedData.latitude,
          longitude: sanitizedData.longitude,
          venue_name: sanitizedData.venue_name,
          venue_address: sanitizedData.venue_address,
          start_datetime: sanitizedData.start_datetime,
          end_datetime: sanitizedData.end_datetime,
          timezone: sanitizedData.timezone || 'UTC',
          total_tickets_available: sanitizedData.total_tickets_available,
          tickets_sold: 0,
          min_ticket_price: sanitizedData.min_ticket_price,
          max_ticket_price: sanitizedData.max_ticket_price,
          currency: sanitizedData.currency || 'USD',
          status: 'draft',
          cover_image_url: sanitizedData.cover_image_url,
          gallery_images: sanitizedData.gallery_images ? JSON.stringify(sanitizedData.gallery_images) : null,
          metadata: sanitizedData.metadata ? JSON.stringify(sanitizedData.metadata) : null,
          is_featured: sanitizedData.is_featured || false,
          is_private: sanitizedData.is_private || false,
          access_code: sanitizedData.access_code,
          smart_contract_id: sanitizedData.smart_contract_id,
          is_deleted: false,
        })
        .returning('*');

      // Handle tag assignments if provided
      if (sanitizedData.tag_ids && sanitizedData.tag_ids.length > 0) {
        await this.assignTags(event.event_id, sanitizedData.tag_ids);
      }

      return event;
    } catch (error) {
      if (error instanceof EventValidationError) {
        throw error;
      }
      throw new Error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find event by ID
   */
  static async findById(id: number): Promise<Event | null> {
    const event = await db(this.TABLE)
      .where('event_id', id)
      .where('is_deleted', false)
      .first();

    return event || null;
  }

  /**
   * Find event by slug
   */
  static async findBySlug(slug: string): Promise<Event | null> {
    const event = await db(this.TABLE)
      .where('slug', slug)
      .where('is_deleted', false)
      .first();

    return event || null;
  }

  /**
   * Find event with details (including category, tags, organizer)
   */
  static async findByIdWithDetails(id: number): Promise<EventWithDetails | null> {
    const event = await this.findById(id);
    if (!event) return null;

    // Get category
    let category = null;
    if (event.category_id) {
      category = await db('event_categories')
        .where('category_id', event.category_id)
        .first();
    }

    // Get tags
    const tags = await db('event_tags')
      .join('event_tag_assignments', 'event_tags.tag_id', 'event_tag_assignments.tag_id')
      .where('event_tag_assignments.event_id', id)
      .where('event_tags.is_active', true)
      .select('event_tags.*');

    // Get organizer info
    const organizer = await db('users')
      .where('user_id', event.organizer_user_id)
      .select('user_id', 'username', 'first_name', 'last_name')
      .first();

    return {
      ...event,
      category,
      tags,
      organizer
    };
  }

  /**
   * Update event
   */
  static async update(id: number, eventData: UpdateEventInput): Promise<Event> {
    try {
      const existingEvent = await this.findById(id);
      if (!existingEvent) {
        throw new EventValidationError('Event not found');
      }

      // Sanitize and validate input
      const sanitizedData = EventValidation.sanitizeEventInput(eventData) as UpdateEventInput;
      EventValidation.validateUpdateEventInput(sanitizedData);

      // Generate new slug if event name changed
      let slug = existingEvent.slug;
      if (sanitizedData.event_name && sanitizedData.event_name !== existingEvent.event_name) {
        const baseSlug = EventValidation.generateSlug(sanitizedData.event_name);
        slug = await this.generateUniqueSlug(baseSlug, id);
      }

      // Validate category if provided
      if (sanitizedData.category_id) {
        const category = await db('event_categories')
          .where('category_id', sanitizedData.category_id)
          .where('is_active', true)
          .first();

        if (!category) {
          throw new EventValidationError('Invalid or inactive category', 'category_id');
        }
      }

      const updateData: Record<string, unknown> = { ...sanitizedData };
      if (sanitizedData.event_name) {
        updateData['slug'] = slug;
      }

      // Handle JSON fields
      if (sanitizedData.gallery_images) {
        updateData['gallery_images'] = JSON.stringify(sanitizedData.gallery_images);
      }
      if (sanitizedData.metadata) {
        updateData['metadata'] = JSON.stringify(sanitizedData.metadata);
      }

      const [updatedEvent] = await db(this.TABLE)
        .where('event_id', id)
        .update(updateData)
        .returning('*');

      // Handle tag assignments if provided
      if (sanitizedData.tag_ids !== undefined) {
        await this.updateTags(id, sanitizedData.tag_ids);
      }

      return updatedEvent;
    } catch (error) {
      if (error instanceof EventValidationError) {
        throw error;
      }
      throw new Error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Soft delete event
   */
  static async delete(id: number): Promise<void> {
    const existingEvent = await this.findById(id);
    if (!existingEvent) {
      throw new EventValidationError('Event not found');
    }

    await db(this.TABLE)
      .where('event_id', id)
      .update({
        is_deleted: true,
        deleted_at: db.fn.now(),
      });
  }

  /**
   * Check if event exists
   */
  static async exists(eventId: number): Promise<boolean> {
    const event = await db(this.TABLE)
      .where('event_id', eventId)
      .where('is_deleted', false)
      .first();

    return !!event;
  }

  /**
   * Check if slug exists
   */
  static async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    let query = db(this.TABLE).where('slug', slug);
    
    if (excludeId) {
      query = query.where('event_id', '!=', excludeId);
    }

    const event = await query.first();
    return !!event;
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
        query = query.where('event_id', '!=', excludeId);
      }

      const existing = await query.first();
      
      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Assign tags to event
   */
  private static async assignTags(eventId: number, tagIds: number[]): Promise<void> {
    // Validate all tag IDs exist and are active
    const validTags = await db('event_tags')
      .whereIn('tag_id', tagIds)
      .where('is_active', true);

    if (validTags.length !== tagIds.length) {
      throw new EventValidationError('One or more invalid tag IDs provided');
    }

    // Insert tag assignments
    const assignments = tagIds.map(tagId => ({
      event_id: eventId,
      tag_id: tagId,
    }));

    await db('event_tag_assignments').insert(assignments);

    // Update usage counts
    await db('event_tags')
      .whereIn('tag_id', tagIds)
      .increment('usage_count', 1);
  }

  /**
   * Update tags for event
   */
  private static async updateTags(eventId: number, tagIds: number[]): Promise<void> {
    // Get current tag assignments
    const currentAssignments = await db('event_tag_assignments')
      .where('event_id', eventId)
      .select('tag_id');

    const currentTagIds = currentAssignments.map(a => a.tag_id);

    // Remove old assignments
    if (currentTagIds.length > 0) {
      await db('event_tag_assignments')
        .where('event_id', eventId)
        .del();

      // Decrement usage counts for removed tags
      await db('event_tags')
        .whereIn('tag_id', currentTagIds)
        .decrement('usage_count', 1);
    }

    // Add new assignments
    if (tagIds.length > 0) {
      await this.assignTags(eventId, tagIds);
    }
  }
}
