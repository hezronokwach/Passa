# User Model Documentation

## Overview

The User model is a comprehensive, production-ready implementation that provides user management functionality for the Passa event platform. It includes authentication support, role-based access control, profile management, and activity tracking.

## Architecture

The User model is split into multiple focused modules for better maintainability:

### Core Models

1. **UserModel** (`src/models/User.ts`) - Core user CRUD operations
2. **UserProfileModel** (`src/models/UserProfile.ts`) - User profile management
3. **UserRoleModel** (`src/models/UserRole.ts`) - Role-based access control
4. **UserActivityModel** (`src/models/UserActivity.ts`) - Activity tracking and audit logs

### Utilities

1. **UserValidation** (`src/utils/userValidation.ts`) - Input validation and sanitization
2. **PasswordUtils** (`src/utils/passwordUtils.ts`) - Password hashing and token generation

### Types

1. **User Types** (`src/types/user.ts`) - TypeScript interfaces and types

## Features

### ✅ Core CRUD Operations
- Create users with validation
- Find users by ID, email, or username
- Update user information
- Soft delete users
- Search and filter users with pagination

### ✅ Password Management
- Secure password hashing using bcryptjs
- Password strength validation
- Password reset functionality with tokens
- Password verification

### ✅ Email Verification
- Email verification tokens
- Email verification workflow
- Status management based on verification

### ✅ User Status Management
- Multiple status types: active, inactive, suspended, pending_verification
- Status validation
- Status update tracking

### ✅ Role-Based Access Control
- Assign/remove roles (Creator, Brand, Fan)
- Check user roles
- Get users by role
- Role assignment history

### ✅ Profile Management
- Create and update user profiles
- Preferences and notification settings
- Social media handles
- Public/private profile settings

### ✅ Activity Tracking
- Comprehensive audit logging
- Activity history
- Activity statistics
- Admin functions for monitoring

### ✅ Input Validation & Security
- Email format validation
- Username format validation
- Password strength requirements
- Input sanitization
- SQL injection prevention
- Proper error handling

## Usage Examples

### Basic User Operations

```typescript
import { UserModel } from '@/models';

// Create a new user
const user = await UserModel.create({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'securePassword123',
  first_name: 'John',
  last_name: 'Doe',
});

// Find user by email
const foundUser = await UserModel.findByEmail('john@example.com');

// Update user
const updatedUser = await UserModel.update(user.user_id, {
  first_name: 'Jonathan',
});

// Search users
const searchResults = await UserModel.search({
  username: 'john',
  page: 1,
  limit: 10,
});
```

### Profile Management

```typescript
import { UserProfileModel } from '@/models';

// Create user profile
const profile = await UserProfileModel.create(user.user_id, {
  bio: 'Software developer and music enthusiast',
  location: 'San Francisco, CA',
  preferences: {
    theme: 'dark',
    email_notifications: true,
  },
});

// Update profile
const updatedProfile = await UserProfileModel.update(user.user_id, {
  bio: 'Updated bio',
  avatar_url: 'https://example.com/avatar.jpg',
});
```

### Role Management

```typescript
import { UserRoleModel } from '@/models';

// Assign role
await UserRoleModel.assignRole(user.user_id, 'creator');

// Get user roles
const roles = await UserRoleModel.getUserRoles(user.user_id);

// Check if user has role
const hasRole = await UserRoleModel.hasRole(user.user_id, 'creator');

// Get users by role
const creators = await UserRoleModel.getUsersByRole('creator');
```

### Activity Tracking

```typescript
import { UserActivityModel } from '@/models';

// Log activity
await UserActivityModel.logActivity(user.user_id, 'profile_updated', {
  resource_type: 'user_profile',
  new_values: { bio: 'New bio' },
  ip_address: '192.168.1.1',
});

// Get activity history
const activities = await UserActivityModel.getActivityHistory(user.user_id, {
  limit: 20,
  action: 'profile_updated',
});
```

### Password Management

```typescript
import { UserModel, PasswordUtils } from '@/models';

// Verify password
const isValid = await UserModel.verifyPassword('password123', user.password_hash);

// Set password reset token
const resetToken = await UserModel.setPasswordResetToken('john@example.com');

// Reset password
const updatedUser = await UserModel.resetPassword(resetToken, 'newPassword123');
```

## Validation Rules

### Email
- Must be valid email format
- Maximum 255 characters
- Must be unique

### Username
- 3-50 characters
- Only letters, numbers, underscores, and hyphens
- Must be unique

### Password
- Minimum 8 characters
- Maximum 128 characters
- Must contain at least one letter and one number

### Names
- 1-100 characters
- Only letters, spaces, hyphens, apostrophes, and periods

### Phone
- 10-20 characters
- Valid phone number format

## Error Handling

The models use custom error types for better error handling:

```typescript
import { UserValidationError } from '@/models';

try {
  await UserModel.create(userData);
} catch (error) {
  if (error instanceof UserValidationError) {
    console.log(`Validation error in field ${error.field}: ${error.message}`);
  } else {
    console.log('Other error:', error.message);
  }
}
```

## Testing

Comprehensive test suite is available in `src/tests/models/User.test.ts` with 20 test cases covering all functionality:

### Test Coverage
- ✅ CRUD Operations (9 tests)
- ✅ Password Management (2 tests)
- ✅ Email Verification (2 tests)
- ✅ Status Management (2 tests)
- ✅ Search and Filtering (2 tests)
- ✅ User Existence Check (1 test)
- ✅ Integration with Other Models (2 tests)

### Test Setup
The test environment is configured with:
- **Jest Configuration**: `jest.config.js` with TypeScript path mapping support
  - Fixed `moduleNameMapper` for proper `@/` path resolution
  - TypeScript compilation with `ts-jest`
  - Test environment set to `node`
- **Test Setup**: `src/tests/setup.ts` for environment configuration
  - Test environment variables
  - Test database configuration
  - Global test timeouts
- **Test Database**: Separate test database (`passa_test`)
- **Timeout**: 30 seconds for database operations

### Running Tests

```bash
# Run all tests
npm test

# Run specific User model tests
npm test -- --testPathPattern=User.test.ts

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Results
All 20 tests pass successfully, validating:
- User creation with proper validation
- Email and username uniqueness
- Password hashing and verification
- Email verification workflow
- Status management
- Search and pagination
- Integration with UserRole and UserActivity models

### Troubleshooting Tests

If tests fail with module resolution errors:

1. **Check Jest Configuration**: Ensure `moduleNameMapper` is correctly set in `jest.config.js`
2. **Verify TypeScript Paths**: Check `tsconfig.json` path mappings match Jest configuration
3. **Database Connection**: Ensure test database is running and accessible
4. **Environment Variables**: Verify test environment variables are set correctly

Common fixes:
```bash
# Reset test database
npm run db:reset:test

# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
npm ci
```

## Database Schema

The User model works with the following database tables:

- `users` - Core user data
- `user_profiles` - Extended user profile information
- `user_roles` - Available roles
- `user_role_assignments` - User-role relationships
- `audit_logs` - Activity tracking

## Security Considerations

1. **Password Security**: Uses bcryptjs with 12 salt rounds
2. **Input Validation**: All inputs are validated and sanitized
3. **SQL Injection Prevention**: Uses parameterized queries
4. **Token Security**: Secure random token generation
5. **Soft Deletes**: Users are soft-deleted to maintain data integrity
6. **Activity Logging**: All user actions are logged for audit purposes

## Performance Considerations

1. **Pagination**: Search results are paginated to prevent large data loads
2. **Indexing**: Database indexes on frequently queried fields
3. **Lazy Loading**: Profile and role data loaded only when needed
4. **Connection Pooling**: Database connection pooling for better performance

## Future Enhancements

1. **Two-Factor Authentication**: Add 2FA support
2. **OAuth Integration**: Social login support
3. **Advanced Role Permissions**: Granular permission system
4. **User Groups**: Group-based access control
5. **Advanced Analytics**: More detailed user analytics

## Contributing

When contributing to the User model:

1. Follow the existing code structure
2. Add comprehensive tests for new features
3. Update documentation
4. Ensure TypeScript strict mode compliance
5. Follow security best practices
