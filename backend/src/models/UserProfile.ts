import { db } from '@/config/database';
import {
  UserProfile,
  CreateUserProfileInput,
  UpdateUserProfileInput,
  SocialLinks,
  UserPreferences,
  NotificationSettings
} from '@/types/user';
import { UserProfileValidation, UserProfileValidationError } from '@/utils/userProfileValidation';
import { logger } from '@/utils/logger';

// Re-export validation error for convenience
export { UserProfileValidationError };

export class UserProfileModel {
  private static readonly TABLE = 'user_profiles';

  /**
   * Create a new user profile with validation
   */
  static async create(profileData: CreateUserProfileInput): Promise<UserProfile> {
    try {
      // Sanitize and validate input
      const sanitizedData = UserProfileValidation.sanitizeUserProfileInput(profileData) as CreateUserProfileInput;
      UserProfileValidation.validateCreateUserProfileInput(sanitizedData);

      // Check if profile already exists for this user
      const existingProfile = await db(this.TABLE)
        .where('user_id', sanitizedData.user_id)
        .first();

      if (existingProfile) {
        throw new UserProfileValidationError('Profile already exists for this user', 'user_id');
      }

      // Set default values
      const profileToCreate = {
        user_id: sanitizedData.user_id,
        bio: sanitizedData.bio || null,
        avatar_url: sanitizedData.avatar_url || null,
        cover_image_url: sanitizedData.cover_image_url || null,
        location: sanitizedData.location || null,
        timezone: sanitizedData.timezone || null,
        language: sanitizedData.language || 'en',
        preferences: sanitizedData.preferences ? this.safeStringify(sanitizedData.preferences) : null,
        notification_settings: sanitizedData.notification_settings ? this.safeStringify(sanitizedData.notification_settings) : null,
        is_public: sanitizedData.is_public !== undefined ? sanitizedData.is_public : true,
        // Store social links as separate columns for better querying
        website_url: sanitizedData.social_links?.website_url || null,
        twitter_handle: sanitizedData.social_links?.twitter_handle || null,
        instagram_handle: sanitizedData.social_links?.instagram_handle || null,
        linkedin_handle: sanitizedData.social_links?.linkedin_handle || null,
      };

      const [profile] = await db(this.TABLE)
        .insert(profileToCreate)
        .returning('*');

      return this.formatProfile(profile);
    } catch (error) {
      if (error instanceof UserProfileValidationError) {
        throw error;
      }
      throw new Error(`Failed to create user profile: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Find user profile by user ID
   */
  static async findByUserId(userId: number): Promise<UserProfile | null> {
    const profile = await db(this.TABLE)
      .where('user_id', userId)
      .first();

    return profile ? this.formatProfile(profile) : null;
  }

  /**
   * Find user profile by profile ID
   */
  static async findById(profileId: number): Promise<UserProfile | null> {
    const profile = await db(this.TABLE)
      .where('profile_id', profileId)
      .first();

    return profile ? this.formatProfile(profile) : null;
  }

  /**
   * Update user profile with validation
   */
  static async update(userId: number, profileData: UpdateUserProfileInput): Promise<UserProfile> {
    try {
      // Sanitize and validate input
      const sanitizedData = UserProfileValidation.sanitizeUserProfileInput(profileData) as UpdateUserProfileInput;
      UserProfileValidation.validateUpdateUserProfileInput(sanitizedData);

      const existingProfile = await this.findByUserId(userId);
      if (!existingProfile) {
        throw new Error('User profile not found');
      }

      // Prepare update data
      const updateData: Partial<{
        bio: string | null;
        avatar_url: string | null;
        cover_image_url: string | null;
        location: string | null;
        timezone: string | null;
        language: string;
        is_public: boolean;
        preferences: string | null;
        notification_settings: string | null;
        website_url: string | null;
        twitter_handle: string | null;
        instagram_handle: string | null;
        linkedin_handle: string | null;
      }> = {};
      
      if (sanitizedData.bio !== undefined) updateData.bio = sanitizedData.bio;
      if (sanitizedData.avatar_url !== undefined) updateData.avatar_url = sanitizedData.avatar_url;
      if (sanitizedData.cover_image_url !== undefined) updateData.cover_image_url = sanitizedData.cover_image_url;
      if (sanitizedData.location !== undefined) updateData.location = sanitizedData.location;
      if (sanitizedData.timezone !== undefined) updateData.timezone = sanitizedData.timezone;
      if (sanitizedData.language !== undefined) updateData.language = sanitizedData.language;
      if (sanitizedData.is_public !== undefined) updateData.is_public = sanitizedData.is_public;
      
      if (sanitizedData.preferences !== undefined) {
        updateData.preferences = sanitizedData.preferences ? this.safeStringify(sanitizedData.preferences) : null;
      }

      if (sanitizedData.notification_settings !== undefined) {
        updateData.notification_settings = sanitizedData.notification_settings ? this.safeStringify(sanitizedData.notification_settings) : null;
      }
      
      // Handle social links
      if (sanitizedData.social_links !== undefined) {
        updateData.website_url = sanitizedData.social_links?.website_url || null;
        updateData.twitter_handle = sanitizedData.social_links?.twitter_handle || null;
        updateData.instagram_handle = sanitizedData.social_links?.instagram_handle || null;
        updateData.linkedin_handle = sanitizedData.social_links?.linkedin_handle || null;
      }

      const [updatedProfile] = await db(this.TABLE)
        .where('user_id', userId)
        .update(updateData)
        .returning('*');

      if (!updatedProfile) {
        throw new Error('Failed to update user profile - no rows affected');
      }

      return this.formatProfile(updatedProfile);
    } catch (error) {
      if (error instanceof UserProfileValidationError) {
        throw error;
      }
      throw new Error(`Failed to update user profile: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete user profile (soft delete by setting is_public to false)
   */
  static async delete(userId: number): Promise<boolean> {
    const result = await db(this.TABLE)
      .where('user_id', userId)
      .update({ is_public: false });

    return result > 0;
  }

  /**
   * Get all public profiles with pagination
   */
  static async getPublicProfiles(page: number = 1, limit: number = 20): Promise<{ data: UserProfile[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    const [profiles, countResult] = await Promise.all([
      db(this.TABLE)
        .where('is_public', true)
        .orderBy('updated_at', 'desc')
        .limit(limit)
        .offset(offset),
      db(this.TABLE)
        .where('is_public', true)
        .count('* as count')
        .first()
    ]);

    const total = parseInt(countResult?.['count'] as string) || 0;

    return {
      data: profiles.map(profile => this.formatProfile(profile)),
      total,
      page,
      limit
    };
  }

  /**
   * Search profiles by location
   */
  static async searchByLocation(location: string, page: number = 1, limit: number = 20): Promise<{ data: UserProfile[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    const [profiles, countResult] = await Promise.all([
      db(this.TABLE)
        .where('is_public', true)
        .whereILike('location', `%${location}%`)
        .orderBy('updated_at', 'desc')
        .limit(limit)
        .offset(offset),
      db(this.TABLE)
        .where('is_public', true)
        .whereILike('location', `%${location}%`)
        .count('* as count')
        .first()
    ]);

    const total = parseInt(countResult?.['count'] as string) || 0;

    return {
      data: profiles.map(profile => this.formatProfile(profile)),
      total,
      page,
      limit
    };
  }

  /**
   * Calculate profile completion percentage
   */
  static calculateProfileCompletion(profile: UserProfile): number {
    const fields = [
      'bio',
      'avatar_url',
      'location',
      'timezone',
      'social_links',
      'preferences',
      'notification_settings'
    ];

    let completedFields = 0;
    const totalFields = fields.length;

    if (profile.bio) completedFields++;
    if (profile.avatar_url) completedFields++;
    if (profile.location) completedFields++;
    if (profile.timezone) completedFields++;
    if (profile.social_links && Object.keys(profile.social_links).length > 0) completedFields++;
    if (profile.preferences && Object.keys(profile.preferences).length > 0) completedFields++;
    if (profile.notification_settings && Object.keys(profile.notification_settings).length > 0) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  /**
   * Format raw database profile to UserProfile interface
   */
  private static formatProfile(rawProfile: {
    profile_id: number;
    user_id: number;
    bio?: string | null;
    avatar_url?: string | null;
    cover_image_url?: string | null;
    location?: string | null;
    timezone?: string | null;
    language?: string | null;
    website_url?: string | null;
    twitter_handle?: string | null;
    instagram_handle?: string | null;
    linkedin_handle?: string | null;
    preferences?: string | null;
    notification_settings?: string | null;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
  }): UserProfile {
    const socialLinks: SocialLinks = {};
    if (rawProfile.website_url) socialLinks.website_url = rawProfile.website_url;
    if (rawProfile.twitter_handle) socialLinks.twitter_handle = rawProfile.twitter_handle;
    if (rawProfile.instagram_handle) socialLinks.instagram_handle = rawProfile.instagram_handle;
    if (rawProfile.linkedin_handle) socialLinks.linkedin_handle = rawProfile.linkedin_handle;

    const profile: UserProfile = {
      profile_id: rawProfile.profile_id,
      user_id: rawProfile.user_id,
      language: rawProfile.language || 'en',
      is_public: rawProfile.is_public,
      profile_completion_percentage: 0, // Will be calculated
      created_at: rawProfile.created_at,
      updated_at: rawProfile.updated_at
    };

    // Add optional fields only if they have values
    if (rawProfile.bio) profile.bio = rawProfile.bio;
    if (rawProfile.avatar_url) profile.avatar_url = rawProfile.avatar_url;
    if (rawProfile.cover_image_url) profile.cover_image_url = rawProfile.cover_image_url;
    if (rawProfile.location) profile.location = rawProfile.location;
    if (rawProfile.timezone) profile.timezone = rawProfile.timezone;
    if (Object.keys(socialLinks).length > 0) profile.social_links = socialLinks;
    if (rawProfile.preferences) profile.preferences = this.safeParse(rawProfile.preferences) as UserPreferences;
    if (rawProfile.notification_settings) profile.notification_settings = this.safeParse(rawProfile.notification_settings) as NotificationSettings;

    // Calculate completion percentage
    profile.profile_completion_percentage = this.calculateProfileCompletion(profile);

    return profile;
  }

  /**
   * Check if user profile exists
   */
  static async exists(userId: number): Promise<boolean> {
    const profile = await db(this.TABLE)
      .where('user_id', userId)
      .first();

    return !!profile;
  }

  /**
   * Safely stringify JSON data with error handling
   */
  private static safeStringify(data: unknown): string {
    try {
      // Check if data is already a string
      if (typeof data === 'string') {
        return data;
      }

      // Check for circular references or non-serializable data
      if (data === null || data === undefined) {
        return JSON.stringify(data);
      }

      // Create a clean copy to avoid circular references
      const cleanData = JSON.parse(JSON.stringify(data));
      return JSON.stringify(cleanData);
    } catch (error) {
      logger.error('JSON stringify error:', { error, data });
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new UserProfileValidationError(`Invalid JSON data format: ${errorMessage}`, 'json_data');
    }
  }

  /**
   * Safely parse JSON data with error handling
   */
  private static safeParse(data: unknown): unknown {
    try {
      // If data is already an object, return it
      if (typeof data === 'object' && data !== null) {
        return data;
      }

      // If data is a string, try to parse it
      if (typeof data === 'string') {
        // Check if it's a valid JSON string
        if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
          return JSON.parse(data);
        }
        // If it's not JSON-like, return as is
        return data;
      }

      return data;
    } catch (error) {
      logger.warn('JSON parse warning:', { error, data });
      // Return the original data if parsing fails
      return data;
    }
  }
}
