import { CreateEventInput, UpdateEventInput, EventStatus } from '@/types/event';

export class EventValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'EventValidationError';
  }
}

export class EventValidation {
  /**
   * Validate event name
   */
  static validateEventName(eventName: string): void {
    if (!eventName || eventName.trim().length === 0) {
      throw new EventValidationError('Event name is required', 'event_name');
    }
    if (eventName.length > 255) {
      throw new EventValidationError('Event name must be less than 255 characters', 'event_name');
    }
    if (eventName.length < 3) {
      throw new EventValidationError('Event name must be at least 3 characters', 'event_name');
    }
  }

  /**
   * Validate and generate slug from event name
   */
  static generateSlug(eventName: string): string {
    return eventName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Validate location
   */
  static validateLocation(location: string): void {
    if (!location || location.trim().length === 0) {
      throw new EventValidationError('Location is required', 'location');
    }
    if (location.length > 255) {
      throw new EventValidationError('Location must be less than 255 characters', 'location');
    }
  }

  /**
   * Validate coordinates
   */
  static validateCoordinates(latitude?: number, longitude?: number): void {
    if (latitude !== undefined) {
      if (latitude < -90 || latitude > 90) {
        throw new EventValidationError('Latitude must be between -90 and 90', 'latitude');
      }
    }
    if (longitude !== undefined) {
      if (longitude < -180 || longitude > 180) {
        throw new EventValidationError('Longitude must be between -180 and 180', 'longitude');
      }
    }
  }

  /**
   * Validate event dates
   */
  static validateEventDates(startDateTime: Date, endDateTime: Date): void {
    const now = new Date();
    
    if (startDateTime <= now) {
      throw new EventValidationError('Event start date must be in the future', 'start_datetime');
    }
    
    if (endDateTime <= startDateTime) {
      throw new EventValidationError('Event end date must be after start date', 'end_datetime');
    }
    
    // Check if event duration is reasonable (max 30 days)
    const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    if (endDateTime.getTime() - startDateTime.getTime() > maxDuration) {
      throw new EventValidationError('Event duration cannot exceed 30 days', 'end_datetime');
    }
  }

  /**
   * Validate timezone
   */
  static validateTimezone(timezone: string): void {
    try {
      // Test if timezone is valid by creating a date with it
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
    } catch (error) {
      throw new EventValidationError('Invalid timezone', 'timezone');
    }
  }

  /**
   * Validate ticket capacity
   */
  static validateTicketCapacity(totalTicketsAvailable: number): void {
    if (!Number.isInteger(totalTicketsAvailable) || totalTicketsAvailable <= 0) {
      throw new EventValidationError('Total tickets available must be a positive integer', 'total_tickets_available');
    }
    if (totalTicketsAvailable > 1000000) {
      throw new EventValidationError('Total tickets available cannot exceed 1,000,000', 'total_tickets_available');
    }
  }

  /**
   * Validate ticket pricing
   */
  static validateTicketPricing(minPrice?: number, maxPrice?: number): void {
    if (minPrice !== undefined) {
      if (minPrice < 0) {
        throw new EventValidationError('Minimum ticket price cannot be negative', 'min_ticket_price');
      }
      if (minPrice > 100000) {
        throw new EventValidationError('Minimum ticket price cannot exceed $100,000', 'min_ticket_price');
      }
    }
    
    if (maxPrice !== undefined) {
      if (maxPrice < 0) {
        throw new EventValidationError('Maximum ticket price cannot be negative', 'max_ticket_price');
      }
      if (maxPrice > 100000) {
        throw new EventValidationError('Maximum ticket price cannot exceed $100,000', 'max_ticket_price');
      }
    }
    
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new EventValidationError('Minimum ticket price cannot be greater than maximum price', 'min_ticket_price');
    }
  }

  /**
   * Validate currency code
   */
  static validateCurrency(currency: string): void {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY'];
    if (!validCurrencies.includes(currency.toUpperCase())) {
      throw new EventValidationError('Invalid currency code', 'currency');
    }
  }

  /**
   * Validate event status
   */
  static validateEventStatus(status: string): void {
    const validStatuses: EventStatus[] = ['draft', 'published', 'cancelled', 'completed', 'postponed'];
    if (!validStatuses.includes(status as EventStatus)) {
      throw new EventValidationError('Invalid event status', 'status');
    }
  }

  /**
   * Validate URL format
   */
  static validateUrl(url: string, fieldName: string): void {
    try {
      new URL(url);
    } catch (error) {
      throw new EventValidationError(`Invalid URL format for ${fieldName}`, fieldName);
    }
  }

  /**
   * Validate description length
   */
  static validateDescription(description: string, fieldName: string, maxLength: number): void {
    if (description.length > maxLength) {
      throw new EventValidationError(`${fieldName} must be less than ${maxLength} characters`, fieldName);
    }
  }

  /**
   * Validate access code format
   */
  static validateAccessCode(accessCode: string): void {
    if (accessCode.length < 4 || accessCode.length > 50) {
      throw new EventValidationError('Access code must be between 4 and 50 characters', 'access_code');
    }
    if (!/^[A-Za-z0-9]+$/.test(accessCode)) {
      throw new EventValidationError('Access code can only contain letters and numbers', 'access_code');
    }
  }

  /**
   * Validate create event input
   */
  static validateCreateEventInput(eventData: CreateEventInput): void {
    this.validateEventName(eventData.event_name);
    this.validateLocation(eventData.location);
    this.validateCoordinates(eventData.latitude, eventData.longitude);
    this.validateEventDates(eventData.start_datetime, eventData.end_datetime);
    this.validateTicketCapacity(eventData.total_tickets_available);
    
    if (eventData.timezone) {
      this.validateTimezone(eventData.timezone);
    }
    
    if (eventData.min_ticket_price !== undefined || eventData.max_ticket_price !== undefined) {
      this.validateTicketPricing(eventData.min_ticket_price, eventData.max_ticket_price);
    }
    
    if (eventData.currency) {
      this.validateCurrency(eventData.currency);
    }
    
    if (eventData.description) {
      this.validateDescription(eventData.description, 'description', 10000);
    }
    
    if (eventData.short_description) {
      this.validateDescription(eventData.short_description, 'short_description', 500);
    }
    
    if (eventData.cover_image_url) {
      this.validateUrl(eventData.cover_image_url, 'cover_image_url');
    }
    
    if (eventData.gallery_images) {
      eventData.gallery_images.forEach((url, index) => {
        this.validateUrl(url, `gallery_images[${index}]`);
      });
    }
    
    if (eventData.access_code) {
      this.validateAccessCode(eventData.access_code);
    }
  }

  /**
   * Validate update event input
   */
  static validateUpdateEventInput(eventData: UpdateEventInput): void {
    if (eventData.event_name) {
      this.validateEventName(eventData.event_name);
    }
    
    if (eventData.location) {
      this.validateLocation(eventData.location);
    }
    
    if (eventData.latitude !== undefined || eventData.longitude !== undefined) {
      this.validateCoordinates(eventData.latitude, eventData.longitude);
    }
    
    if (eventData.start_datetime && eventData.end_datetime) {
      this.validateEventDates(eventData.start_datetime, eventData.end_datetime);
    }
    
    if (eventData.total_tickets_available) {
      this.validateTicketCapacity(eventData.total_tickets_available);
    }
    
    if (eventData.timezone) {
      this.validateTimezone(eventData.timezone);
    }
    
    if (eventData.min_ticket_price !== undefined || eventData.max_ticket_price !== undefined) {
      this.validateTicketPricing(eventData.min_ticket_price, eventData.max_ticket_price);
    }
    
    if (eventData.currency) {
      this.validateCurrency(eventData.currency);
    }
    
    if (eventData.description) {
      this.validateDescription(eventData.description, 'description', 10000);
    }
    
    if (eventData.short_description) {
      this.validateDescription(eventData.short_description, 'short_description', 500);
    }
    
    if (eventData.cover_image_url) {
      this.validateUrl(eventData.cover_image_url, 'cover_image_url');
    }
    
    if (eventData.gallery_images) {
      eventData.gallery_images.forEach((url, index) => {
        this.validateUrl(url, `gallery_images[${index}]`);
      });
    }
    
    if (eventData.access_code) {
      this.validateAccessCode(eventData.access_code);
    }
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  /**
   * Sanitize event input data
   */
  static sanitizeEventInput(eventData: CreateEventInput | UpdateEventInput): CreateEventInput | UpdateEventInput {
    const sanitized = { ...eventData };
    
    if (sanitized.event_name) {
      sanitized.event_name = this.sanitizeString(sanitized.event_name);
    }
    
    if (sanitized.location) {
      sanitized.location = this.sanitizeString(sanitized.location);
    }
    
    if (sanitized.venue_name) {
      sanitized.venue_name = this.sanitizeString(sanitized.venue_name);
    }
    
    if (sanitized.description) {
      sanitized.description = this.sanitizeString(sanitized.description);
    }
    
    if (sanitized.short_description) {
      sanitized.short_description = this.sanitizeString(sanitized.short_description);
    }
    
    return sanitized;
  }
}
