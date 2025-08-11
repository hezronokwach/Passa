# Passa Backend Development Guide

## Overview

The Passa backend is built with Node.js, TypeScript, Express, and PostgreSQL, providing a robust API for the creator economy platform.

## Quick Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Setup

```bash
# Copy environment template
cp ../.env.example ../.env

# Edit with your database credentials
DATABASE_NAME=passa_dev
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
```

### Database Setup

```bash
# Create databases
createdb passa_dev
createdb passa_dev_test

# Run migrations and seeds
npm run db:migrate
npm run db:seed
```

## Development Commands

### Database Management

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Run latest migrations |
| `npm run db:rollback` | Rollback last migration |
| `npm run db:reset` | Reset database (rollback all + migrate + seed) |
| `npm run db:status` | Check migration status |
| `npm run db:seed` | Run all seed files |
| `npm run db:setup` | Setup database from scratch |
| `npm run db:validate` | Validate database schema |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm test -- User.test.ts` | Test specific file |

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check linting errors |
| `npm run lint:fix` | Fix linting errors |
| `npm run format` | Format code with Prettier |

## User Model System

### Core Features

- **CRUD Operations**: Complete user lifecycle management
- **Authentication**: Secure password hashing with bcrypt
- **Email Verification**: Token-based email verification
- **Role Management**: Multi-role assignment system
- **Activity Logging**: Comprehensive audit trail
- **Search & Filtering**: Advanced user discovery

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `admin` | System administrator | Full system access |
| `organizer` | Event organizer | Event and ticket management |
| `artist` | Performing artist | Event participation |
| `content_creator` | Content creator | Content attribution |
| `sponsor` | Event sponsor | Sponsorship management |
| `fan` | Platform user | Ticket purchasing |

### API Usage Examples

#### User Management

```typescript
import { UserModel } from '@/models/User';

// Create user
const user = await UserModel.create({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'securepassword123',
  first_name: 'John',
  last_name: 'Doe'
});

// Find user
const user = await UserModel.findByEmail('john@example.com');
const userById = await UserModel.findById(123);

// Update user
const updated = await UserModel.update(userId, {
  first_name: 'Johnny'
});

// Search users
const results = await UserModel.search({
  username: 'john',
  page: 1,
  limit: 10
});
```

#### Role Management

```typescript
import { UserRoleModel } from '@/models/UserRole';

// Assign role
await UserRoleModel.assignRole(userId, 'creator');

// Check role
const hasRole = await UserRoleModel.hasRole(userId, 'creator');

// Get user roles
const roles = await UserRoleModel.getUserRoles(userId);

// Get users by role
const creators = await UserRoleModel.getUsersByRole('creator');
```

#### Activity Logging

```typescript
import { UserActivityModel } from '@/models/UserActivity';

// Log activity
await UserActivityModel.logActivity(userId, 'login', {
  ip_address: '127.0.0.1',
  user_agent: 'Mozilla/5.0...',
  metadata: { source: 'web' }
});

// Get activity history
const activities = await UserActivityModel.getActivityHistory(userId, {
  limit: 50,
  action: 'login'
});
```

## Testing

### Test Structure

```
src/tests/
├── models/
│   └── User.test.ts        # User model tests (20 test cases)
└── setup.ts                # Test configuration
```

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- User.test.ts

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Database

Tests use a separate `passa_dev_test` database that's automatically created and managed.

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**: Comprehensive data sanitization
- **SQL Injection Prevention**: Parameterized queries
- **Email Verification**: Secure token-based verification
- **Password Reset**: Time-limited reset tokens
- **Audit Logging**: Complete activity tracking
- **Soft Deletion**: Data integrity preservation

## Error Handling

The system uses custom error classes for better error management:

```typescript
import { UserValidationError } from '@/utils/userValidation';

try {
  await UserModel.create(userData);
} catch (error) {
  if (error instanceof UserValidationError) {
    // Handle validation error
    console.log(`Validation error in ${error.field}: ${error.message}`);
  }
}
```

## Database Schema

### Users Table
- Primary key: `user_id`
- Unique constraints: `email`, `username`
- Soft deletion: `is_deleted`, `deleted_at`
- Timestamps: `created_at`, `updated_at`

### User Roles System
- `user_roles`: Role definitions with permissions
- `user_role_assignments`: User-role mappings
- JSON permissions with resource.action format

### Audit Logs
- Complete activity tracking
- Resource-based categorization
- IP and user agent logging
- Metadata support

## Performance Considerations

- **Database Indexing**: Optimized indexes on frequently queried fields
- **Connection Pooling**: Configured for optimal performance
- **Pagination**: Built-in pagination for large datasets
- **Soft Deletion**: Maintains data integrity without performance impact

## Troubleshooting

### Common Issues

1. **Database Connection**: Check PostgreSQL service and credentials
2. **Migration Errors**: Ensure database exists and user has permissions
3. **Test Failures**: Verify test database is created and accessible
4. **Port Conflicts**: Default port 3001, change in .env if needed

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev
```

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Use ESLint and Prettier for code formatting
4. Update documentation for API changes
5. Follow the existing error handling patterns