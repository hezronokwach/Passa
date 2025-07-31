import { 
  CreateUserProfileInput, 
  UpdateUserProfileInput, 
  SocialLinks, 
  NotificationSettings, 
  UserPreferences, 
  PrivacySettings 
} from '@/types/user';

export class UserProfileValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'UserProfileValidationError';
  }
}

export class UserProfileValidation {
  /**
   * Validate URL format
   */
  static validateUrl(url: string, fieldName: string): void {
    if (!url) return;
    
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new UserProfileValidationError(`${fieldName} must use HTTP or HTTPS protocol`, fieldName);
      }
    } catch {
      throw new UserProfileValidationError(`Invalid ${fieldName} format`, fieldName);
    }
    
    if (url.length > 500) {
      throw new UserProfileValidationError(`${fieldName} must be less than 500 characters`, fieldName);
    }
  }

  /**
   * Validate bio text
   */
  static validateBio(bio: string): void {
    if (!bio) return;
    
    if (bio.length > 1000) {
      throw new UserProfileValidationError('Bio must be less than 1000 characters', 'bio');
    }
    
    // Check for potentially harmful content (basic check)
    const suspiciousPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
    if (suspiciousPatterns.some(pattern => pattern.test(bio))) {
      throw new UserProfileValidationError('Bio contains invalid content', 'bio');
    }
  }

  /**
   * Validate social media handle
   */
  static validateSocialHandle(handle: string, platform: string): void {
    if (!handle) return;
    
    // Remove @ symbol if present
    const cleanHandle = handle.replace(/^@/, '');
    
    if (cleanHandle.length < 1 || cleanHandle.length > 50) {
      throw new UserProfileValidationError(`${platform} handle must be between 1 and 50 characters`, platform);
    }
    
    // Basic alphanumeric and underscore validation
    const validPattern = /^[a-zA-Z0-9_.-]+$/;
    if (!validPattern.test(cleanHandle)) {
      throw new UserProfileValidationError(`${platform} handle contains invalid characters`, platform);
    }
  }

  /**
   * Validate location
   */
  static validateLocation(location: string): void {
    if (!location) return;
    
    if (location.length > 255) {
      throw new UserProfileValidationError('Location must be less than 255 characters', 'location');
    }
  }

  /**
   * Validate timezone
   */
  static validateTimezone(timezone: string): void {
    if (!timezone) return;
    
    // Basic timezone validation - should be a valid IANA timezone
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
    } catch {
      throw new UserProfileValidationError('Invalid timezone format', 'timezone');
    }
  }

  /**
   * Validate language code
   */
  static validateLanguage(language: string): void {
    if (!language) return;
    
    // Basic language code validation (ISO 639-1)
    const validLanguagePattern = /^[a-z]{2}(-[A-Z]{2})?$/;
    if (!validLanguagePattern.test(language)) {
      throw new UserProfileValidationError('Invalid language code format', 'language');
    }
  }

  /**
   * Validate social links object
   */
  static validateSocialLinks(socialLinks: SocialLinks): void {
    if (!socialLinks) return;
    
    if (socialLinks.website_url) {
      this.validateUrl(socialLinks.website_url, 'website_url');
    }
    
    if (socialLinks.twitter_handle) {
      this.validateSocialHandle(socialLinks.twitter_handle, 'twitter_handle');
    }
    
    if (socialLinks.instagram_handle) {
      this.validateSocialHandle(socialLinks.instagram_handle, 'instagram_handle');
    }
    
    if (socialLinks.linkedin_handle) {
      this.validateSocialHandle(socialLinks.linkedin_handle, 'linkedin_handle');
    }
  }

  /**
   * Validate notification settings
   */
  static validateNotificationSettings(settings: NotificationSettings): void {
    if (!settings) return;
    
    // All notification settings should be boolean values
    const booleanFields = [
      'email_notifications', 
      'push_notifications', 
      'event_reminders', 
      'marketing_emails', 
      'weekly_digest'
    ];
    
    for (const field of booleanFields) {
      const value = settings[field as keyof NotificationSettings];
      if (value !== undefined && typeof value !== 'boolean') {
        throw new UserProfileValidationError(`${field} must be a boolean value`, field);
      }
    }
  }

  /**
   * Validate user preferences
   */
  static validateUserPreferences(preferences: UserPreferences): void {
    if (!preferences) return;
    
    if (preferences.theme && !['light', 'dark', 'auto'].includes(preferences.theme)) {
      throw new UserProfileValidationError('Invalid theme value', 'theme');
    }
    
    if (preferences.language) {
      this.validateLanguage(preferences.language);
    }
    
    if (preferences.timezone) {
      this.validateTimezone(preferences.timezone);
    }
    
    if (preferences.date_format && !['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].includes(preferences.date_format)) {
      throw new UserProfileValidationError('Invalid date format value', 'date_format');
    }
    
    if (preferences.time_format && !['12h', '24h'].includes(preferences.time_format)) {
      throw new UserProfileValidationError('Invalid time format value', 'time_format');
    }
    
    if (preferences.currency && preferences.currency.length !== 3) {
      throw new UserProfileValidationError('Currency must be a 3-letter ISO code', 'currency');
    }
  }

  /**
   * Validate privacy settings
   */
  static validatePrivacySettings(settings: PrivacySettings): void {
    if (!settings) return;
    
    if (settings.profile_visibility && !['public', 'private', 'friends_only'].includes(settings.profile_visibility)) {
      throw new UserProfileValidationError('Invalid profile visibility value', 'profile_visibility');
    }
    
    // All other privacy settings should be boolean values
    const booleanFields = ['show_email', 'show_phone', 'show_location', 'allow_messages', 'show_activity'];
    
    for (const field of booleanFields) {
      const value = settings[field as keyof PrivacySettings];
      if (value !== undefined && typeof value !== 'boolean') {
        throw new UserProfileValidationError(`${field} must be a boolean value`, field);
      }
    }
  }

  /**
   * Sanitize user profile input
   */
  static sanitizeUserProfileInput(input: CreateUserProfileInput | UpdateUserProfileInput): CreateUserProfileInput | UpdateUserProfileInput {
    const sanitized = { ...input };
    
    // Trim string fields
    if (sanitized.bio) sanitized.bio = sanitized.bio.trim();
    if (sanitized.avatar_url) sanitized.avatar_url = sanitized.avatar_url.trim();
    if (sanitized.cover_image_url) sanitized.cover_image_url = sanitized.cover_image_url.trim();
    if (sanitized.location) sanitized.location = sanitized.location.trim();
    if (sanitized.timezone) sanitized.timezone = sanitized.timezone.trim();
    if (sanitized.language) sanitized.language = sanitized.language.trim().toLowerCase();
    
    // Sanitize social links
    if (sanitized.social_links) {
      const socialLinks = { ...sanitized.social_links };
      if (socialLinks.website_url) socialLinks.website_url = socialLinks.website_url.trim();
      if (socialLinks.twitter_handle) socialLinks.twitter_handle = socialLinks.twitter_handle.trim().replace(/^@/, '');
      if (socialLinks.instagram_handle) socialLinks.instagram_handle = socialLinks.instagram_handle.trim().replace(/^@/, '');
      if (socialLinks.linkedin_handle) socialLinks.linkedin_handle = socialLinks.linkedin_handle.trim().replace(/^@/, '');
      sanitized.social_links = socialLinks;
    }
    
    return sanitized;
  }

  /**
   * Validate create user profile input
   */
  static validateCreateUserProfileInput(input: CreateUserProfileInput): void {
    if (!input.user_id || typeof input.user_id !== 'number') {
      throw new UserProfileValidationError('Valid user_id is required', 'user_id');
    }
    
    this.validateCommonFields(input);
  }

  /**
   * Validate update user profile input
   */
  static validateUpdateUserProfileInput(input: UpdateUserProfileInput): void {
    this.validateCommonFields(input);
  }

  /**
   * Validate common fields for both create and update operations
   */
  private static validateCommonFields(input: CreateUserProfileInput | UpdateUserProfileInput): void {
    if (input.bio) {
      this.validateBio(input.bio);
    }
    
    if (input.avatar_url) {
      this.validateUrl(input.avatar_url, 'avatar_url');
    }
    
    if (input.cover_image_url) {
      this.validateUrl(input.cover_image_url, 'cover_image_url');
    }
    
    if (input.location) {
      this.validateLocation(input.location);
    }
    
    if (input.timezone) {
      this.validateTimezone(input.timezone);
    }
    
    if (input.language) {
      this.validateLanguage(input.language);
    }
    
    if (input.social_links) {
      this.validateSocialLinks(input.social_links);
    }
    
    if (input.notification_settings) {
      this.validateNotificationSettings(input.notification_settings);
    }
    
    if (input.preferences) {
      this.validateUserPreferences(input.preferences);
    }
    
    if (input.privacy_settings) {
      this.validatePrivacySettings(input.privacy_settings);
    }
    
    if (input.is_public !== undefined && typeof input.is_public !== 'boolean') {
      throw new UserProfileValidationError('is_public must be a boolean value', 'is_public');
    }
  }
}
