import { CreateUserInput, UpdateUserInput, UserStatus } from '@/types/user';

export class UserValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'UserValidationError';
  }
}

export class UserValidation {
  /**
   * Validate email format
   */
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new UserValidationError('Invalid email format', 'email');
    }
    if (email.length > 255) {
      throw new UserValidationError('Email must be less than 255 characters', 'email');
    }
  }

  /**
   * Validate username format
   */
  static validateUsername(username: string): void {
    if (username.length < 3 || username.length > 50) {
      throw new UserValidationError('Username must be between 3 and 50 characters', 'username');
    }
    
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      throw new UserValidationError('Username can only contain letters, numbers, underscores, and hyphens', 'username');
    }
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new UserValidationError('Password must be at least 8 characters long', 'password');
    }
    
    if (password.length > 128) {
      throw new UserValidationError('Password must be less than 128 characters', 'password');
    }

    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasLetter || !hasNumber) {
      throw new UserValidationError('Password must contain at least one letter and one number', 'password');
    }
  }

  /**
   * Validate phone number format (basic validation)
   */
  static validatePhone(phone: string): void {
    if (phone.length < 10 || phone.length > 20) {
      throw new UserValidationError('Phone number must be between 10 and 20 characters', 'phone');
    }
    
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-()]/g, ''))) {
      throw new UserValidationError('Invalid phone number format', 'phone');
    }
  }

  /**
   * Validate user status
   */
  static validateStatus(status: string): UserStatus {
    const validStatuses: UserStatus[] = ['active', 'inactive', 'suspended', 'pending_verification'];
    if (!validStatuses.includes(status as UserStatus)) {
      throw new UserValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 'status');
    }
    return status as UserStatus;
  }

  /**
   * Validate name fields
   */
  static validateName(name: string, fieldName: string): void {
    if (name.length < 1 || name.length > 100) {
      throw new UserValidationError(`${fieldName} must be between 1 and 100 characters`, fieldName);
    }
    
    const nameRegex = /^[a-zA-Z\s\-'.]+$/;
    if (!nameRegex.test(name)) {
      throw new UserValidationError(`${fieldName} can only contain letters, spaces, hyphens, apostrophes, and periods`, fieldName);
    }
  }

  /**
   * Validate date of birth
   */
  static validateDateOfBirth(dateOfBirth: Date): void {
    const now = new Date();
    const minAge = 13; // Minimum age requirement
    const maxAge = 120; // Maximum reasonable age
    
    const age = now.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = now.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dateOfBirth.getDate())) {
      // Birthday hasn't occurred this year
    }
    
    if (age < minAge) {
      throw new UserValidationError(`User must be at least ${minAge} years old`, 'date_of_birth');
    }
    
    if (age > maxAge) {
      throw new UserValidationError(`Invalid date of birth`, 'date_of_birth');
    }
    
    if (dateOfBirth > now) {
      throw new UserValidationError('Date of birth cannot be in the future', 'date_of_birth');
    }
  }

  /**
   * Validate create user input
   */
  static validateCreateUserInput(userData: CreateUserInput): void {
    this.validateEmail(userData.email);
    this.validateUsername(userData.username);
    this.validatePassword(userData.password);
    
    if (userData.first_name) {
      this.validateName(userData.first_name, 'first_name');
    }
    
    if (userData.last_name) {
      this.validateName(userData.last_name, 'last_name');
    }
    
    if (userData.phone) {
      this.validatePhone(userData.phone);
    }
    
    if (userData.date_of_birth) {
      this.validateDateOfBirth(userData.date_of_birth);
    }
  }

  /**
   * Validate update user input
   */
  static validateUpdateUserInput(userData: UpdateUserInput): void {
    if (userData.email) {
      this.validateEmail(userData.email);
    }
    
    if (userData.username) {
      this.validateUsername(userData.username);
    }
    
    if (userData.first_name) {
      this.validateName(userData.first_name, 'first_name');
    }
    
    if (userData.last_name) {
      this.validateName(userData.last_name, 'last_name');
    }
    
    if (userData.phone) {
      this.validatePhone(userData.phone);
    }
    
    if (userData.date_of_birth) {
      this.validateDateOfBirth(userData.date_of_birth);
    }
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  /**
   * Sanitize user input data
   */
  static sanitizeUserInput(userData: CreateUserInput | UpdateUserInput): CreateUserInput | UpdateUserInput {
    const sanitized = { ...userData };
    
    if (sanitized.email) {
      sanitized.email = this.sanitizeString(sanitized.email.toLowerCase());
    }
    
    if (sanitized.username) {
      sanitized.username = this.sanitizeString(sanitized.username.toLowerCase());
    }
    
    if (sanitized.first_name) {
      sanitized.first_name = this.sanitizeString(sanitized.first_name);
    }
    
    if (sanitized.last_name) {
      sanitized.last_name = this.sanitizeString(sanitized.last_name);
    }
    
    if (sanitized.phone) {
      sanitized.phone = sanitized.phone.replace(/[\s\-()]/g, '');
    }
    
    return sanitized;
  }
}
