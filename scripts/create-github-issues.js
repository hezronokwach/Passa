#!/usr/bin/env node

/**
 * Script to create GitHub issues for Passa development phases
 * Usage: node scripts/create-github-issues.js <github-token> <repo-owner> <repo-name>
 * 
 * Example: node scripts/create-github-issues.js ghp_xxxx hezronokwach Passa
 */

const https = require('https');

// GitHub API configuration
const GITHUB_API_BASE = 'api.github.com';

// Phase 1 Issues
const phase1Issues = [
  {
    title: "Database Schema Design & Migration Setup",
    body: `## Description
Create comprehensive database schema design and implement Knex migration files for all core entities in the Passa platform.

## Acceptance Criteria
- [ ] Design and document complete database schema with relationships
- [ ] Create Knex migration files for all core tables:
  - \`users\` table with authentication fields
  - \`user_profiles\` table with extended user information
  - \`events\` table with event management fields
  - \`event_categories\` and \`event_tags\` tables
  - \`tickets\` table for NFT ticket management
  - \`transactions\` table for payment tracking
  - \`user_roles\` and \`permissions\` tables
- [ ] Add proper database constraints, indexes, and foreign keys
- [ ] Create database seed files for development data
- [ ] Document database relationships and design decisions

## Technical Requirements
- Use existing Knex.js configuration in backend
- Follow PostgreSQL best practices for performance
- Include proper data validation at database level
- Add created_at/updated_at timestamps to all tables
- Include soft delete functionality where appropriate

## Definition of Done
- All migration files run successfully
- Database schema is properly documented
- Seed data populates correctly
- All relationships work as expected
- Database performance is optimized with proper indexes`,
    labels: ["backend", "database", "high-priority", "phase-1"]
  },
  {
    title: "User Model Implementation",
    body: `## Description
Implement comprehensive User model with authentication methods, profile management, and role-based access control.

## Acceptance Criteria
- [ ] Create User model class with CRUD operations
- [ ] Implement password hashing using bcrypt
- [ ] Add email validation and uniqueness checks
- [ ] Create user role management (Creator/Brand/Fan)
- [ ] Implement user status management (active, inactive, suspended)
- [ ] Add user preferences and settings functionality
- [ ] Create user search and filtering methods
- [ ] Add user activity tracking

## Technical Requirements
- Use existing bcrypt dependency
- Implement proper error handling
- Add input validation and sanitization
- Follow security best practices for password handling
- Include proper TypeScript types

## Definition of Done
- User model passes all unit tests
- Password hashing works correctly
- Role-based access control functions properly
- All CRUD operations work as expected
- Model integrates with existing database schema`,
    labels: ["backend", "authentication", "high-priority", "phase-1"]
  },
  {
    title: "UserProfile Model Implementation",
    body: `## Description
Create UserProfile model for extended user information including profile images, bio, social links, and user-specific settings.

## Acceptance Criteria
- [ ] Create UserProfile model with relationship to User
- [ ] Add profile image URL field
- [ ] Implement bio and description fields
- [ ] Add social media links (Twitter, Instagram, etc.)
- [ ] Create user preferences (notifications, privacy settings)
- [ ] Add location and timezone fields
- [ ] Implement profile completion tracking
- [ ] Add profile visibility controls

## Technical Requirements
- One-to-one relationship with User model
- Proper validation for URLs and text fields
- Support for JSON fields for flexible data storage
- Include profile completion percentage calculation

## Definition of Done
- UserProfile model works with User model
- All profile fields can be updated
- Profile completion tracking works
- Privacy controls function correctly`,
    labels: ["backend", "user-management", "medium-priority", "phase-1"]
  },
  {
    title: "Event Model Implementation",
    body: `## Description
Implement Event model with comprehensive event management functionality including CRUD operations, status management, and categorization.

## Acceptance Criteria
- [ ] Create Event model with all required fields
- [ ] Implement event status management (draft, published, cancelled, completed)
- [ ] Add event categorization and tagging system
- [ ] Create event date/time handling with timezone support
- [ ] Implement event capacity and ticket management
- [ ] Add event media (images, videos) handling
- [ ] Create event search and filtering functionality
- [ ] Add event owner/creator relationship

## Technical Requirements
- Relationship with User model for event creators
- Proper date/time handling with timezone awareness
- Support for event media URLs
- Flexible pricing structure for different ticket types
- Event status workflow management

## Definition of Done
- Event model supports all required operations
- Event status transitions work correctly
- Search and filtering perform efficiently
- Event-user relationships function properly
- All validations work as expected`,
    labels: ["backend", "events", "high-priority", "phase-1"]
  },
  {
    title: "Authentication Controller Implementation",
    body: `## Description
Implement comprehensive authentication controller with JWT token management, user registration, login, and password reset functionality.

## Acceptance Criteria
- [ ] Create user registration endpoint with email verification
- [ ] Implement login endpoint with JWT token generation
- [ ] Add password reset flow with secure token generation
- [ ] Implement JWT token validation middleware
- [ ] Add refresh token mechanism
- [ ] Create logout functionality with token invalidation
- [ ] Implement rate limiting for authentication endpoints
- [ ] Add Stellar wallet connection authentication

## Technical Requirements
- Use existing JWT and bcrypt dependencies
- Implement secure token generation and validation
- Add proper error handling and user feedback
- Include rate limiting to prevent brute force attacks
- Support for both email/password and wallet authentication

## Definition of Done
- All authentication endpoints work with frontend
- JWT tokens are generated and validated correctly
- Password reset flow works end-to-end
- Rate limiting prevents abuse
- Wallet authentication is functional`,
    labels: ["backend", "authentication", "critical", "phase-1"]
  },
  {
    title: "User Controller Implementation",
    body: `## Description
Create User controller with profile management, dashboard data aggregation, and user settings functionality.

## Acceptance Criteria
- [ ] Implement user profile CRUD operations
- [ ] Create user dashboard data aggregation endpoint
- [ ] Add user settings management
- [ ] Implement user activity tracking
- [ ] Create user search and discovery endpoints
- [ ] Add user following/follower functionality (basic)
- [ ] Implement account deactivation/deletion
- [ ] Add user statistics and analytics

## Technical Requirements
- Proper authorization checks for user data access
- Efficient data aggregation for dashboard
- Support for profile image uploads (prepare for Phase 2)
- Include proper error handling and validation

## Definition of Done
- User profile management works completely
- Dashboard displays relevant user data
- User settings can be updated
- All endpoints are properly secured
- Performance is optimized for dashboard queries`,
    labels: ["backend", "user-management", "high-priority", "phase-1"]
  },
  {
    title: "Event Controller Implementation",
    body: `## Description
Implement Event controller with full CRUD operations, event discovery, search functionality, and event management features.

## Acceptance Criteria
- [ ] Create event creation endpoint with validation
- [ ] Implement event editing and deletion
- [ ] Add event discovery with pagination
- [ ] Create event search with filters (category, date, location)
- [ ] Implement event status management
- [ ] Add event analytics and statistics
- [ ] Create event duplication functionality
- [ ] Add event owner verification

## Technical Requirements
- Proper authorization for event management
- Efficient search and filtering with database indexes
- Support for complex queries with multiple filters
- Include event validation and business rules

## Definition of Done
- Event CRUD operations work completely
- Event discovery and search perform efficiently
- Event management features function correctly
- All endpoints are properly secured and validated
- Frontend can interact with all event endpoints`,
    labels: ["backend", "events", "high-priority", "phase-1"]
  },
  {
    title: "API Documentation Setup",
    body: `## Description
Set up comprehensive API documentation using Swagger/OpenAPI for all implemented endpoints.

## Acceptance Criteria
- [ ] Install and configure Swagger/OpenAPI
- [ ] Document all authentication endpoints
- [ ] Document all user management endpoints
- [ ] Document all event management endpoints
- [ ] Add request/response examples
- [ ] Include authentication requirements
- [ ] Add error response documentation
- [ ] Create interactive API testing interface

## Technical Requirements
- Use swagger-jsdoc and swagger-ui-express
- Include proper TypeScript type definitions
- Add comprehensive examples and descriptions
- Include rate limiting information

## Definition of Done
- All endpoints are documented
- Documentation is accessible via web interface
- Examples work correctly
- Documentation stays in sync with code changes`,
    labels: ["backend", "documentation", "medium-priority", "phase-1"]
  }
];

// Phase 2 Issues
const phase2Issues = [
  {
    title: "AWS S3 Integration for File Upload",
    body: `## Description
Configure AWS S3 bucket integration for secure file storage with proper access controls and CDN setup.

## Acceptance Criteria
- [ ] Configure AWS S3 bucket with proper permissions
- [ ] Set up AWS SDK integration in backend
- [ ] Implement secure file upload with signed URLs
- [ ] Add file type validation and security scanning
- [ ] Configure CloudFront CDN for fast delivery
- [ ] Add file deletion and cleanup functionality
- [ ] Implement file size limits and quotas
- [ ] Add file metadata storage

## Technical Requirements
- Use existing AWS SDK and Multer dependencies
- Implement proper error handling for upload failures
- Add virus scanning for uploaded files
- Include proper CORS configuration for direct uploads

## Definition of Done
- Files can be uploaded securely to S3
- CDN delivers files quickly
- File validation prevents malicious uploads
- Upload progress and error handling work correctly`,
    labels: ["backend", "file-upload", "aws", "high-priority", "phase-2"]
  },
  {
    title: "Profile Image Upload System",
    body: `## Description
Implement profile image upload functionality with image processing, optimization, and thumbnail generation.

## Acceptance Criteria
- [ ] Create profile image upload endpoint
- [ ] Add image processing and optimization
- [ ] Generate multiple image sizes (thumbnail, medium, large)
- [ ] Implement image validation (format, size, dimensions)
- [ ] Add image cropping and editing capabilities
- [ ] Create image deletion and replacement
- [ ] Add default avatar system
- [ ] Implement image caching strategies

## Technical Requirements
- Use Sharp or similar for image processing
- Support common image formats (JPEG, PNG, WebP)
- Implement proper error handling for processing failures
- Add image metadata extraction

## Definition of Done
- Users can upload and update profile images
- Images are properly processed and optimized
- Multiple image sizes are generated
- Image validation prevents invalid uploads
- Frontend displays images correctly`,
    labels: ["backend", "frontend", "file-upload", "user-management", "medium-priority", "phase-2"]
  },
  {
    title: "Event Media Upload System",
    body: `## Description
Create comprehensive media upload system for events including images, videos, and documents with proper organization.

## Acceptance Criteria
- [ ] Implement event image upload (multiple images per event)
- [ ] Add video upload with processing and thumbnails
- [ ] Create document upload for event materials
- [ ] Implement media gallery management
- [ ] Add media ordering and organization
- [ ] Create media deletion and replacement
- [ ] Add media compression and optimization
- [ ] Implement media access controls

## Technical Requirements
- Support multiple file types per event
- Implement video processing for different formats
- Add proper file organization in S3
- Include media metadata and descriptions

## Definition of Done
- Events can have multiple media files
- Media is properly processed and optimized
- Media gallery works in frontend
- Access controls protect private media
- Media management is user-friendly`,
    labels: ["backend", "frontend", "file-upload", "events", "high-priority", "phase-2"]
  },
  {
    title: "Email Service Implementation",
    body: `## Description
Set up comprehensive email service with templates, queue system, and delivery tracking for all platform communications.

## Acceptance Criteria
- [ ] Configure Nodemailer with email provider (SendGrid/AWS SES)
- [ ] Create email templates for all use cases:
  - Welcome email
  - Email verification
  - Password reset
  - Event notifications
  - Payment confirmations
- [ ] Implement email queue system with Bull
- [ ] Add email delivery tracking and status
- [ ] Create email preferences management
- [ ] Add email bounce and complaint handling
- [ ] Implement email analytics and reporting

## Technical Requirements
- Use existing Nodemailer and Bull dependencies
- Create responsive HTML email templates
- Implement proper error handling and retry logic
- Add email template versioning

## Definition of Done
- All email types are sent reliably
- Email templates are responsive and branded
- Queue system handles high volume
- Delivery tracking provides insights
- Users can manage email preferences`,
    labels: ["backend", "email", "notifications", "high-priority", "phase-2"]
  },
  {
    title: "User Dashboard Data Aggregation",
    body: `## Description
Create comprehensive dashboard APIs that aggregate user data, analytics, and provide insights for different user types.

## Acceptance Criteria
- [ ] Implement dashboard data aggregation for Creators:
  - Revenue analytics
  - Event performance metrics
  - Audience insights
  - Content engagement stats
- [ ] Create Brand dashboard data:
  - Campaign performance
  - ROI metrics
  - Creator collaboration stats
- [ ] Add Fan dashboard features:
  - Event history
  - Favorite creators
  - Spending analytics
- [ ] Implement real-time data updates
- [ ] Add data caching for performance
- [ ] Create customizable dashboard widgets

## Technical Requirements
- Use efficient database queries with proper indexing
- Implement Redis caching for frequently accessed data
- Add proper data aggregation and calculation logic
- Include date range filtering and comparisons

## Definition of Done
- Dashboard loads quickly with relevant data
- Data is accurate and up-to-date
- Different user types see appropriate information
- Caching improves performance significantly
- Dashboard is responsive and interactive`,
    labels: ["backend", "frontend", "analytics", "dashboard", "high-priority", "phase-2"]
  },
  {
    title: "Advanced Search & Discovery System",
    body: `## Description
Implement comprehensive search and discovery system for events with full-text search, filtering, and recommendation algorithms.

## Acceptance Criteria
- [ ] Implement full-text search for events
- [ ] Add advanced filtering options:
  - Date range
  - Location/geographic
  - Category and tags
  - Price range
  - Creator/organizer
- [ ] Create search result ranking algorithm
- [ ] Add search suggestions and autocomplete
- [ ] Implement saved searches and alerts
- [ ] Create recommendation engine for events
- [ ] Add trending and popular events
- [ ] Implement search analytics

## Technical Requirements
- Use PostgreSQL full-text search or Elasticsearch
- Implement efficient indexing for search performance
- Add proper query optimization
- Include search result caching

## Definition of Done
- Search returns relevant results quickly
- Filtering works accurately
- Recommendations improve user engagement
- Search performance meets requirements
- Analytics provide insights into search behavior`,
    labels: ["backend", "frontend", "search", "events", "medium-priority", "phase-2"]
  },
  {
    title: "Notification System Backend",
    body: `## Description
Create comprehensive notification system backend with support for email, in-app, and push notifications.

## Acceptance Criteria
- [ ] Design notification data model and storage
- [ ] Implement notification creation and management
- [ ] Add notification preferences per user
- [ ] Create notification templates and formatting
- [ ] Implement notification delivery scheduling
- [ ] Add notification history and read status
- [ ] Create notification batching and digest
- [ ] Add notification analytics and tracking

## Technical Requirements
- Support multiple notification types and channels
- Implement proper queuing for notification delivery
- Add notification deduplication logic
- Include notification preference inheritance

## Definition of Done
- Notifications are created and stored correctly
- User preferences control notification delivery
- Notification history is maintained
- System handles high notification volume
- Analytics provide delivery insights`,
    labels: ["backend", "notifications", "user-management", "medium-priority", "phase-2"]
  },
  {
    title: "Frontend Dashboard Integration",
    body: `## Description
Integrate frontend dashboard components with backend APIs to display user analytics, metrics, and management tools.

## Acceptance Criteria
- [ ] Connect dashboard components to backend APIs
- [ ] Implement real-time data updates
- [ ] Add loading states and error handling
- [ ] Create responsive dashboard layouts
- [ ] Add data visualization components (charts, graphs)
- [ ] Implement dashboard customization
- [ ] Add export functionality for data
- [ ] Create mobile-optimized dashboard views

## Technical Requirements
- Use existing React components and state management
- Implement proper error boundaries
- Add data caching and optimization
- Include accessibility features

## Definition of Done
- Dashboard displays accurate real-time data
- All user types have appropriate dashboard views
- Data visualizations are clear and helpful
- Dashboard works well on all devices
- Performance is optimized for large datasets`,
    labels: ["frontend", "dashboard", "analytics", "high-priority", "phase-2"]
  }
];

// Function to create a GitHub issue
function createGitHubIssue(token, owner, repo, issue) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels
    });

    const options = {
      hostname: GITHUB_API_BASE,
      port: 443,
      path: `/repos/${owner}/${repo}/issues`,
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Passa-Issue-Creator',
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 201) {
          const issueData = JSON.parse(responseData);
          console.log(`✅ Created issue: ${issue.title} (#${issueData.number})`);
          resolve(issueData);
        } else {
          console.error(`❌ Failed to create issue: ${issue.title}`);
          console.error(`Status: ${res.statusCode}`);
          console.error(`Response: ${responseData}`);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error creating issue: ${issue.title}`);
      console.error(error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 3) {
    console.error('Usage: node create-github-issues.js <github-token> <repo-owner> <repo-name>');
    console.error('Example: node create-github-issues.js ghp_xxxx hezronokwach Passa');
    process.exit(1);
  }

  const [token, owner, repo] = args;
  
  console.log(`🚀 Creating GitHub issues for ${owner}/${repo}`);
  console.log(`📋 Phase 1: ${phase1Issues.length} issues`);
  console.log(`📋 Phase 2: ${phase2Issues.length} issues`);
  console.log('');

  try {
    // Create Phase 1 issues
    console.log('🔄 Creating Phase 1 issues...');
    for (const issue of phase1Issues) {
      await createGitHubIssue(token, owner, repo, issue);
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('');
    console.log('🔄 Creating Phase 2 issues...');
    // Create Phase 2 issues
    for (const issue of phase2Issues) {
      await createGitHubIssue(token, owner, repo, issue);
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('');
    console.log('🎉 All issues created successfully!');
    console.log(`📊 Total issues created: ${phase1Issues.length + phase2Issues.length}`);
    
  } catch (error) {
    console.error('❌ Error creating issues:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}
