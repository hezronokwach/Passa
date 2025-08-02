import { EventValidationError } from '@/utils/eventValidation';

export interface MediaValidationOptions {
  maxFileSize?: number; // in bytes
  allowedFormats?: string[];
  maxGalleryImages?: number;
}

export interface MediaMetadata {
  url: string;
  filename?: string;
  size?: number;
  format?: string;
  width?: number;
  height?: number;
  alt_text?: string;
}

export class EventMediaUtils {
  // Default validation options
  private static readonly DEFAULT_OPTIONS: MediaValidationOptions = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maxGalleryImages: 20
  };

  /**
   * Validate image URL format and accessibility
   */
  static validateImageUrl(url: string, fieldName: string = 'image_url'): void {
    if (!url || url.trim().length === 0) {
      throw new EventValidationError(`${fieldName} is required`, fieldName);
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url);
      
      // Check if it's HTTP or HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new EventValidationError(`${fieldName} must use HTTP or HTTPS protocol`, fieldName);
      }

      // Check URL length
      if (url.length > 2048) {
        throw new EventValidationError(`${fieldName} URL is too long (max 2048 characters)`, fieldName);
      }

    } catch (error) {
      throw new EventValidationError(`Invalid URL format for ${fieldName}`, fieldName);
    }
  }

  /**
   * Validate image format based on URL extension
   */
  static validateImageFormat(url: string, options: MediaValidationOptions = {}): void {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    const urlLower = url.toLowerCase();
    const hasValidExtension = opts.allowedFormats!.some(format => 
      urlLower.endsWith(`.${format}`)
    );

    if (!hasValidExtension) {
      throw new EventValidationError(
        `Invalid image format. Allowed formats: ${opts.allowedFormats!.join(', ')}`,
        'image_format'
      );
    }
  }

  /**
   * Validate cover image
   */
  static validateCoverImage(url: string, options: MediaValidationOptions = {}): void {
    this.validateImageUrl(url, 'cover_image_url');
    this.validateImageFormat(url, options);
  }

  /**
   * Validate gallery images
   */
  static validateGalleryImages(urls: string[], options: MediaValidationOptions = {}): void {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    if (!Array.isArray(urls)) {
      throw new EventValidationError('Gallery images must be an array', 'gallery_images');
    }

    if (urls.length > opts.maxGalleryImages!) {
      throw new EventValidationError(
        `Too many gallery images. Maximum allowed: ${opts.maxGalleryImages}`,
        'gallery_images'
      );
    }

    // Validate each URL
    urls.forEach((url, index) => {
      try {
        this.validateImageUrl(url, `gallery_images[${index}]`);
        this.validateImageFormat(url, options);
      } catch (error) {
        if (error instanceof EventValidationError) {
          throw new EventValidationError(
            `Gallery image ${index + 1}: ${error.message}`,
            `gallery_images[${index}]`
          );
        }
        throw error;
      }
    });

    // Check for duplicate URLs
    const uniqueUrls = new Set(urls);
    if (uniqueUrls.size !== urls.length) {
      throw new EventValidationError('Duplicate URLs found in gallery images', 'gallery_images');
    }
  }

  /**
   * Extract filename from URL
   */
  static extractFilename(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || 'unknown';
      return filename;
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Extract file extension from URL
   */
  static extractFileExtension(url: string): string {
    const filename = this.extractFilename(url);
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  }

  /**
   * Generate media metadata from URL
   */
  static generateMediaMetadata(url: string, additionalData: Partial<MediaMetadata> = {}): MediaMetadata {
    return {
      url,
      filename: this.extractFilename(url),
      format: this.extractFileExtension(url),
      ...additionalData
    };
  }

  /**
   * Sanitize gallery images array
   */
  static sanitizeGalleryImages(urls: string[]): string[] {
    if (!Array.isArray(urls)) {
      return [];
    }

    return urls
      .filter(url => url && typeof url === 'string' && url.trim().length > 0)
      .map(url => url.trim())
      .filter((url, index, array) => array.indexOf(url) === index); // Remove duplicates
  }

  /**
   * Generate responsive image URLs (if using a CDN that supports it)
   */
  static generateResponsiveUrls(baseUrl: string, sizes: number[] = [300, 600, 1200]): Record<string, string> {
    const responsiveUrls: Record<string, string> = {};
    
    // This is a placeholder implementation
    // In a real application, you would integrate with your CDN or image service
    sizes.forEach(size => {
      responsiveUrls[`${size}w`] = `${baseUrl}?w=${size}`;
    });

    return responsiveUrls;
  }

  /**
   * Validate and process event media
   */
  static validateAndProcessEventMedia(data: {
    cover_image_url?: string;
    gallery_images?: string[];
  }, options: MediaValidationOptions = {}): {
    cover_image_url?: string;
    gallery_images?: string[];
    media_metadata?: {
      cover_image?: MediaMetadata;
      gallery_images?: MediaMetadata[];
    };
  } {
    const result: Record<string, unknown> = {};
    const metadata: Record<string, unknown> = {};

    // Validate and process cover image
    if (data.cover_image_url) {
      this.validateCoverImage(data.cover_image_url, options);
      result['cover_image_url'] = data.cover_image_url.trim();
      metadata['cover_image'] = this.generateMediaMetadata(result['cover_image_url'] as string);
    }

    // Validate and process gallery images
    if (data.gallery_images) {
      const sanitizedGallery = this.sanitizeGalleryImages(data.gallery_images);
      if (sanitizedGallery.length > 0) {
        this.validateGalleryImages(sanitizedGallery, options);
        result['gallery_images'] = sanitizedGallery;
        metadata['gallery_images'] = sanitizedGallery.map(url => this.generateMediaMetadata(url));
      }
    }

    // Add metadata if any media was processed
    if (metadata['cover_image'] || metadata['gallery_images']) {
      result['media_metadata'] = metadata;
    }

    return result;
  }

  /**
   * Check if URL is likely an image based on extension
   */
  static isImageUrl(url: string): boolean {
    const extension = this.extractFileExtension(url);
    return this.DEFAULT_OPTIONS.allowedFormats!.includes(extension);
  }

  /**
   * Generate alt text for accessibility (placeholder implementation)
   */
  static generateAltText(url: string, eventName?: string): string {
    const filename = this.extractFilename(url);
    const baseName = filename.split('.')[0]?.replace(/[-_]/g, ' ') || 'image';
    
    if (eventName) {
      return `Image for ${eventName} event - ${baseName}`;
    }
    
    return `Event image - ${baseName}`;
  }

  /**
   * Validate media quota for an organizer (placeholder for future implementation)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async validateMediaQuota(_organizerId: number, _newMediaCount: number): Promise<boolean> {
    // This would check against organizer's media storage quota
    // For now, return true (no quota enforcement)
    return true;
  }

  /**
   * Clean up orphaned media URLs (placeholder for future implementation)
   */
  static async cleanupOrphanedMedia(eventId: number, currentUrls: string[]): Promise<void> {
    // This would identify and clean up media files that are no longer referenced
    // Implementation would depend on your media storage solution
    // eslint-disable-next-line no-console
    console.log(`Cleanup orphaned media for event ${eventId}, keeping:`, currentUrls);
  }

  /**
   * Optimize image URL for display (placeholder for CDN integration)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static optimizeImageUrl(url: string, _options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}): string {
    // This would integrate with your CDN or image optimization service
    // For now, return the original URL
    return url;
  }
}
