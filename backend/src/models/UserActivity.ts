import { db } from '@/config/database';
import { ActivityLogInput } from '@/types/user';
import { logger } from '@/utils/logger';

export interface ActivityLog {
  log_id: number;
  user_id: number;
  action: string;
  resource_type: string;
  resource_id?: number;
  old_values?: string;
  new_values?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: string;
  created_at: Date;
}

export class UserActivityModel {
  private static readonly TABLE = 'audit_logs';

  /**
   * Log user activity
   */
  static async logActivity(
    userId: number, 
    action: string, 
    details: ActivityLogInput = {}
  ): Promise<void> {
    try {
      await db(this.TABLE).insert({
        user_id: userId,
        action,
        resource_type: details.resource_type || 'user',
        resource_id: details.resource_id || userId,
        old_values: details.old_values ? JSON.stringify(details.old_values) : null,
        new_values: details.new_values ? JSON.stringify(details.new_values) : null,
        ip_address: details.ip_address,
        user_agent: details.user_agent,
        metadata: details.metadata ? JSON.stringify(details.metadata) : null,
        created_at: db.fn.now(),
      });
    } catch (error) {
      // Log activity errors should not break the main flow
      logger.error('Failed to log user activity:', error);
    }
  }

  /**
   * Get user activity history
   */
  static async getActivityHistory(
    userId: number, 
    options: {
      limit?: number;
      offset?: number;
      action?: string;
      resource_type?: string;
      dateFrom?: Date;
      dateTo?: Date;
    } = {}
  ): Promise<ActivityLog[]> {
    let query = db(this.TABLE)
      .where('user_id', userId);

    if (options.action) {
      query = query.where('action', options.action);
    }

    if (options.resource_type) {
      query = query.where('resource_type', options.resource_type);
    }

    if (options.dateFrom) {
      query = query.where('created_at', '>=', options.dateFrom);
    }

    if (options.dateTo) {
      query = query.where('created_at', '<=', options.dateTo);
    }

    return query
      .orderBy('created_at', 'desc')
      .limit(options.limit || 50)
      .offset(options.offset || 0);
  }

  /**
   * Get activity count for user
   */
  static async getActivityCount(
    userId: number,
    options: {
      action?: string;
      resource_type?: string;
      dateFrom?: Date;
      dateTo?: Date;
    } = {}
  ): Promise<number> {
    let query = db(this.TABLE)
      .where('user_id', userId);

    if (options.action) {
      query = query.where('action', options.action);
    }

    if (options.resource_type) {
      query = query.where('resource_type', options.resource_type);
    }

    if (options.dateFrom) {
      query = query.where('created_at', '>=', options.dateFrom);
    }

    if (options.dateTo) {
      query = query.where('created_at', '<=', options.dateTo);
    }

    const result = await query.count('* as count').first();
    return parseInt(result?.['count'] as string || '0', 10);
  }

  /**
   * Get recent activity across all users (admin function)
   */
  static async getRecentActivity(
    options: {
      limit?: number;
      offset?: number;
      action?: string;
      resource_type?: string;
    } = {}
  ): Promise<ActivityLog[]> {
    let query = db(this.TABLE);

    if (options.action) {
      query = query.where('action', options.action);
    }

    if (options.resource_type) {
      query = query.where('resource_type', options.resource_type);
    }

    return query
      .orderBy('created_at', 'desc')
      .limit(options.limit || 100)
      .offset(options.offset || 0);
  }

  /**
   * Get activity statistics for a user
   */
  static async getActivityStats(
    userId: number,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<Record<string, number>> {
    let query = db(this.TABLE)
      .where('user_id', userId);

    if (dateFrom) {
      query = query.where('created_at', '>=', dateFrom);
    }

    if (dateTo) {
      query = query.where('created_at', '<=', dateTo);
    }

    const stats = await query
      .groupBy('action')
      .select('action')
      .count('* as count');

    const result: Record<string, number> = {};
    stats.forEach((stat) => {
      if (stat['action']) {
        result[stat['action']] = parseInt(stat['count'] as string, 10);
      }
    });

    return result;
  }

  /**
   * Clean up old activity logs (maintenance function)
   */
  static async cleanupOldLogs(daysToKeep: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deletedCount = await db(this.TABLE)
      .where('created_at', '<', cutoffDate)
      .del();

    return deletedCount;
  }

  /**
   * Get most active users (admin function)
   */
  static async getMostActiveUsers(
    options: {
      limit?: number;
      dateFrom?: Date;
      dateTo?: Date;
    } = {}
  ): Promise<Array<{ user_id: number; activity_count: number }>> {
    let query = db(this.TABLE);

    if (options.dateFrom) {
      query = query.where('created_at', '>=', options.dateFrom);
    }

    if (options.dateTo) {
      query = query.where('created_at', '<=', options.dateTo);
    }

    const results = await query
      .groupBy('user_id')
      .select('user_id')
      .count('* as activity_count')
      .orderBy('activity_count', 'desc')
      .limit(options.limit || 10);

    return results.map(result => ({
      user_id: result['user_id'] as number,
      activity_count: parseInt(result['activity_count'] as string, 10)
    }));
  }
}
