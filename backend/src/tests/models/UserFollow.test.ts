import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { db } from '@/config/database';
import { UserModel } from '@/models/User';
import { UserFollowModel } from '@/models/UserFollow';

describe('UserFollowModel', () => {
  let testUser1Id: number;
  let testUser2Id: number;
  let testUser3Id: number;

  beforeAll(async () => {
    // Run migrations for test database
    await db.migrate.latest();
  });

  afterAll(async () => {
    // Clean up test database
    await db.destroy();
  });

  beforeEach(async () => {
    // Clean up tables before each test in dependency order
    await db('user_follows').del();
    await db('user_role_assignments').del();
    await db('user_profiles').del();
    await db('audit_logs').del();
    await db('users').del();

    // Create test users
    const timestamp = Date.now();
    const user1 = await UserModel.create({
      username: `user1_${timestamp}`,
      email: `user1_${timestamp}@example.com`,
      password: 'password123',
      first_name: 'User',
      last_name: 'One',
    });

    const user2 = await UserModel.create({
      username: `user2_${timestamp}`,
      email: `user2_${timestamp}@example.com`,
      password: 'password123',
      first_name: 'User',
      last_name: 'Two',
    });

    const user3 = await UserModel.create({
      username: `user3_${timestamp}`,
      email: `user3_${timestamp}@example.com`,
      password: 'password123',
      first_name: 'User',
      last_name: 'Three',
    });

    testUser1Id = user1.user_id;
    testUser2Id = user2.user_id;
    testUser3Id = user3.user_id;
  });

  describe('Follow/Unfollow Operations', () => {
    it('should follow a user', async () => {
      const follow = await UserFollowModel.followUser(testUser1Id, testUser2Id);

      expect(follow).toBeDefined();
      expect(follow?.follower_id).toBe(testUser1Id);
      expect(follow?.following_id).toBe(testUser2Id);
      expect(follow?.created_at).toBeDefined();
    });

    it('should prevent following the same user twice', async () => {
      // First follow
      await UserFollowModel.followUser(testUser1Id, testUser2Id);
      
      // Second follow attempt
      const follow = await UserFollowModel.followUser(testUser1Id, testUser2Id);

      expect(follow).toBeNull();
    });

    it('should prevent users from following themselves', async () => {
      // This should be handled at the controller level, but let's check the model behavior
      await expect(UserFollowModel.followUser(testUser1Id, testUser1Id)).rejects.toThrow();
    });

    it('should unfollow a user', async () => {
      // First follow
      await UserFollowModel.followUser(testUser1Id, testUser2Id);
      
      // Then unfollow
      const result = await UserFollowModel.unfollowUser(testUser1Id, testUser2Id);

      expect(result).toBe(true);
    });

    it('should return false when trying to unfollow a non-followed user', async () => {
      const result = await UserFollowModel.unfollowUser(testUser1Id, testUser2Id);

      expect(result).toBe(false);
    });
  });

  describe('Follow Status Checks', () => {
    it('should correctly check if user A follows user B', async () => {
      // Initially not following
      let isFollowing = await UserFollowModel.isFollowing(testUser1Id, testUser2Id);
      expect(isFollowing).toBe(false);

      // Start following
      await UserFollowModel.followUser(testUser1Id, testUser2Id);

      // Now should be following
      isFollowing = await UserFollowModel.isFollowing(testUser1Id, testUser2Id);
      expect(isFollowing).toBe(true);
    });
  });

  describe('Follow Lists and Counts', () => {
    beforeEach(async () => {
      // Set up some follow relationships
      await UserFollowModel.followUser(testUser1Id, testUser2Id);
      await UserFollowModel.followUser(testUser3Id, testUser2Id);
      await UserFollowModel.followUser(testUser1Id, testUser3Id);
    });

    it('should get followers for a user', async () => {
      const followers = await UserFollowModel.getFollowers(testUser2Id, 1, 10);

      expect(followers.data).toHaveLength(2);
      expect(followers.total).toBe(2);
      expect(followers.page).toBe(1);
      expect(followers.limit).toBe(10);

      // Check that the followers are correct
      const followerIds = followers.data.map(f => f.follower_id);
      expect(followerIds).toContain(testUser1Id);
      expect(followerIds).toContain(testUser3Id);
    });

    it('should get users that a user is following', async () => {
      const following = await UserFollowModel.getFollowing(testUser1Id, 1, 10);

      expect(following.data).toHaveLength(2);
      expect(following.total).toBe(2);
      expect(following.page).toBe(1);
      expect(following.limit).toBe(10);

      // Check that the following are correct
      const followingIds = following.data.map(f => f.following_id);
      expect(followingIds).toContain(testUser2Id);
      expect(followingIds).toContain(testUser3Id);
    });

    it('should get follow counts for a user', async () => {
      const counts = await UserFollowModel.getFollowCounts(testUser2Id);

      expect(counts.followers).toBe(2);
      expect(counts.following).toBe(0);
    });

    it('should paginate followers correctly', async () => {
      // Add more followers
      const user4 = await UserModel.create({
        username: `user4_${Date.now()}`,
        email: `user4_${Date.now()}@example.com`,
        password: 'password123',
      });
      
      await UserFollowModel.followUser(user4.user_id, testUser2Id);

      const followers = await UserFollowModel.getFollowers(testUser2Id, 1, 2);

      expect(followers.data).toHaveLength(2);
      expect(followers.total).toBe(3);
      expect(followers.page).toBe(1);
      expect(followers.limit).toBe(2);
    });

    it('should paginate following correctly', async () => {
      // Add more following
      const user4 = await UserModel.create({
        username: `user4_${Date.now()}`,
        email: `user4_${Date.now()}@example.com`,
        password: 'password123',
      });
      
      await UserFollowModel.followUser(testUser1Id, user4.user_id);

      const following = await UserFollowModel.getFollowing(testUser1Id, 1, 2);

      expect(following.data).toHaveLength(2);
      expect(following.total).toBe(3);
      expect(following.page).toBe(1);
      expect(following.limit).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent users gracefully', async () => {
      const followers = await UserFollowModel.getFollowers(999999, 1, 10);
      expect(followers.data).toHaveLength(0);
      expect(followers.total).toBe(0);

      const following = await UserFollowModel.getFollowing(999999, 1, 10);
      expect(following.data).toHaveLength(0);
      expect(following.total).toBe(0);

      const counts = await UserFollowModel.getFollowCounts(999999);
      expect(counts.followers).toBe(0);
      expect(counts.following).toBe(0);
    });
  });
});