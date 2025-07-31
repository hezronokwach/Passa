import { db } from '@/config/database';
import {
  Event,
  EventSearchFilters,
  PaginatedResult
} from '@/types/event';

export class EventSearchModel {
  private static readonly TABLE = 'events';

  /**
   * Search events with filters and pagination
   */
  static async search(filters: EventSearchFilters = {}): Promise<PaginatedResult<Event>> {
    const {
      page = 1,
      limit = 20,
      sort_by = 'start_datetime',
      sort_order = 'asc',
      ...searchFilters
    } = filters;

    const offset = (page - 1) * limit;

    let query = db(this.TABLE)
      .where('is_deleted', false);

    // Apply filters
    if (searchFilters.event_name) {
      query = query.where('event_name', 'ilike', `%${searchFilters.event_name}%`);
    }

    if (searchFilters.organizer_user_id) {
      query = query.where('organizer_user_id', searchFilters.organizer_user_id);
    }

    if (searchFilters.category_id) {
      query = query.where('category_id', searchFilters.category_id);
    }

    if (searchFilters.status) {
      query = query.where('status', searchFilters.status);
    }

    if (searchFilters.location) {
      query = query.where('location', 'ilike', `%${searchFilters.location}%`);
    }

    if (searchFilters.start_date_from) {
      query = query.where('start_datetime', '>=', searchFilters.start_date_from);
    }

    if (searchFilters.start_date_to) {
      query = query.where('start_datetime', '<=', searchFilters.start_date_to);
    }

    if (searchFilters.min_price !== undefined) {
      query = query.where('min_ticket_price', '>=', searchFilters.min_price);
    }

    if (searchFilters.max_price !== undefined) {
      query = query.where('max_ticket_price', '<=', searchFilters.max_price);
    }

    if (searchFilters.is_featured !== undefined) {
      query = query.where('is_featured', searchFilters.is_featured);
    }

    if (searchFilters.is_private !== undefined) {
      query = query.where('is_private', searchFilters.is_private);
    }

    // Handle tag filtering
    if (searchFilters.tag_ids && searchFilters.tag_ids.length > 0) {
      query = query.whereIn('event_id', function() {
        this.select('event_id')
          .from('event_tag_assignments')
          .whereIn('tag_id', searchFilters.tag_ids!);
      });
    }

    // Get total count
    const totalQuery = query.clone();
    const countResult = await totalQuery.count('* as count');
    const total = parseInt((countResult[0] as { count: string }).count);

    // Apply sorting and pagination
    const data = await query
      .orderBy(sort_by, sort_order)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Get events by organizer
   */
  static async getEventsByOrganizer(organizerId: number, filters: Partial<EventSearchFilters> = {}): Promise<PaginatedResult<Event>> {
    return this.search({
      ...filters,
      organizer_user_id: organizerId,
    });
  }

  /**
   * Get featured events
   */
  static async getFeaturedEvents(limit: number = 10): Promise<Event[]> {
    return db(this.TABLE)
      .where('is_featured', true)
      .where('status', 'published')
      .where('is_deleted', false)
      .where('start_datetime', '>', db.fn.now())
      .orderBy('start_datetime', 'asc')
      .limit(limit);
  }

  /**
   * Get upcoming events
   */
  static async getUpcomingEvents(limit: number = 20): Promise<Event[]> {
    return db(this.TABLE)
      .where('status', 'published')
      .where('is_deleted', false)
      .where('start_datetime', '>', db.fn.now())
      .orderBy('start_datetime', 'asc')
      .limit(limit);
  }

  /**
   * Search events by location proximity (placeholder for future geo-search)
   */
  static async searchByLocation(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 50,
    filters: Partial<EventSearchFilters> = {}
  ): Promise<Event[]> {
    // This is a basic implementation. In production, you'd use PostGIS or similar
    // for proper geographical distance calculations
    const latRange = radiusKm / 111; // Rough conversion: 1 degree ≈ 111 km
    const lonRange = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    let query = db(this.TABLE)
      .where('is_deleted', false)
      .where('latitude', '>=', latitude - latRange)
      .where('latitude', '<=', latitude + latRange)
      .where('longitude', '>=', longitude - lonRange)
      .where('longitude', '<=', longitude + lonRange);

    // Apply additional filters
    if (filters.status) {
      query = query.where('status', filters.status);
    }

    if (filters.category_id) {
      query = query.where('category_id', filters.category_id);
    }

    if (filters.start_date_from) {
      query = query.where('start_datetime', '>=', filters.start_date_from);
    }

    if (filters.start_date_to) {
      query = query.where('start_datetime', '<=', filters.start_date_to);
    }

    return query
      .orderBy('start_datetime', 'asc')
      .limit(filters.limit || 50);
  }

  /**
   * Search events by text (name, description, location)
   */
  static async searchByText(
    searchText: string, 
    filters: Partial<EventSearchFilters> = {}
  ): Promise<PaginatedResult<Event>> {
    const searchTerms = searchText.toLowerCase().split(' ').filter(term => term.length > 2);
    
    if (searchTerms.length === 0) {
      return this.search(filters);
    }

    let query = db(this.TABLE)
      .where('is_deleted', false);

    // Search in multiple fields
    query = query.where(function() {
      searchTerms.forEach((term, index) => {
        const method = index === 0 ? 'where' : 'orWhere';
        this[method](function() {
          this.where('event_name', 'ilike', `%${term}%`)
            .orWhere('description', 'ilike', `%${term}%`)
            .orWhere('location', 'ilike', `%${term}%`)
            .orWhere('venue_name', 'ilike', `%${term}%`);
        });
      });
    });

    // Apply additional filters
    if (filters.status) {
      query = query.where('status', filters.status);
    }

    if (filters.category_id) {
      query = query.where('category_id', filters.category_id);
    }

    if (filters.organizer_user_id) {
      query = query.where('organizer_user_id', filters.organizer_user_id);
    }

    if (filters.start_date_from) {
      query = query.where('start_datetime', '>=', filters.start_date_from);
    }

    if (filters.start_date_to) {
      query = query.where('start_datetime', '<=', filters.start_date_to);
    }

    if (filters.is_featured !== undefined) {
      query = query.where('is_featured', filters.is_featured);
    }

    if (filters.is_private !== undefined) {
      query = query.where('is_private', filters.is_private);
    }

    // Get total count
    const totalQuery = query.clone();
    const countResult = await totalQuery.count('* as count');
    const total = parseInt((countResult[0] as { count: string }).count);

    // Apply pagination and sorting
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const data = await query
      .orderBy(filters.sort_by || 'start_datetime', filters.sort_order || 'asc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Get events happening today
   */
  static async getEventsToday(): Promise<Event[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    return db(this.TABLE)
      .where('status', 'published')
      .where('is_deleted', false)
      .where('start_datetime', '>=', startOfDay)
      .where('start_datetime', '<', endOfDay)
      .orderBy('start_datetime', 'asc');
  }

  /**
   * Get events happening this week
   */
  static async getEventsThisWeek(): Promise<Event[]> {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);

    return db(this.TABLE)
      .where('status', 'published')
      .where('is_deleted', false)
      .where('start_datetime', '>=', startOfWeek)
      .where('start_datetime', '<', endOfWeek)
      .orderBy('start_datetime', 'asc');
  }

  /**
   * Get similar events (by category and tags)
   */
  static async getSimilarEvents(eventId: number, limit: number = 5): Promise<Event[]> {
    const event = await db(this.TABLE)
      .where('event_id', eventId)
      .first();

    if (!event) {
      return [];
    }

    // Get events in the same category
    let query = db(this.TABLE)
      .where('is_deleted', false)
      .where('status', 'published')
      .where('event_id', '!=', eventId);

    if (event.category_id) {
      query = query.where('category_id', event.category_id);
    }

    // TODO: Add tag-based similarity scoring
    // This would require a more complex query to score events by shared tags

    return query
      .orderBy('start_datetime', 'asc')
      .limit(limit);
  }
}
