import { db } from '@/config/database';
import { Event, EventStatus } from '@/types/event';
import { EventValidation, EventValidationError } from '@/utils/eventValidation';

export class EventStatusModel {
  private static readonly TABLE = 'events';

  /**
   * Update event status
   */
  static async updateStatus(id: number, status: EventStatus): Promise<Event> {
    try {
      EventValidation.validateEventStatus(status);

      const existingEvent = await db(this.TABLE)
        .where('event_id', id)
        .where('is_deleted', false)
        .first();

      if (!existingEvent) {
        throw new EventValidationError('Event not found');
      }

      // Validate status transition
      this.validateStatusTransition(existingEvent.status, status);

      const updateData: Record<string, unknown> = { status };

      // Set published_at when publishing
      if (status === 'published' && existingEvent.status !== 'published') {
        updateData['published_at'] = db.fn.now();
      }

      // Set completed_at when completing
      if (status === 'completed' && existingEvent.status !== 'completed') {
        updateData['completed_at'] = db.fn.now();
      }

      // Set cancelled_at when cancelling
      if (status === 'cancelled' && existingEvent.status !== 'cancelled') {
        updateData['cancelled_at'] = db.fn.now();
      }

      const [updatedEvent] = await db(this.TABLE)
        .where('event_id', id)
        .update(updateData)
        .returning('*');

      return updatedEvent;
    } catch (error) {
      if (error instanceof EventValidationError) {
        throw error;
      }
      throw new Error(`Failed to update event status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Publish event (draft -> published)
   */
  static async publish(id: number): Promise<Event> {
    const event = await db(this.TABLE)
      .where('event_id', id)
      .where('is_deleted', false)
      .first();

    if (!event) {
      throw new EventValidationError('Event not found');
    }

    // Additional validation for publishing
    this.validateEventForPublishing(event);

    return this.updateStatus(id, 'published');
  }

  /**
   * Cancel event
   */
  static async cancel(id: number, reason?: string): Promise<Event> {
    const event = await this.updateStatus(id, 'cancelled');

    // Log cancellation reason if provided
    if (reason) {
      await db('event_status_history').insert({
        event_id: id,
        status: 'cancelled',
        reason,
        changed_at: db.fn.now(),
      }).catch(() => {
        // Ignore if event_status_history table doesn't exist
        // This is optional functionality
      });
    }

    return event;
  }

  /**
   * Complete event
   */
  static async complete(id: number): Promise<Event> {
    const event = await db(this.TABLE)
      .where('event_id', id)
      .where('is_deleted', false)
      .first();

    if (!event) {
      throw new EventValidationError('Event not found');
    }

    // Check if event end time has passed
    const now = new Date();
    const eventEndTime = new Date(event.end_datetime);

    if (eventEndTime > now) {
      throw new EventValidationError('Cannot complete event before its end time');
    }

    return this.updateStatus(id, 'completed');
  }

  /**
   * Postpone event
   */
  static async postpone(id: number, newStartDate?: Date, newEndDate?: Date): Promise<Event> {
    const event = await db(this.TABLE)
      .where('event_id', id)
      .where('is_deleted', false)
      .first();

    if (!event) {
      throw new EventValidationError('Event not found');
    }

    const updateData: Record<string, unknown> = { status: 'postponed' };

    // Update dates if provided
    if (newStartDate && newEndDate) {
      // Validate new dates
      EventValidation.validateEventDates(newStartDate, newEndDate);
      
      updateData['start_datetime'] = newStartDate;
      updateData['end_datetime'] = newEndDate;
    }

    const [updatedEvent] = await db(this.TABLE)
      .where('event_id', id)
      .update(updateData)
      .returning('*');

    return updatedEvent;
  }

  /**
   * Get events by status
   */
  static async getEventsByStatus(status: EventStatus, limit?: number): Promise<Event[]> {
    let query = db(this.TABLE)
      .where('status', status)
      .where('is_deleted', false)
      .orderBy('created_at', 'desc');

    if (limit) {
      query = query.limit(limit);
    }

    return query;
  }

  /**
   * Get events that need status updates (e.g., auto-complete past events)
   */
  static async getEventsNeedingStatusUpdate(): Promise<Event[]> {
    const now = new Date();

    // Get published events that have ended but are not completed
    return db(this.TABLE)
      .where('status', 'published')
      .where('is_deleted', false)
      .where('end_datetime', '<', now)
      .orderBy('end_datetime', 'asc');
  }

  /**
   * Auto-complete past events
   */
  static async autoCompletePastEvents(): Promise<number> {
    const eventsToComplete = await this.getEventsNeedingStatusUpdate();
    
    let completedCount = 0;
    for (const event of eventsToComplete) {
      try {
        await this.updateStatus(event.event_id, 'completed');
        completedCount++;
      } catch (error) {
        // Skip failed events but continue with others
        // In production, this should be logged to a proper logging service
        continue;
      }
    }

    return completedCount;
  }

  /**
   * Get status history for an event (if status history table exists)
   */
  static async getStatusHistory(eventId: number): Promise<unknown[]> {
    try {
      return await db('event_status_history')
        .where('event_id', eventId)
        .orderBy('changed_at', 'desc');
    } catch (error) {
      // Return empty array if table doesn't exist
      return [];
    }
  }

  /**
   * Validate status transition
   */
  private static validateStatusTransition(currentStatus: EventStatus, newStatus: EventStatus): void {
    const validTransitions: Record<EventStatus, EventStatus[]> = {
      'draft': ['published', 'cancelled'],
      'published': ['cancelled', 'completed', 'postponed'],
      'cancelled': ['draft', 'published'], // Allow republishing cancelled events
      'completed': [], // Completed events cannot change status
      'postponed': ['published', 'cancelled', 'draft']
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new EventValidationError(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
        'status'
      );
    }
  }

  /**
   * Validate event is ready for publishing
   */
  private static validateEventForPublishing(event: Event): void {
    const now = new Date();
    const eventStartTime = new Date(event.start_datetime);

    // Check if event start time is in the future
    if (eventStartTime <= now) {
      throw new EventValidationError('Cannot publish event with start time in the past');
    }

    // Check if event has required fields for publishing
    if (!event.event_name || event.event_name.trim().length === 0) {
      throw new EventValidationError('Event name is required for publishing');
    }

    if (!event.location || event.location.trim().length === 0) {
      throw new EventValidationError('Event location is required for publishing');
    }

    if (event.total_tickets_available <= 0) {
      throw new EventValidationError('Event must have available tickets for publishing');
    }

    // Check if organizer is verified (if organizer verification is required)
    // This would require joining with the organizers table
    // For now, we'll skip this check but it can be added later
  }

  /**
   * Get status statistics
   */
  static async getStatusStatistics(organizerId?: number): Promise<Record<string, number>> {
    let query = db(this.TABLE)
      .where('is_deleted', false);

    if (organizerId) {
      query = query.where('organizer_user_id', organizerId);
    }

    const stats = await query
      .select(
        db.raw('COUNT(*) as total_events'),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as draft_events', ['draft']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as published_events', ['published']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as cancelled_events', ['cancelled']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as completed_events', ['completed']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as postponed_events', ['postponed'])
      )
      .first();

    return {
      total_events: parseInt(stats.total_events) || 0,
      draft_events: parseInt(stats.draft_events) || 0,
      published_events: parseInt(stats.published_events) || 0,
      cancelled_events: parseInt(stats.cancelled_events) || 0,
      completed_events: parseInt(stats.completed_events) || 0,
      postponed_events: parseInt(stats.postponed_events) || 0,
    };
  }
}
