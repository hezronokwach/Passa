import { db } from '@/config/database';
import { EventStatistics } from '@/types/event';

export class EventStatisticsModel {
  private static readonly TABLE = 'events';

  /**
   * Get comprehensive event statistics
   */
  static async getStatistics(organizerId?: number): Promise<EventStatistics> {
    let query = db(this.TABLE).where('is_deleted', false);
    
    if (organizerId) {
      query = query.where('organizer_user_id', organizerId);
    }

    const stats = await query
      .select(
        db.raw('COUNT(*) as total_events'),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as published_events', ['published']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as draft_events', ['draft']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as cancelled_events', ['cancelled']),
        db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as completed_events', ['completed']),
        db.raw('SUM(tickets_sold) as total_tickets_sold'),
        db.raw('AVG(CASE WHEN min_ticket_price IS NOT NULL THEN min_ticket_price END) as average_min_price'),
        db.raw('AVG(CASE WHEN max_ticket_price IS NOT NULL THEN max_ticket_price END) as average_max_price')
      )
      .first();

    // Calculate estimated total revenue
    let revenueQuery = db(this.TABLE).where('is_deleted', false);

    if (organizerId) {
      revenueQuery = revenueQuery.where('organizer_user_id', organizerId);
    }

    const revenueResult = await revenueQuery
      .select(
        db.raw('SUM(CASE WHEN min_ticket_price IS NOT NULL AND max_ticket_price IS NOT NULL THEN (min_ticket_price + max_ticket_price) / 2 * tickets_sold WHEN min_ticket_price IS NOT NULL THEN min_ticket_price * tickets_sold ELSE 0 END) as total_revenue')
      )
      .first();

    const averageTicketPrice = stats.average_min_price && stats.average_max_price 
      ? (parseFloat(stats.average_min_price) + parseFloat(stats.average_max_price)) / 2
      : parseFloat(stats.average_min_price) || 0;

    return {
      total_events: parseInt(stats.total_events) || 0,
      published_events: parseInt(stats.published_events) || 0,
      draft_events: parseInt(stats.draft_events) || 0,
      cancelled_events: parseInt(stats.cancelled_events) || 0,
      completed_events: parseInt(stats.completed_events) || 0,
      total_tickets_sold: parseInt(stats.total_tickets_sold) || 0,
      total_revenue: parseFloat(revenueResult.total_revenue) || 0,
      average_ticket_price: Math.round(averageTicketPrice * 100) / 100,
    };
  }

  /**
   * Get event statistics by time period
   */
  static async getStatisticsByPeriod(
    period: 'day' | 'week' | 'month' | 'year',
    organizerId?: number
  ): Promise<Array<{
    period: string;
    total_events: number;
    tickets_sold: number;
    revenue: number;
  }>> {
    let dateFormat: string;

    switch (period) {
      case 'day':
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'week':
        dateFormat = 'YYYY-"W"WW';
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        break;
      case 'year':
        dateFormat = 'YYYY';
        break;
    }

    let query = db(this.TABLE)
      .where('is_deleted', false)
      .where('created_at', '>=', db.raw(`NOW() - INTERVAL '30 ${period}s'`));

    if (organizerId) {
      query = query.where('organizer_user_id', organizerId);
    }

    return query
      .select(
        db.raw(`TO_CHAR(created_at, '${dateFormat}') as period`),
        db.raw('COUNT(*) as total_events'),
        db.raw('SUM(tickets_sold) as tickets_sold'),
        db.raw('SUM(CASE WHEN min_ticket_price IS NOT NULL AND max_ticket_price IS NOT NULL THEN (min_ticket_price + max_ticket_price) / 2 * tickets_sold WHEN min_ticket_price IS NOT NULL THEN min_ticket_price * tickets_sold ELSE 0 END) as revenue')
      )
      .groupBy(db.raw(`TO_CHAR(created_at, '${dateFormat}')`))
      .orderBy('period', 'desc')
      .limit(30);
  }

  /**
   * Get top performing events
   */
  static async getTopPerformingEvents(
    metric: 'tickets_sold' | 'revenue' | 'attendance_rate',
    limit: number = 10,
    organizerId?: number
  ): Promise<Array<{
    event_id: number;
    event_name: string;
    tickets_sold: number;
    total_tickets_available: number;
    attendance_rate: number;
    estimated_revenue: number;
    status: string;
  }>> {
    let query = db(this.TABLE)
      .where('is_deleted', false);

    if (organizerId) {
      query = query.where('organizer_user_id', organizerId);
    }

    let orderByClause: string;
    switch (metric) {
      case 'tickets_sold':
        orderByClause = 'tickets_sold';
        break;
      case 'revenue':
        orderByClause = 'estimated_revenue';
        break;
      case 'attendance_rate':
        orderByClause = 'attendance_rate';
        break;
    }

    return query
      .select(
        'event_id',
        'event_name',
        'tickets_sold',
        'total_tickets_available',
        'status',
        db.raw('ROUND((tickets_sold::float / total_tickets_available::float) * 100, 2) as attendance_rate'),
        db.raw('CASE WHEN min_ticket_price IS NOT NULL AND max_ticket_price IS NOT NULL THEN (min_ticket_price + max_ticket_price) / 2 * tickets_sold WHEN min_ticket_price IS NOT NULL THEN min_ticket_price * tickets_sold ELSE 0 END as estimated_revenue')
      )
      .orderBy(orderByClause, 'desc')
      .limit(limit);
  }

  /**
   * Get category performance statistics
   */
  static async getCategoryStatistics(organizerId?: number): Promise<Array<{
    category_id: number;
    category_name: string;
    total_events: number;
    total_tickets_sold: number;
    average_attendance_rate: number;
    total_revenue: number;
  }>> {
    let query = db(this.TABLE)
      .join('event_categories', 'events.category_id', 'event_categories.category_id')
      .where('events.is_deleted', false)
      .where('event_categories.is_active', true);

    if (organizerId) {
      query = query.where('events.organizer_user_id', organizerId);
    }

    return query
      .select(
        'event_categories.category_id',
        'event_categories.name as category_name',
        db.raw('COUNT(events.event_id) as total_events'),
        db.raw('SUM(events.tickets_sold) as total_tickets_sold'),
        db.raw('ROUND(AVG((events.tickets_sold::float / events.total_tickets_available::float) * 100), 2) as average_attendance_rate'),
        db.raw('SUM(CASE WHEN events.min_ticket_price IS NOT NULL AND events.max_ticket_price IS NOT NULL THEN (events.min_ticket_price + events.max_ticket_price) / 2 * events.tickets_sold WHEN events.min_ticket_price IS NOT NULL THEN events.min_ticket_price * events.tickets_sold ELSE 0 END) as total_revenue')
      )
      .groupBy('event_categories.category_id', 'event_categories.name')
      .orderBy('total_events', 'desc');
  }

  /**
   * Get monthly revenue trends
   */
  static async getRevenueTrends(months: number = 12, organizerId?: number): Promise<Array<{
    month: string;
    revenue: number;
    events_count: number;
    tickets_sold: number;
  }>> {
    let query = db(this.TABLE)
      .where('is_deleted', false)
      .where('created_at', '>=', db.raw(`NOW() - INTERVAL '${months} months'`));

    if (organizerId) {
      query = query.where('organizer_user_id', organizerId);
    }

    return query
      .select(
        db.raw("TO_CHAR(created_at, 'YYYY-MM') as month"),
        db.raw('COUNT(*) as events_count'),
        db.raw('SUM(tickets_sold) as tickets_sold'),
        db.raw('SUM(CASE WHEN min_ticket_price IS NOT NULL AND max_ticket_price IS NOT NULL THEN (min_ticket_price + max_ticket_price) / 2 * tickets_sold WHEN min_ticket_price IS NOT NULL THEN min_ticket_price * tickets_sold ELSE 0 END) as revenue')
      )
      .groupBy(db.raw("TO_CHAR(created_at, 'YYYY-MM')"))
      .orderBy('month', 'desc')
      .limit(months);
  }

  /**
   * Get event performance comparison
   */
  static async getEventComparison(eventIds: number[]): Promise<Array<{
    event_id: number;
    event_name: string;
    tickets_sold: number;
    total_tickets_available: number;
    attendance_rate: number;
    estimated_revenue: number;
    days_to_event: number;
    status: string;
  }>> {
    return db(this.TABLE)
      .whereIn('event_id', eventIds)
      .where('is_deleted', false)
      .select(
        'event_id',
        'event_name',
        'tickets_sold',
        'total_tickets_available',
        'status',
        db.raw('ROUND((tickets_sold::float / total_tickets_available::float) * 100, 2) as attendance_rate'),
        db.raw('CASE WHEN min_ticket_price IS NOT NULL AND max_ticket_price IS NOT NULL THEN (min_ticket_price + max_ticket_price) / 2 * tickets_sold WHEN min_ticket_price IS NOT NULL THEN min_ticket_price * tickets_sold ELSE 0 END as estimated_revenue'),
        db.raw('EXTRACT(DAY FROM (start_datetime - NOW())) as days_to_event')
      )
      .orderBy('estimated_revenue', 'desc');
  }

  /**
   * Get organizer performance metrics
   */
  static async getOrganizerMetrics(organizerId: number): Promise<{
    total_events: number;
    total_revenue: number;
    total_tickets_sold: number;
    average_attendance_rate: number;
    most_popular_category: string;
    upcoming_events: number;
    completed_events: number;
    success_rate: number; // percentage of events that sold >50% tickets
  }> {
    const basicStats = await this.getStatistics(organizerId);

    // Get most popular category
    const categoryStats = await this.getCategoryStatistics(organizerId);
    const mostPopularCategory = categoryStats.length > 0 ? categoryStats[0]?.category_name || 'None' : 'None';

    // Get upcoming events count
    const upcomingEvents = await db(this.TABLE)
      .where('organizer_user_id', organizerId)
      .where('is_deleted', false)
      .where('status', 'published')
      .where('start_datetime', '>', db.fn.now())
      .count('* as count')
      .first();

    // Calculate success rate (events with >50% attendance)
    const successfulEvents = await db(this.TABLE)
      .where('organizer_user_id', organizerId)
      .where('is_deleted', false)
      .whereRaw('tickets_sold >= total_tickets_available * 0.5')
      .count('* as count')
      .first();

    const successRate = basicStats.total_events > 0
      ? (parseInt(successfulEvents?.['count'] as string || '0') / basicStats.total_events) * 100
      : 0;

    // Calculate average attendance rate
    const attendanceStats = await db(this.TABLE)
      .where('organizer_user_id', organizerId)
      .where('is_deleted', false)
      .select(
        db.raw('AVG((tickets_sold::float / total_tickets_available::float) * 100) as avg_attendance_rate')
      )
      .first();

    return {
      total_events: basicStats.total_events,
      total_revenue: basicStats.total_revenue,
      total_tickets_sold: basicStats.total_tickets_sold,
      average_attendance_rate: Math.round((parseFloat(attendanceStats?.avg_attendance_rate) || 0) * 100) / 100,
      most_popular_category: mostPopularCategory,
      upcoming_events: parseInt(upcomingEvents?.['count'] as string || '0'),
      completed_events: basicStats.completed_events,
      success_rate: Math.round(successRate * 100) / 100,
    };
  }
}
