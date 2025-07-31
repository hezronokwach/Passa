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
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

// UserProfile-related types
export interface SocialLinks {
  twitter_handle?: string;
  instagram_handle?: string;
  linkedin_handle?: string;
  website_url?: string;
}

export interface NotificationSettings {
  email_notifications?: boolean;
  push_notifications?: boolean;
  event_reminders?: boolean;
  marketing_emails?: boolean;
  weekly_digest?: boolean;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  timezone?: string;
  date_format?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  time_format?: '12h' | '24h';
  currency?: string;
}

export interface PrivacySettings {
  profile_visibility?: 'public' | 'private' | 'friends_only';
  show_email?: boolean;
  show_phone?: boolean;
  show_location?: boolean;
  allow_messages?: boolean;
  show_activity?: boolean;
}

export interface UserProfile {
  profile_id: number;
  user_id: number;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  location?: string;
  timezone?: string;
  language: string;
  social_links?: SocialLinks;
  preferences?: UserPreferences;
  notification_settings?: NotificationSettings;
  privacy_settings?: PrivacySettings;
  is_public: boolean;
  profile_completion_percentage: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserProfileInput {
  user_id: number;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  location?: string;
  timezone?: string;
  language?: string;
  social_links?: SocialLinks;
  preferences?: UserPreferences;
  notification_settings?: NotificationSettings;
  privacy_settings?: PrivacySettings;
  is_public?: boolean;
}

export interface UpdateUserProfileInput {
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  location?: string;
  timezone?: string;
  language?: string;
  social_links?: SocialLinks;
  preferences?: UserPreferences;
  notification_settings?: NotificationSettings;
  privacy_settings?: PrivacySettings;
  is_public?: boolean;
}


