import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { db } from '@/config/database';
import { UserModel, UserProfileModel, UserProfileValidationError } from '@/models';
import { CreateUserProfileInput, UpdateUserProfileInput } from '@/types/user';

describe('UserProfile Model', () => {
  let testUserId: number;

  beforeAll(async () => {
    // Run migrations for test database
    await db.migrate.latest();

    // Seed test roles if they don't exist
    const existingRoles = await db('user_roles').select('role_name');
    const existingRoleNames = existingRoles.map(r => r.role_name);

    const rolesToInsert = [
      { role_name: 'fan', display_name: 'Fan', is_active: true },
      { role_name: 'creator', display_name: 'Creator', is_active: true },
      { role_name: 'brand', display_name: 'Brand', is_active: true },
    ].filter(role => !existingRoleNames.includes(role.role_name));

    if (rolesToInsert.length > 0) {
      await db('user_roles').insert(rolesToInsert);
    }
  });

  afterAll(async () => {
    // Clean up test database
    await db.destroy();
  });

  beforeEach(async () => {
    // Clean up tables before each test in dependency order
    await db('user_role_assignments').del();
    await db('user_profiles').del();
    await db('audit_logs').del();
    await db('users').del();

    // Create a test user first with unique identifiers
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    try {
      const testUser = await UserModel.create({
        username: `testuser_${timestamp}_${randomNum}`,
        email: `test_${timestamp}_${randomNum}@example.com`,
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
      });
      testUserId = testUser.user_id;

      // Verify the user was created successfully
      expect(testUserId).toBeDefined();
      expect(typeof testUserId).toBe('number');
      expect(testUserId).toBeGreaterThan(0);
    } catch (error) {
      console.error('Failed to create test user:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Test setup failed: ${errorMessage}`);
    }
  });

  describe('CRUD Operations', () => {
    it('should create a new user profile with validation', async () => {
      // Verify the test user exists
      expect(testUserId).toBeDefined();
      expect(typeof testUserId).toBe('number');

      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        bio: 'This is my bio',
        avatar_url: 'https://example.com/avatar.jpg',
        location: 'New York, NY',
        timezone: 'America/New_York',
        language: 'en',
        social_links: {
          twitter_handle: 'testuser',
          website_url: 'https://example.com'
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          timezone: 'America/New_York'
        },
        notification_settings: {
          email_notifications: true,
          push_notifications: false
        },
        is_public: true
      };

      const profile = await UserProfileModel.create(profileData);

      expect(profile).toBeDefined();
      expect(profile.user_id).toBe(testUserId);
      expect(profile.bio).toBe(profileData.bio);
      expect(profile.avatar_url).toBe(profileData.avatar_url);
      expect(profile.location).toBe(profileData.location);
      expect(profile.timezone).toBe(profileData.timezone);
      expect(profile.language).toBe(profileData.language);
      expect(profile.social_links?.twitter_handle).toBe(profileData.social_links?.twitter_handle);
      expect(profile.social_links?.website_url).toBe(profileData.social_links?.website_url);
      expect(profile.preferences?.theme).toBe(profileData.preferences?.theme);
      expect(profile.notification_settings?.email_notifications).toBe(true);
      expect(profile.is_public).toBe(true);
      expect(profile.profile_completion_percentage).toBeGreaterThan(0);
    });

    it('should find user profile by user ID', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        bio: 'Test bio',
        location: 'Test Location'
      };

      const createdProfile = await UserProfileModel.create(profileData);
      const foundProfile = await UserProfileModel.findByUserId(testUserId);

      expect(foundProfile).toBeDefined();
      expect(foundProfile?.profile_id).toBe(createdProfile.profile_id);
      expect(foundProfile?.user_id).toBe(testUserId);
      expect(foundProfile?.bio).toBe(profileData.bio);
    });

    it('should find user profile by profile ID', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        bio: 'Test bio'
      };

      const createdProfile = await UserProfileModel.create(profileData);
      const foundProfile = await UserProfileModel.findById(createdProfile.profile_id);

      expect(foundProfile).toBeDefined();
      expect(foundProfile?.profile_id).toBe(createdProfile.profile_id);
      expect(foundProfile?.user_id).toBe(testUserId);
    });

    it('should update user profile', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        bio: 'Original bio'
      };

      await UserProfileModel.create(profileData);

      const updateData: UpdateUserProfileInput = {
        bio: 'Updated bio',
        location: 'Updated Location',
        social_links: {
          twitter_handle: 'updateduser'
        }
      };

      const updatedProfile = await UserProfileModel.update(testUserId, updateData);

      expect(updatedProfile.bio).toBe(updateData.bio);
      expect(updatedProfile.location).toBe(updateData.location);
      expect(updatedProfile.social_links?.twitter_handle).toBe(updateData.social_links?.twitter_handle);
    });

    it('should delete user profile (soft delete)', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        bio: 'Test bio',
        is_public: true
      };

      await UserProfileModel.create(profileData);
      const deleteResult = await UserProfileModel.delete(testUserId);

      expect(deleteResult).toBe(true);

      const profile = await UserProfileModel.findByUserId(testUserId);
      expect(profile?.is_public).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should validate required user_id for creation', async () => {
      const profileData = {
        bio: 'Test bio'
      } as CreateUserProfileInput;

      await expect(UserProfileModel.create(profileData)).rejects.toThrow(UserProfileValidationError);
    });

    it('should validate URL formats', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        avatar_url: 'invalid-url'
      };

      await expect(UserProfileModel.create(profileData)).rejects.toThrow(UserProfileValidationError);
    });

    it('should validate social media handles', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        social_links: {
          twitter_handle: 'invalid@handle!'
        }
      };

      await expect(UserProfileModel.create(profileData)).rejects.toThrow(UserProfileValidationError);
    });

    it('should validate bio length', async () => {
      const longBio = 'a'.repeat(1001); // Exceeds 1000 character limit
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        bio: longBio
      };

      await expect(UserProfileModel.create(profileData)).rejects.toThrow(UserProfileValidationError);
    });

    it('should validate timezone format', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        timezone: 'Invalid/Timezone'
      };

      await expect(UserProfileModel.create(profileData)).rejects.toThrow(UserProfileValidationError);
    });

    it('should validate language code format', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        language: 'invalid-language-code'
      };

      await expect(UserProfileModel.create(profileData)).rejects.toThrow(UserProfileValidationError);
    });

    it('should validate preferences values', async () => {
      const profileData: CreateUserProfileInput = {
        user_id: testUserId,
        preferences: {
          theme: 'invalid-theme' as any
        }
      };

      await expect(UserProfileModel.create(profileData)).rejects.toThrow(UserProfileValidationError);
    });
  });

  describe('Profile Completion Tracking', () => {
    it('should calculate profile completion percentage correctly', async () => {
      // Create profile with minimal data
      const minimalProfile = await UserProfileModel.create({
        user_id: testUserId
      });
      expect(minimalProfile.profile_completion_percentage).toBeLessThan(50);

      // Update with more data
      const completeProfile = await UserProfileModel.update(testUserId, {
        bio: 'Complete bio',
        avatar_url: 'https://example.com/avatar.jpg',
        location: 'New York',
        timezone: 'America/New_York',
        social_links: {
          twitter_handle: 'testuser'
        },
        preferences: {
          theme: 'dark'
        },
        notification_settings: {
          email_notifications: true
        }
      });

      expect(completeProfile.profile_completion_percentage).toBe(100);
    });
  });

  describe('Privacy Controls', () => {
    it('should respect public/private visibility', async () => {
      // Create public profile
      await UserProfileModel.create({
        user_id: testUserId,
        bio: 'Public profile',
        is_public: true
      });

      const publicProfiles = await UserProfileModel.getPublicProfiles();
      expect(publicProfiles.data).toHaveLength(1);

      // Make profile private
      await UserProfileModel.update(testUserId, { is_public: false });

      const publicProfilesAfterUpdate = await UserProfileModel.getPublicProfiles();
      expect(publicProfilesAfterUpdate.data).toHaveLength(0);
    });
  });

  describe('Search and Filtering', () => {
    it('should search profiles by location', async () => {
      // Create additional test users and profiles for this test
      const timestamp = Date.now();
      const user2 = await UserModel.create({
        username: `user2_${timestamp}_${Math.floor(Math.random() * 1000)}`,
        email: `user2_${timestamp}@example.com`,
        password: 'password123'
      });

      const user3 = await UserModel.create({
        username: `user3_${timestamp}_${Math.floor(Math.random() * 1000)}`,
        email: `user3_${timestamp}@example.com`,
        password: 'password123'
      });

      await UserProfileModel.create({
        user_id: testUserId,
        location: 'New York, NY',
        is_public: true
      });

      await UserProfileModel.create({
        user_id: user2.user_id,
        location: 'Los Angeles, CA',
        is_public: true
      });

      await UserProfileModel.create({
        user_id: user3.user_id,
        location: 'New York, NY',
        is_public: true
      });

      const results = await UserProfileModel.searchByLocation('New York');
      expect(results.data).toHaveLength(2);
      expect(results.total).toBe(2);
    });

    it('should get public profiles with pagination', async () => {
      // Create additional test users and profiles for this test
      const timestamp = Date.now();
      const user2 = await UserModel.create({
        username: `user2_${timestamp}_${Math.floor(Math.random() * 1000)}`,
        email: `user2_${timestamp}@example.com`,
        password: 'password123'
      });

      const user3 = await UserModel.create({
        username: `user3_${timestamp}_${Math.floor(Math.random() * 1000)}`,
        email: `user3_${timestamp}@example.com`,
        password: 'password123'
      });

      await UserProfileModel.create({
        user_id: testUserId,
        location: 'New York, NY',
        is_public: true
      });

      await UserProfileModel.create({
        user_id: user2.user_id,
        location: 'Los Angeles, CA',
        is_public: true
      });

      await UserProfileModel.create({
        user_id: user3.user_id,
        location: 'New York, NY',
        is_public: true
      });

      const results = await UserProfileModel.getPublicProfiles(1, 2);
      expect(results.data).toHaveLength(2);
      expect(results.total).toBe(3);
      expect(results.page).toBe(1);
      expect(results.limit).toBe(2);
    });
  });

  describe('Relationship with User Model', () => {
    it('should prevent duplicate profiles for same user', async () => {
      await UserProfileModel.create({
        user_id: testUserId,
        bio: 'First profile'
      });

      await expect(UserProfileModel.create({
        user_id: testUserId,
        bio: 'Second profile'
      })).rejects.toThrow(UserProfileValidationError);
    });

    it('should check if profile exists for user', async () => {
      expect(await UserProfileModel.exists(testUserId)).toBe(false);

      await UserProfileModel.create({
        user_id: testUserId,
        bio: 'Test profile'
      });

      expect(await UserProfileModel.exists(testUserId)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent user profile updates', async () => {
      await expect(UserProfileModel.update(999999, { bio: 'Updated' })).rejects.toThrow('User profile not found');
    });

    it('should return null for non-existent profile lookups', async () => {
      const profile = await UserProfileModel.findByUserId(999999);
      expect(profile).toBeNull();
    });
  });
});
