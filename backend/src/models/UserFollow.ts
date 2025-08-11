import { db } from '@/config/database';
import { logger } from '@/utils/logger';

export interface UserFollow {
  follow_id: number;
  follower_id: number;
  following_id: number;
  created_at: Date;
}

export class UserFollowModel {
  private static readonly TABLE = 'user_follows';

  /**
   * Follow a user
   */
  static async followUser(followerId: number, followingId: number): Promise<UserFollow | null> {
    try {
      // Check if already following
      const existingFollow = await db(this.TABLE)
        .where('follower_id', followerId)
        .where('following_id', followingId)
        .first();

      if (existingFollow) {
        return null; // Already following
      }

      // Insert new follow relationship
      const [follow] = await db(this.TABLE)
        .insert({
          follower_id: followerId,
          following_id: followingId,
          created_at: db.fn.now()
        })
        .returning('*');

      return follow;
    } catch (error) {
      logger.error('Error following user:', error);
      throw new Error('Failed to follow user');
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    try {
      const deletedCount = await db(this.TABLE)
        .where('follower_id', followerId)
        .where('following_id', followingId)
        .del();

      return deletedCount > 0;
    } catch (error) {
      logger.error('Error unfollowing user:', error);
      throw new Error('Failed to unfollow user');
    }
  }

  /**
   * Check if user A follows user B
   */
  static async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await db(this.TABLE)
      .where('follower_id', followerId)
      .where('following_id', followingId)
      .first();

    return !!follow;
  }

  /**
   * Get followers for a user
   */
  static async getFollowers(userId: number, page: number = 1, limit: number = 20): Promise<{ data: UserFollow[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    const [followers, countResult] = await Promise.all([
      db(this.TABLE)
        .where('following_id', userId)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      db(this.TABLE)
        .where('following_id', userId)
        .count('* as count')
        .first()
    ]);

    const total = parseInt(countResult?.['count'] as string) || 0;

    return {
      data: followers,
      total,
      page,
      limit
    };
  }

  /**
   * Get users that a user is following
   */
  static async getFollowing(userId: number, page: number = 1, limit: number = 20): Promise<{ data: UserFollow[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    const [following, countResult] = await Promise.all([
      db(this.TABLE)
        .where('follower_id', userId)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      db(this.TABLE)
        .where('follower_id', userId)
        .count('* as count')
        .first()
    ]);

    const total = parseInt(countResult?.['count'] as string) || 0;

    return {
      data: following,
      total,
      page,
      limit
    };
  }

  /**
   * Get follow count for a user
   */
  static async getFollowCounts(userId: number): Promise<{ followers: number; following: number }> {
    const [followersResult, followingResult] = await Promise.all([
      db(this.TABLE)
        .where('following_id', userId)
        .count('* as count')
        .first(),
      db(this.TABLE)
        .where('follower_id', userId)
        .count('* as count')
        .first()
    ]);

    const followers = parseInt(followersResult?.['count'] as string) || 0;
    const following = parseInt(followingResult?.['count'] as string) || 0;

    return { followers, following };
  }
}