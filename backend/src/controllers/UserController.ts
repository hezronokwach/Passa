import { Request, Response } from 'express';
import { UserModel, UserValidationError } from '../models/User';
import { UserProfileModel, UserProfileValidationError } from '../models/UserProfile';
import { UserActivityModel } from '../models/UserActivity';
import { UserFollowModel } from '../models/UserFollow';
import { 
  User, 
  UpdateUserInput, 
  UpdateUserProfileInput, 
  SearchFilters,
  PaginatedResult
} from '../types/user';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth';

export class UserController {
  /**
   * Get user profile by ID
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userIdParam = req.params['userId'];
      const userId = userIdParam ? parseInt(userIdParam, 10) : (req as AuthenticatedRequest).user?.id as unknown as number;
      
      // Authorization check - users can only access their own profile or admins
      if (userId !== (req as AuthenticatedRequest).user?.id as unknown as number && (req as AuthenticatedRequest).user?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Cannot access this profile' });
        return;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Get user profile
      const profile = await UserProfileModel.findByUserId(userId);
      
      // Get follow counts
      const followCounts = await UserFollowModel.getFollowCounts(userId);
      
      // Log activity
      await UserActivityModel.logActivity(userId, 'profile_view', {
        resource_type: 'user_profile',
        resource_id: userId
      });

      res.json({
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          date_of_birth: user.date_of_birth,
          status: user.status,
          email_verified: user.email_verified,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        profile,
        follow_counts: followCounts
      });
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.id as unknown as number;
      const updateData: UpdateUserInput = req.body;
      
      // Update user data
      const updatedUser = await UserModel.update(userId, updateData);
      
      // Log activity
      await UserActivityModel.logActivity(userId, 'profile_update', {
        resource_type: 'user',
        resource_id: userId,
        new_values: updateData as Record<string, unknown>
      });

      res.json({
        message: 'Profile updated successfully',
        user: {
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          phone: updatedUser.phone,
          date_of_birth: updatedUser.date_of_birth,
          status: updatedUser.status,
          email_verified: updatedUser.email_verified,
          updated_at: updatedUser.updated_at
        }
      });
    } catch (error) {
      if (error instanceof UserValidationError) {
        res.status(400).json({ error: error.message, field: error.field });
        return;
      }
      logger.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update user profile details (bio, social links, etc.)
   */
  static async updateProfileDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.id as unknown as number;
      const updateData: UpdateUserProfileInput = req.body;
      
      // Check if profile exists, create if not
      let profile = await UserProfileModel.findByUserId(userId);
      
      if (!profile) {
        // Create new profile
        const profileData = {
          user_id: userId,
          ...updateData
        };
        profile = await UserProfileModel.create(profileData);
      } else {
        // Update existing profile
        profile = await UserProfileModel.update(userId, updateData);
      }
      
      // Log activity
      await UserActivityModel.logActivity(userId, 'profile_details_update', {
        resource_type: 'user_profile',
        resource_id: profile.profile_id,
        new_values: updateData as Record<string, unknown>
      });

      res.json({
        message: 'Profile details updated successfully',
        profile
      });
    } catch (error) {
      if (error instanceof UserProfileValidationError) {
        res.status(400).json({ error: error.message, field: error.field });
        return;
      }
      logger.error('Error updating user profile details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get user dashboard data
   */
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.id as unknown as number;
      
      // Get user data
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Get user profile
      const profile = await UserProfileModel.findByUserId(userId);
      
      // Get user activity stats
      const activityStats = await UserActivityModel.getActivityStats(userId);
      
      // Get recent activity
      const recentActivity = await UserActivityModel.getActivityHistory(userId, { limit: 10 });
      
      // Get profile completion
      const profileCompletion = profile ? profile.profile_completion_percentage : 0;
      
      // Get follow counts
      const followCounts = await UserFollowModel.getFollowCounts(userId);
      
      // Log dashboard access
      await UserActivityModel.logActivity(userId, 'dashboard_access', {
        resource_type: 'dashboard',
        resource_id: userId
      });

      res.json({
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          status: user.status,
          email_verified: user.email_verified,
          created_at: user.created_at
        },
        profile: {
          profile_completion: profileCompletion,
          bio: profile?.bio,
          avatar_url: profile?.avatar_url,
          location: profile?.location
        },
        activity: {
          stats: activityStats,
          recent: recentActivity
        },
        follow_counts: followCounts
      });
    } catch (error) {
      logger.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.id as unknown as number;
      const settingsData = req.body;
      
      // Get existing profile or create new one
      let profile = await UserProfileModel.findByUserId(userId);
      
      if (!profile) {
        // Create new profile with settings
        const profileData = {
          user_id: userId,
          preferences: settingsData.preferences,
          notification_settings: settingsData.notification_settings,
          privacy_settings: settingsData.privacy_settings
        };
        profile = await UserProfileModel.create(profileData);
      } else {
        // Update existing profile settings
        const updateData: UpdateUserProfileInput = {};
        if (settingsData.preferences) updateData.preferences = settingsData.preferences;
        if (settingsData.notification_settings) updateData.notification_settings = settingsData.notification_settings;
        if (settingsData.privacy_settings) updateData.privacy_settings = settingsData.privacy_settings;
        
        profile = await UserProfileModel.update(userId, updateData);
      }
      
      // Log activity
      await UserActivityModel.logActivity(userId, 'settings_update', {
        resource_type: 'user_settings',
        resource_id: profile.profile_id,
        new_values: settingsData as Record<string, unknown>
      });

      res.json({
        message: 'Settings updated successfully',
        preferences: profile.preferences,
        notification_settings: profile.notification_settings,
        privacy_settings: profile.privacy_settings
      });
    } catch (error) {
      if (error instanceof UserProfileValidationError) {
        res.status(400).json({ error: error.message, field: error.field });
        return;
      }
      logger.error('Error updating user settings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get user activity history
   */
  static async getActivityHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.id as unknown as number;
      const page = parseInt(req.query['page'] as string || '1', 10);
      const limit = parseInt(req.query['limit'] as string || '20', 10);
      const action = req.query['action'] as string;
      const resourceType = req.query['resourceType'] as string;
      
      // Authorization check
      const targetUserIdParam = req.query['userId'];
      const targetUserId = targetUserIdParam ? parseInt(targetUserIdParam as string, 10) : userId;
      if (targetUserId !== userId && (req as AuthenticatedRequest).user?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Cannot access this activity history' });
        return;
      }

      const activityHistory = await UserActivityModel.getActivityHistory(targetUserId, {
        limit,
        offset: (page - 1) * limit,
        action,
        resource_type: resourceType
      });
      
      const total = await UserActivityModel.getActivityCount(targetUserId, {
        action,
        resource_type: resourceType
      });

      res.json({
        data: activityHistory,
        total,
        page,
        limit
      });
    } catch (error) {
      logger.error('Error fetching activity history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Search users
   */
  static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const filters: SearchFilters = {
        username: req.query['username'] as string,
        email: req.query['email'] as string,
        status: req.query['status'] as any,
        page: parseInt(req.query['page'] as string || '1', 10),
        limit: parseInt(req.query['limit'] as string || '20', 10)
      };

      const result: PaginatedResult<User> = await UserModel.search(filters);
      
      // Remove sensitive data from response
      const sanitizedUsers = result.data.map(user => ({
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at
      }));

      res.json({
        data: sanitizedUsers,
        total: result.total,
        page: result.page,
        limit: result.limit
      });
    } catch (error) {
      logger.error('Error searching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get user statistics and analytics
   */
  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const userIdParam = req.params['userId'];
      const userId = userIdParam ? parseInt(userIdParam, 10) : (req as AuthenticatedRequest).user?.id as unknown as number;
      
      // Authorization check
      if (userId !== (req as AuthenticatedRequest).user?.id as unknown as number && (req as AuthenticatedRequest).user?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Cannot access these statistics' });
        return;
      }

      // Get user data
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Get profile data
      const profile = await UserProfileModel.findByUserId(userId);
      
      // Get activity stats
      const activityStats = await UserActivityModel.getActivityStats(userId);
      
      // Get total activity count
      const totalActivities = await UserActivityModel.getActivityCount(userId);
      
      // Calculate account age
      const accountAgeMs = Date.now() - new Date(user.created_at).getTime();
      const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));
      
      // Profile completion
      const profileCompletion = profile ? profile.profile_completion_percentage : 0;
      
      // Get follow counts
      const followCounts = await UserFollowModel.getFollowCounts(userId);

      res.json({
        user_stats: {
          account_age_days: accountAgeDays,
          total_activities: totalActivities,
          profile_completion: profileCompletion,
          last_login: user.last_login_at
        },
        activity_stats: activityStats,
        engagement_metrics: {
          daily_average: totalActivities > 0 ? Math.round(totalActivities / Math.max(1, accountAgeDays)) : 0
        },
        follow_counts: followCounts
      });
    } catch (error) {
      logger.error('Error fetching user statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Deactivate user account
   */
  static async deactivateAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.id as unknown as number;
      
      // Update user status to inactive
      const updatedUser = await UserModel.updateStatus(userId, 'inactive');
      
      // Log activity
      await UserActivityModel.logActivity(userId, 'account_deactivated', {
        resource_type: 'account',
        resource_id: userId
      });

      res.json({
        message: 'Account deactivated successfully',
        user: {
          user_id: updatedUser.user_id,
          username: updatedUser.username,
          status: updatedUser.status,
          updated_at: updatedUser.updated_at
        }
      });
    } catch (error) {
      logger.error('Error deactivating account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete user account (soft delete)
   */
  static async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.id as unknown as number;
      
      // Soft delete user
      await UserModel.delete(userId);
      
      // Also mark profile as private
      await UserProfileModel.delete(userId);
      
      // Log activity
      await UserActivityModel.logActivity(userId, 'account_deleted', {
        resource_type: 'account',
        resource_id: userId
      });

      res.json({
        message: 'Account deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Follow a user
   */
  static async followUser(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req as AuthenticatedRequest).user?.id as unknown as number;
      const followingId = parseInt(req.params['userId'] || '0', 10);
      
      // Validate that user is not trying to follow themselves
      if (followerId === followingId) {
        res.status(400).json({ error: 'Cannot follow yourself' });
        return;
      }
      
      // Check if user exists
      const user = await UserModel.findById(followingId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      // Follow user
      const follow = await UserFollowModel.followUser(followerId, followingId);
      
      if (!follow) {
        res.status(400).json({ error: 'Already following this user' });
        return;
      }
      
      // Log activity
      await UserActivityModel.logActivity(followerId, 'user_follow', {
        resource_type: 'user_follow',
        resource_id: followingId
      });

      res.json({
        message: 'Successfully followed user',
        follow
      });
    } catch (error) {
      logger.error('Error following user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req as AuthenticatedRequest).user?.id as unknown as number;
      const followingId = parseInt(req.params['userId'] || '0', 10);
      
      // Unfollow user
      const success = await UserFollowModel.unfollowUser(followerId, followingId);
      
      if (!success) {
        res.status(400).json({ error: 'Not following this user' });
        return;
      }
      
      // Log activity
      await UserActivityModel.logActivity(followerId, 'user_unfollow', {
        resource_type: 'user_follow',
        resource_id: followingId
      });

      res.json({
        message: 'Successfully unfollowed user'
      });
    } catch (error) {
      logger.error('Error unfollowing user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get followers for a user
   */
  static async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params['userId'] || '0', 10);
      const page = parseInt(req.query['page'] as string || '1', 10);
      const limit = parseInt(req.query['limit'] as string || '20', 10);
      
      // Check if user exists
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      const followers = await UserFollowModel.getFollowers(userId, page, limit);
      
      res.json(followers);
    } catch (error) {
      logger.error('Error fetching followers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get users that a user is following
   */
  static async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params['userId'] || '0', 10);
      const page = parseInt(req.query['page'] as string || '1', 10);
      const limit = parseInt(req.query['limit'] as string || '20', 10);
      
      // Check if user exists
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      const following = await UserFollowModel.getFollowing(userId, page, limit);
      
      res.json(following);
    } catch (error) {
      logger.error('Error fetching following:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Check if current user is following another user
   */
  static async checkFollowing(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req as AuthenticatedRequest).user?.id as unknown as number;
      const followingId = parseInt(req.params['userId'] || '0', 10);
      
      const isFollowing = await UserFollowModel.isFollowing(followerId, followingId);
      
      res.json({
        is_following: isFollowing
      });
    } catch (error) {
      logger.error('Error checking following status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}