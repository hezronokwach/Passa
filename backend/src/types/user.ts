// User-related TypeScript interfaces and types

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: Date;
  status: UserStatus;
  email_verified: boolean;
  email_verified_at?: Date;
  verification_token?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
  last_login_at?: Date;
  last_login_ip?: string;
  is_deleted: boolean;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: Date;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: Date;
}

export interface SearchFilters {
  username?: string;
  email?: string;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}



export interface ActivityLogInput {
  resource_type?: string;
  resource_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
}


