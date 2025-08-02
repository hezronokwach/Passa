// Main Event model that combines all event-related functionality
import { EventCoreModel } from './EventCore';
import { EventSearchModel } from './EventSearch';
import { EventStatusModel } from './EventStatus';
import { EventTicketModel } from './EventTicket';
import { EventStatisticsModel } from './EventStatistics';
import {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventSearchFilters,
  PaginatedResult,
  EventStatus,
  EventWithDetails,
  EventStatistics
} from '@/types/event';

// Re-export all the individual models for direct access if needed
export { EventCoreModel, EventSearchModel, EventStatusModel, EventTicketModel, EventStatisticsModel };

// Re-export validation error for convenience
export { EventValidationError } from './EventCore';

/**
 * Main Event model that provides a unified interface to all event functionality
 * This class delegates to specialized models for different concerns
 */
export class EventModel {
  // ===== CORE CRUD OPERATIONS =====

  /**
   * Create a new event with validation
   */
  static async create(eventData: CreateEventInput): Promise<Event> {
    return EventCoreModel.create(eventData);
  }

  /**
   * Find event by ID
   */
  static async findById(id: number): Promise<Event | null> {
    return EventCoreModel.findById(id);
  }

  /**
   * Find event by slug
   */
  static async findBySlug(slug: string): Promise<Event | null> {
    return EventCoreModel.findBySlug(slug);
  }

  /**
   * Find event with details (including category, tags, organizer)
   */
  static async findByIdWithDetails(id: number): Promise<EventWithDetails | null> {
    return EventCoreModel.findByIdWithDetails(id);
  }

  /**
   * Update event
   */
  static async update(id: number, eventData: UpdateEventInput): Promise<Event> {
    return EventCoreModel.update(id, eventData);
  }

  /**
   * Soft delete event
   */
  static async delete(id: number): Promise<void> {
    return EventCoreModel.delete(id);
  }

  /**
   * Check if event exists
   */
  static async exists(eventId: number): Promise<boolean> {
    return EventCoreModel.exists(eventId);
  }

  /**
   * Check if slug exists
   */
  static async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    return EventCoreModel.slugExists(slug, excludeId);
  }

  // ===== SEARCH AND FILTERING =====

  /**
   * Search events with filters and pagination
   */
  static async search(filters: EventSearchFilters = {}): Promise<PaginatedResult<Event>> {
    return EventSearchModel.search(filters);
  }

  /**
   * Get events by organizer
   */
  static async getEventsByOrganizer(organizerId: number, filters: Partial<EventSearchFilters> = {}): Promise<PaginatedResult<Event>> {
    return EventSearchModel.getEventsByOrganizer(organizerId, filters);
  }

  /**
   * Get featured events
   */
  static async getFeaturedEvents(limit: number = 10): Promise<Event[]> {
    return EventSearchModel.getFeaturedEvents(limit);
  }

  /**
   * Get upcoming events
   */
  static async getUpcomingEvents(limit: number = 20): Promise<Event[]> {
    return EventSearchModel.getUpcomingEvents(limit);
  }

  /**
   * Search events by text
   */
  static async searchByText(searchText: string, filters: Partial<EventSearchFilters> = {}): Promise<PaginatedResult<Event>> {
    return EventSearchModel.searchByText(searchText, filters);
  }

  /**
   * Get events happening today
   */
  static async getEventsToday(): Promise<Event[]> {
    return EventSearchModel.getEventsToday();
  }

  /**
   * Get events happening this week
   */
  static async getEventsThisWeek(): Promise<Event[]> {
    return EventSearchModel.getEventsThisWeek();
  }

  /**
   * Get similar events
   */
  static async getSimilarEvents(eventId: number, limit: number = 5): Promise<Event[]> {
    return EventSearchModel.getSimilarEvents(eventId, limit);
  }

  // ===== STATUS MANAGEMENT =====

  /**
   * Update event status
   */
  static async updateStatus(id: number, status: EventStatus): Promise<Event> {
    return EventStatusModel.updateStatus(id, status);
  }

  /**
   * Publish event
   */
  static async publish(id: number): Promise<Event> {
    return EventStatusModel.publish(id);
  }

  /**
   * Cancel event
   */
  static async cancel(id: number, reason?: string): Promise<Event> {
    return EventStatusModel.cancel(id, reason);
  }

  /**
   * Complete event
   */
  static async complete(id: number): Promise<Event> {
    return EventStatusModel.complete(id);
  }

  /**
   * Postpone event
   */
  static async postpone(id: number, newStartDate?: Date, newEndDate?: Date): Promise<Event> {
    return EventStatusModel.postpone(id, newStartDate, newEndDate);
  }

  /**
   * Get events by status
   */
  static async getEventsByStatus(status: EventStatus, limit?: number): Promise<Event[]> {
    return EventStatusModel.getEventsByStatus(status, limit);
  }

  /**
   * Auto-complete past events
   */
  static async autoCompletePastEvents(): Promise<number> {
    return EventStatusModel.autoCompletePastEvents();
  }

  // ===== TICKET MANAGEMENT =====

  /**
   * Increment tickets sold
   */
  static async incrementTicketsSold(eventId: number, quantity: number = 1): Promise<void> {
    return EventTicketModel.incrementTicketsSold(eventId, quantity);
  }

  /**
   * Decrement tickets sold (for refunds)
   */
  static async decrementTicketsSold(eventId: number, quantity: number = 1): Promise<void> {
    return EventTicketModel.decrementTicketsSold(eventId, quantity);
  }

  /**
   * Check ticket availability
   */
  static async checkTicketAvailability(eventId: number, requestedQuantity: number = 1) {
    return EventTicketModel.checkAvailability(eventId, requestedQuantity);
  }

  /**
   * Update ticket capacity
   */
  static async updateTicketCapacity(eventId: number, newCapacity: number): Promise<Event> {
    return EventTicketModel.updateCapacity(eventId, newCapacity);
  }

  /**
   * Get ticket statistics for an event
   */
  static async getTicketStatistics(eventId: number) {
    return EventTicketModel.getTicketStatistics(eventId);
  }

  /**
   * Get events by ticket availability status
   */
  static async getEventsByAvailability(
    availabilityType: 'available' | 'low_stock' | 'sold_out',
    organizerId?: number,
    limit: number = 20
  ): Promise<Event[]> {
    return EventTicketModel.getEventsByAvailability(availabilityType, organizerId, limit);
  }

  // ===== STATISTICS AND ANALYTICS =====

  /**
   * Get comprehensive event statistics
   */
  static async getStatistics(organizerId?: number): Promise<EventStatistics> {
    return EventStatisticsModel.getStatistics(organizerId);
  }

  /**
   * Get event statistics by time period
   */
  static async getStatisticsByPeriod(
    period: 'day' | 'week' | 'month' | 'year',
    organizerId?: number
  ) {
    return EventStatisticsModel.getStatisticsByPeriod(period, organizerId);
  }

  /**
   * Get top performing events
   */
  static async getTopPerformingEvents(
    metric: 'tickets_sold' | 'revenue' | 'attendance_rate',
    limit: number = 10,
    organizerId?: number
  ) {
    return EventStatisticsModel.getTopPerformingEvents(metric, limit, organizerId);
  }

  /**
   * Get category performance statistics
   */
  static async getCategoryStatistics(organizerId?: number) {
    return EventStatisticsModel.getCategoryStatistics(organizerId);
  }

  /**
   * Get monthly revenue trends
   */
  static async getRevenueTrends(months: number = 12, organizerId?: number) {
    return EventStatisticsModel.getRevenueTrends(months, organizerId);
  }

  /**
   * Get organizer performance metrics
   */
  static async getOrganizerMetrics(organizerId: number) {
    return EventStatisticsModel.getOrganizerMetrics(organizerId);
  }
}
