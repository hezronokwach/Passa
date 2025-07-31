import { db } from '@/config/database';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  SearchFilters,
  PaginatedResult
} from '@/types/user';
import { UserValidation, UserValidationError } from '@/utils/userValidation';
import { PasswordUtils } from '@/utils/passwordUtils';
import { UserRoleModel } from './UserRole';
import { UserActivityModel } from './UserActivity';

// Re-export related models for convenience
export { UserRoleModel, UserActivityModel };
export { UserValidationError };

export class UserModel {
  private static readonly TABLE = 'users';

  /**
   * Create a new user with password hashing and validation
   */
  static async create(userData: CreateUserInput): Promise<User> {
    try {
      // Sanitize and validate input
      const sanitizedData = UserValidation.sanitizeUserInput(userData) as CreateUserInput;
      UserValidation.validateCreateUserInput(sanitizedData);

      // Check if email already exists
      const existingEmail = await db(this.TABLE)
        .where('email', sanitizedData.email)
        .where('is_deleted', false)
        .first();

      if (existingEmail) {
        throw new UserValidationError('Email already exists', 'email');
      }

      // Check if username already exists
      const existingUsername = await db(this.TABLE)
        .where('username', sanitizedData.username)
        .where('is_deleted', false)
        .first();

      if (existingUsername) {
        throw new UserValidationError('Username already exists', 'username');
      }

      // Hash password
      const password_hash = await PasswordUtils.hashPassword(sanitizedData.password);

      // Generate verification token
      const verification_token = PasswordUtils.generateVerificationToken();

      const [user] = await db(this.TABLE)
        .insert({
          username: sanitizedData.username,
          email: sanitizedData.email,
          password_hash,
          first_name: sanitizedData.first_name,
          last_name: sanitizedData.last_name,
          phone: sanitizedData.phone,
          date_of_birth: sanitizedData.date_of_birth,
          verification_token,
          status: 'pending_verification',
          email_verified: false,
          is_deleted: false,
        })
        .returning('*');

      return user;
    } catch (error) {
      if (error instanceof UserValidationError) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<User | null> {
    const user = await db(this.TABLE)
      .where('user_id', id)
      .where('is_deleted', false)
      .first();

    return user || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const user = await db(this.TABLE)
      .where('email', email)
      .where('is_deleted', false)
      .first();

    return user || null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<User | null> {
    const user = await db(this.TABLE)
      .where('username', username)
      .where('is_deleted', false)
      .first();

    return user || null;
  }

  /**
   * Update user information with validation
   */
  static async update(id: number, userData: UpdateUserInput): Promise<User> {
    try {
      // Sanitize and validate input
      const sanitizedData = UserValidation.sanitizeUserInput(userData) as UpdateUserInput;
      UserValidation.validateUpdateUserInput(sanitizedData);

      const user = await this.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Check email uniqueness if email is being updated
      if (sanitizedData.email && sanitizedData.email !== user.email) {
        const existingEmail = await db(this.TABLE)
          .where('email', sanitizedData.email)
          .where('user_id', '!=', id)
          .where('is_deleted', false)
          .first();

        if (existingEmail) {
          throw new UserValidationError('Email already exists', 'email');
        }
      }

      // Check username uniqueness if username is being updated
      if (sanitizedData.username && sanitizedData.username !== user.username) {
        const existingUsername = await db(this.TABLE)
          .where('username', sanitizedData.username)
          .where('user_id', '!=', id)
          .where('is_deleted', false)
          .first();

        if (existingUsername) {
          throw new UserValidationError('Username already exists', 'username');
        }
      }

      const [updatedUser] = await db(this.TABLE)
        .where('user_id', id)
        .update({
          ...sanitizedData,
          updated_at: db.fn.now(),
        })
        .returning('*');

      return updatedUser;
    } catch (error) {
      if (error instanceof UserValidationError) {
        throw error;
      }
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Soft delete user
   */
  static async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await db(this.TABLE)
      .where('user_id', id)
      .update({
        is_deleted: true,
        deleted_at: db.fn.now(),
        updated_at: db.fn.now(),
      });
  }

  /**
   * Update user status with validation
   */
  static async updateStatus(id: number, status: string): Promise<User> {
    try {
      // Validate status
      const validatedStatus = UserValidation.validateStatus(status);

      const user = await this.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      const [updatedUser] = await db(this.TABLE)
        .where('user_id', id)
        .update({
          status: validatedStatus,
          updated_at: db.fn.now(),
        })
        .returning('*');

      return updatedUser;
    } catch (error) {
      if (error instanceof UserValidationError) {
        throw error;
      }
      throw new Error(`Failed to update user status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify user email
   */
  static async verifyEmail(token: string): Promise<User> {
    const user = await db(this.TABLE)
      .where('verification_token', token)
      .where('is_deleted', false)
      .first();

    if (!user) {
      throw new Error('Invalid verification token');
    }

    if (user.email_verified) {
      throw new Error('Email already verified');
    }

    const [updatedUser] = await db(this.TABLE)
      .where('user_id', user.user_id)
      .update({
        email_verified: true,
        email_verified_at: db.fn.now(),
        verification_token: null,
        status: user.status === 'pending_verification' ? 'active' : user.status,
        updated_at: db.fn.now(),
      })
      .returning('*');

    return updatedUser;
  }

  /**
   * Set password reset token
   */
  static async setPasswordResetToken(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = PasswordUtils.generateResetToken();
    const resetExpires = PasswordUtils.getResetTokenExpiry();

    await db(this.TABLE)
      .where('user_id', user.user_id)
      .update({
        reset_password_token: resetToken,
        reset_password_expires: resetExpires,
        updated_at: db.fn.now(),
      });

    return resetToken;
  }

  /**
   * Reset password using token
   */
  static async resetPassword(token: string, newPassword: string): Promise<User> {
    const user = await db(this.TABLE)
      .where('reset_password_token', token)
      .where('is_deleted', false)
      .first();

    if (!user) {
      throw new Error('Invalid reset token');
    }

    if (!user.reset_password_expires || PasswordUtils.isResetTokenExpired(new Date(user.reset_password_expires))) {
      throw new Error('Reset token has expired');
    }

    const password_hash = await PasswordUtils.hashPassword(newPassword);

    const [updatedUser] = await db(this.TABLE)
      .where('user_id', user.user_id)
      .update({
        password_hash,
        reset_password_token: null,
        reset_password_expires: null,
        updated_at: db.fn.now(),
      })
      .returning('*');

    if (!updatedUser) {
      throw new Error('Failed to update user password');
    }

    return updatedUser;
  }

  /**
   * Search users with filters and pagination
   */
  static async search(filters: SearchFilters = {}): Promise<PaginatedResult<User>> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10));
    const offset = (page - 1) * limit;

    let query = db(this.TABLE).where('is_deleted', false);

    if (filters.username) {
      query = query.where('username', 'ILIKE', `%${filters.username}%`);
    }

    if (filters.email) {
      query = query.where('email', 'ILIKE', `%${filters.email}%`);
    }

    if (filters.status) {
      query = query.where('status', filters.status);
    }

    // Get total count
    const totalResult = await query.clone().count('* as count').first();
    const total = parseInt(totalResult?.['count'] as string || '0', 10);

    // Get paginated results
    const data = await query
      .orderBy('created_at', 'desc')
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
   * Check if user exists by email or username
   */
  static async exists(email?: string, username?: string): Promise<boolean> {
    if (!email && !username) return false;

    let query = db(this.TABLE).where('is_deleted', false);

    if (email && username) {
      query = query.where('email', email).orWhere('username', username);
    } else if (email) {
      query = query.where('email', email);
    } else if (username) {
      query = query.where('username', username);
    }

    const user = await query.first();
    return !!user;
  }

  /**
   * Verify password (convenience method)
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return PasswordUtils.verifyPassword(password, hash);
  }
}