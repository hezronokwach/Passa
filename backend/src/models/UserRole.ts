import { db } from '@/config/database';
import { User } from '@/types/user';

export class UserRoleModel {
  private static readonly ROLES_TABLE = 'user_roles';
  private static readonly ASSIGNMENTS_TABLE = 'user_role_assignments';
  private static readonly USERS_TABLE = 'users';

  /**
   * Get users by role
   */
  static async getUsersByRole(roleName: string): Promise<User[]> {
    return db(this.USERS_TABLE)
      .join(this.ASSIGNMENTS_TABLE, 'users.user_id', 'user_role_assignments.user_id')
      .join(this.ROLES_TABLE, 'user_role_assignments.role_id', 'user_roles.role_id')
      .where('user_roles.role_name', roleName)
      .where('user_role_assignments.is_active', true)
      .where('users.is_deleted', false)
      .select('users.*');
  }

  /**
   * Assign role to user
   */
  static async assignRole(userId: number, roleName: string, assignedBy?: number): Promise<void> {
    try {
      // Check if user exists
      const user = await db(this.USERS_TABLE)
        .where('user_id', userId)
        .where('is_deleted', false)
        .first();

      if (!user) {
        throw new Error('User not found');
      }

      // Get role
      const role = await db(this.ROLES_TABLE)
        .where('role_name', roleName)
        .where('is_active', true)
        .first();

      if (!role) {
        throw new Error('Role not found');
      }

      // Check if user already has this role
      const existingAssignment = await db(this.ASSIGNMENTS_TABLE)
        .where('user_id', userId)
        .where('role_id', role.role_id)
        .where('is_active', true)
        .first();

      if (existingAssignment) {
        throw new Error('User already has this role');
      }

      // Create role assignment
      await db(this.ASSIGNMENTS_TABLE)
        .insert({
          user_id: userId,
          role_id: role.role_id,
          assigned_by: assignedBy || userId, // Self-assigned if no assignedBy provided
          assigned_at: db.fn.now(),
          is_active: true,
        });
    } catch (error) {
      throw new Error(`Failed to assign role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Remove role from user
   */
  static async removeRole(userId: number, roleName: string): Promise<void> {
    try {
      // Get role
      const role = await db(this.ROLES_TABLE)
        .where('role_name', roleName)
        .where('is_active', true)
        .first();

      if (!role) {
        throw new Error('Role not found');
      }

      // Deactivate role assignment
      const updated = await db(this.ASSIGNMENTS_TABLE)
        .where('user_id', userId)
        .where('role_id', role.role_id)
        .where('is_active', true)
        .update({
          is_active: false,
          updated_at: db.fn.now(),
        });

      if (updated === 0) {
        throw new Error('User does not have this role');
      }
    } catch (error) {
      throw new Error(`Failed to remove role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user roles
   */
  static async getUserRoles(userId: number): Promise<string[]> {
    const roles = await db(this.ASSIGNMENTS_TABLE)
      .join(this.ROLES_TABLE, 'user_role_assignments.role_id', 'user_roles.role_id')
      .where('user_role_assignments.user_id', userId)
      .where('user_role_assignments.is_active', true)
      .where('user_roles.is_active', true)
      .select('user_roles.role_name');

    return roles.map(role => role.role_name);
  }

  /**
   * Check if user has role
   */
  static async hasRole(userId: number, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.includes(roleName);
  }

  /**
   * Get all available roles
   */
  static async getAllRoles(): Promise<Array<{ role_id: number; role_name: string; display_name: string; description?: string }>> {
    return db(this.ROLES_TABLE)
      .where('is_active', true)
      .select('role_id', 'role_name', 'display_name', 'description')
      .orderBy('role_name');
  }

  /**
   * Create a new role (admin function)
   */
  static async createRole(roleName: string, displayName: string, description?: string): Promise<void> {
    try {
      // Check if role already exists
      const existingRole = await db(this.ROLES_TABLE)
        .where('role_name', roleName)
        .first();

      if (existingRole) {
        throw new Error('Role already exists');
      }

      await db(this.ROLES_TABLE)
        .insert({
          role_name: roleName,
          display_name: displayName,
          description,
          is_active: true,
        });
    } catch (error) {
      throw new Error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get role assignment history for a user
   */
  static async getRoleHistory(userId: number): Promise<Array<{
    role_name: string;
    assigned_at: Date;
    assigned_by: number;
    is_active: boolean;
    updated_at?: Date;
  }>> {
    return db(this.ASSIGNMENTS_TABLE)
      .join(this.ROLES_TABLE, 'user_role_assignments.role_id', 'user_roles.role_id')
      .where('user_role_assignments.user_id', userId)
      .select(
        'user_roles.role_name',
        'user_role_assignments.assigned_at',
        'user_role_assignments.assigned_by',
        'user_role_assignments.is_active',
        'user_role_assignments.updated_at'
      )
      .orderBy('user_role_assignments.assigned_at', 'desc');
  }

  /**
   * Get users count by role
   */
  static async getUserCountByRole(): Promise<Record<string, number>> {
    const counts = await db(this.ASSIGNMENTS_TABLE)
      .join(this.ROLES_TABLE, 'user_role_assignments.role_id', 'user_roles.role_id')
      .where('user_role_assignments.is_active', true)
      .where('user_roles.is_active', true)
      .groupBy('user_roles.role_name')
      .select('user_roles.role_name')
      .count('* as count');

    const result: Record<string, number> = {};
    counts.forEach((item) => {
      if (item['role_name']) {
        result[item['role_name']] = parseInt(item['count'] as string, 10);
      }
    });

    return result;
  }
}
