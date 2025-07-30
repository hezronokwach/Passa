import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { UserModel, UserRoleModel, UserActivityModel } from '@/models/User';
import { UserValidationError } from '@/utils/userValidation';
import { db } from '@/config/database';

describe('UserModel', () => {
  beforeAll(async () => {
    // Run migrations for test database
    await db.migrate.latest();
    
    // Seed test roles
    await db('user_roles').insert([
      { role_name: 'fan', display_name: 'Fan', is_active: true },
      { role_name: 'creator', display_name: 'Creator', is_active: true },
      { role_name: 'brand', display_name: 'Brand', is_active: true },
    ]);
  });

  afterAll(async () => {
    // Clean up test database
    await db.destroy();
  });

  beforeEach(async () => {
    // Clean up tables before each test
    await db('user_role_assignments').del();
    await db('user_profiles').del();
    await db('audit_logs').del();
    await db('users').del();
  });

  describe('CRUD Operations', () => {
    it('should create a new user with validation', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
      };

      const user = await UserModel.create(userData);

      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.first_name).toBe(userData.first_name);
      expect(user.last_name).toBe(userData.last_name);
      expect(user.status).toBe('pending_verification');
      expect(user.email_verified).toBe(false);
      expect(user.verification_token).toBeDefined();
      expect(user.password_hash).not.toBe(userData.password); // Should be hashed
    });

    it('should validate email format', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(UserModel.create(userData)).rejects.toThrow(UserValidationError);
    });

    it('should validate password strength', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123', // Too short
      };

      await expect(UserModel.create(userData)).rejects.toThrow(UserValidationError);
    });

    it('should prevent duplicate email', async () => {
      const userData = {
        username: 'testuser1',
        email: 'test@example.com',
        password: 'password123',
      };

      await UserModel.create(userData);

      const duplicateData = {
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password456',
      };

      await expect(UserModel.create(duplicateData)).rejects.toThrow('Email already exists');
    });

    it('should prevent duplicate username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test1@example.com',
        password: 'password123',
      };

      await UserModel.create(userData);

      const duplicateData = {
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password456',
      };

      await expect(UserModel.create(duplicateData)).rejects.toThrow('Username already exists');
    });

    it('should find user by ID', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await UserModel.create(userData);
      const foundUser = await UserModel.findById(createdUser.user_id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.user_id).toBe(createdUser.user_id);
      expect(foundUser?.username).toBe(userData.username);
    });

    it('should find user by email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await UserModel.create(userData);
      const foundUser = await UserModel.findByEmail(userData.email);

      expect(foundUser).toBeDefined();
      expect(foundUser?.user_id).toBe(createdUser.user_id);
      expect(foundUser?.email).toBe(userData.email);
    });

    it('should update user with validation', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await UserModel.create(userData);
      
      const updateData = {
        first_name: 'Updated',
        last_name: 'Name',
      };

      const updatedUser = await UserModel.update(createdUser.user_id, updateData);

      expect(updatedUser.first_name).toBe(updateData.first_name);
      expect(updatedUser.last_name).toBe(updateData.last_name);
      expect(updatedUser.username).toBe(userData.username); // Should remain unchanged
    });

    it('should soft delete user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await UserModel.create(userData);
      await UserModel.delete(createdUser.user_id);

      const foundUser = await UserModel.findById(createdUser.user_id);
      expect(foundUser).toBeNull(); // Should not find deleted user
    });
  });

  describe('Password Management', () => {
    it('should verify password correctly', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await UserModel.create(userData);
      
      const isValid = await UserModel.verifyPassword(userData.password, user.password_hash);
      expect(isValid).toBe(true);
      
      const isInvalid = await UserModel.verifyPassword('wrongpassword', user.password_hash);
      expect(isInvalid).toBe(false);
    });

    it('should set and use password reset token', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      await UserModel.create(userData);
      const resetToken = await UserModel.setPasswordResetToken(userData.email);

      expect(resetToken).toBeDefined();
      expect(typeof resetToken).toBe('string');
      expect(resetToken.length).toBeGreaterThan(0);

      const newPassword = 'newpassword456';
      const updatedUser = await UserModel.resetPassword(resetToken, newPassword);

      const isNewPasswordValid = await UserModel.verifyPassword(newPassword, updatedUser.password_hash);
      expect(isNewPasswordValid).toBe(true);
    });
  });

  describe('Email Verification', () => {
    it('should verify email with valid token', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await UserModel.create(userData);
      const verifiedUser = await UserModel.verifyEmail(createdUser.verification_token as string);

      expect(verifiedUser.email_verified).toBe(true);
      expect(verifiedUser.email_verified_at).toBeDefined();
      expect(verifiedUser.verification_token).toBeNull();
      expect(verifiedUser.status).toBe('active');
    });

    it('should reject invalid verification token', async () => {
      await expect(UserModel.verifyEmail('invalid-token')).rejects.toThrow('Invalid verification token');
    });
  });

  describe('Status Management', () => {
    it('should update user status with validation', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await UserModel.create(userData);
      const updatedUser = await UserModel.updateStatus(createdUser.user_id, 'suspended');

      expect(updatedUser.status).toBe('suspended');
    });

    it('should validate status values', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await UserModel.create(userData);
      
      await expect(UserModel.updateStatus(createdUser.user_id, 'invalid-status')).rejects.toThrow(UserValidationError);
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(async () => {
      // Create test users
      await UserModel.create({
        username: 'alice',
        email: 'alice@example.com',
        password: 'password123',
        first_name: 'Alice',
      });

      await UserModel.create({
        username: 'bob',
        email: 'bob@example.com',
        password: 'password123',
        first_name: 'Bob',
      });

      await UserModel.create({
        username: 'charlie',
        email: 'charlie@example.com',
        password: 'password123',
        first_name: 'Charlie',
      });
    });

    it('should search users by username', async () => {
      const result = await UserModel.search({ username: 'alice' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.username).toBe('alice');
      expect(result.total).toBe(1);
    });

    it('should paginate search results', async () => {
      const result = await UserModel.search({ page: 1, limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
    });
  });

  describe('User Existence Check', () => {
    it('should check if user exists by email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      await UserModel.create(userData);

      const exists = await UserModel.exists(userData.email);
      expect(exists).toBe(true);

      const notExists = await UserModel.exists('nonexistent@example.com');
      expect(notExists).toBe(false);
    });
  });

  describe('Integration with Other Models', () => {
    it('should work with UserRoleModel', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await UserModel.create(userData);
      await UserRoleModel.assignRole(user.user_id, 'creator');

      const roles = await UserRoleModel.getUserRoles(user.user_id);
      expect(roles).toContain('creator');
    });

    it('should work with UserActivityModel', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await UserModel.create(userData);
      await UserActivityModel.logActivity(user.user_id, 'test_action', {
        metadata: { test: 'data' }
      });

      const activities = await UserActivityModel.getActivityHistory(user.user_id);
      expect(activities).toHaveLength(1);
      expect(activities[0]?.action).toBe('test_action');
    });
  });
});
