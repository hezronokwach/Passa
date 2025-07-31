# Test Setup Guide for Passa Backend

This guide explains how to set up and run tests for someone who has just cloned the repository.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** or **yarn**

## Initial Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Make sure you have the correct environment variables set. The test environment uses these defaults:

- **Database Host**: `localhost`
- **Database Port**: `5432`
- **Database User**: `passa`
- **Database Password**: `password`
- **Test Database Name**: `passa_dev_test` (automatically appends `_test` to `passa_dev`)

### 3. Database Setup

#### Option A: Automatic Setup (Recommended)

The tests will automatically run migrations, but you need to create the test database first:

```bash
# Create the test database (requires PostgreSQL superuser access)
sudo -u postgres psql -c "CREATE DATABASE passa_dev_test OWNER passa;"

# Or if you have postgres user password:
PGPASSWORD=your_postgres_password psql -h localhost -U postgres -c "CREATE DATABASE passa_dev_test OWNER passa;"
```

#### Option B: Manual Setup

1. **Create the test database:**
   ```sql
   CREATE DATABASE passa_dev_test OWNER passa;
   ```

2. **Run migrations for test database:**
   ```bash
   NODE_ENV=test npm run db:migrate
   ```

### 4. Running Tests

#### Run All Tests
```bash
npm test
```

#### Run Specific Test Files
```bash
# Run only User model tests
npm test -- --testPathPattern=User.test.ts

# Run only UserProfile model tests
npm test -- --testPathPattern=UserProfile.test.ts
```

#### Run Tests in Watch Mode
```bash
npm run test:watch
```

### 5. Code Quality Testing

#### Lint Testing
ESLint checks for code style, potential bugs, and best practices:

```bash
# Run lint check
npm run lint

# Run lint with auto-fix for fixable issues
npm run lint -- --fix

# Check specific files
npm run lint -- src/models/User.ts

# Check specific directories
npm run lint -- src/models/
```

**What lint checks for:**
- Code style consistency
- Potential runtime errors
- Best practice violations
- Unused variables/imports
- Type safety issues
- Security vulnerabilities

#### TypeScript Error Testing
TypeScript compiler checks for type safety and compilation errors:

```bash
# Check for TypeScript errors (no compilation)
npx tsc --noEmit

# Check specific files
npx tsc --noEmit src/models/User.ts

# Watch mode for continuous checking
npx tsc --noEmit --watch
```

**What TypeScript checks for:**
- Type mismatches
- Missing properties
- Incorrect function signatures
- Import/export errors
- Interface compliance
- Generic type issues

#### Combined Quality Check
Run all quality checks together:

```bash
# Full quality check pipeline
npm run lint && npx tsc --noEmit && npm test
```

#### Pre-commit Quality Checks
Before committing code, always run:

```bash
# 1. Lint check with auto-fix
npm run lint -- --fix

# 2. TypeScript compilation check
npx tsc --noEmit

# 3. Run tests
npm test

# 4. If all pass, your code is ready for commit
```

## Test Structure

The test suite includes:

- **User Model Tests** (`src/tests/models/User.test.ts`)
  - CRUD operations
  - Validation
  - Password management
  - Email verification
  - Search and filtering
  - Role integration

- **UserProfile Model Tests** (`src/tests/models/UserProfile.test.ts`)
  - CRUD operations
  - Validation
  - Profile completion tracking
  - Privacy controls
  - Search and filtering
  - Relationship with User model

## Common Issues and Solutions

### Code Quality Issues

#### Issue: Lint Errors
```
error: 'variable' is declared but its value is never read
warning: Unexpected console statement
error: Unexpected any. Specify a different type
```

**Solutions**:
```bash
# Auto-fix many lint issues
npm run lint -- --fix

# For unused variables: Remove them or prefix with underscore
const _unusedVar = value; // or just remove the line

# For console statements: Use proper logger
import { logger } from '@/utils/logger';
logger.info('message'); // instead of console.log

# For 'any' types: Use specific types
const data: Record<string, unknown> = {}; // instead of any
const user: User = {}; // use proper interfaces
```

#### Issue: TypeScript Compilation Errors
```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'
error TS2339: Property 'nonExistent' does not exist on type 'User'
error TS2322: Type 'undefined' is not assignable to type 'string'
```

**Solutions**:
```bash
# Check the exact error location
npx tsc --noEmit

# Common fixes:
# 1. Type mismatches - ensure correct types
const id: number = parseInt(stringId);

# 2. Missing properties - check interface definitions
interface User {
  id: number;
  name: string;
  email?: string; // optional property
}

# 3. Undefined handling - use optional chaining or type guards
const email = user.email || 'default@example.com';
const name = user?.profile?.name; // optional chaining
```

#### Issue: Import/Export Errors
```
error TS2307: Cannot find module '@/types/user'
error TS2305: Module has no exported member 'UserProfile'
```

**Solutions**:
```bash
# Check file paths and exports
# 1. Verify the file exists
ls src/types/user.ts

# 2. Check the export in the source file
export interface UserProfile { ... }

# 3. Verify tsconfig.json path mapping
"paths": {
  "@/*": ["./src/*"]
}
```

### Database Issues

#### Issue 1: Database Connection Errors
```
error: database "passa_dev_test" does not exist
```

**Solution**: Create the test database as shown in step 3 above.

### Issue 2: Permission Errors
```
ERROR: permission denied to create database
```

**Solution**: Use a PostgreSQL superuser account or ask your DBA to create the test database.

### Issue 3: Test Isolation Issues
```
duplicate key value violates unique constraint
```

**Solution**: Tests automatically clean up between runs. If you see this error, it usually resolves on the next test run.

### Issue 4: Migration Errors
```
Migration failed
```

**Solution**: Ensure the test database exists and run migrations manually:
```bash
NODE_ENV=test npm run db:migrate
```

## Test Database Management

### Reset Test Database
```bash
# Drop and recreate test database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS passa_dev_test;"
sudo -u postgres psql -c "CREATE DATABASE passa_dev_test OWNER passa;"
NODE_ENV=test npm run db:migrate
```

### Check Migration Status
```bash
NODE_ENV=test npm run db:status
```

## Development Workflow

### Recommended Development Process

1. **Before making changes**: Run full quality check
   ```bash
   # Check code quality
   npm run lint
   npx tsc --noEmit

   # Run tests to ensure everything works
   npm test
   ```

2. **During development**: Use watch modes for continuous feedback
   ```bash
   # Terminal 1: TypeScript watch mode
   npx tsc --noEmit --watch

   # Terminal 2: Test watch mode
   npm run test:watch

   # Terminal 3: Your development work
   ```

3. **After making changes**: Run comprehensive checks
   ```bash
   # Auto-fix lint issues
   npm run lint -- --fix

   # Check for TypeScript errors
   npx tsc --noEmit

   # Run tests to verify functionality
   npm test

   # For specific model changes
   npm test -- --testPathPattern=YourModel.test.ts
   ```

4. **Before committing**: Final quality gate
   ```bash
   # Complete pre-commit checklist
   npm run lint -- --fix && npx tsc --noEmit && npm test
   ```

### Quality Gates

**Level 1: Basic Quality** (minimum requirement)
```bash
npm run lint && npx tsc --noEmit
```

**Level 2: Full Quality** (recommended)
```bash
npm run lint -- --fix && npx tsc --noEmit && npm test
```

**Level 3: Production Ready** (for releases)
```bash
npm run lint -- --fix && npx tsc --noEmit && npm test && npm run test:coverage
```

## Test Configuration

Tests are configured in:
- `jest.config.js` - Jest configuration
- `src/tests/setup.ts` - Global test setup
- Individual test files in `src/tests/models/`

## Continuous Integration

### CI Pipeline Requirements

The complete CI pipeline should include code quality checks and tests. Make sure your CI has:

1. **Environment Setup**:
   - Node.js (v18+)
   - PostgreSQL service running
   - Test database created
   - Environment variables set correctly
   - Dependencies installed

2. **Code Quality Pipeline**:
   ```yaml
   # Example GitHub Actions workflow
   - name: Install dependencies
     run: npm ci

   - name: Lint check
     run: npm run lint

   - name: TypeScript check
     run: npx tsc --noEmit

   - name: Run tests
     run: npm test

   - name: Test coverage (optional)
     run: npm run test:coverage
   ```

3. **Quality Gates**:
   - All lint checks must pass (0 errors)
   - All TypeScript compilation must pass (0 errors)
   - All tests must pass (100% success rate)
   - Optional: Minimum test coverage threshold

### Local CI Simulation

Test your changes as CI would:

```bash
# Simulate CI environment
npm ci                    # Clean install (like CI)
npm run lint             # Lint check (must pass)
npx tsc --noEmit        # TypeScript check (must pass)
npm test                # Tests (must pass)
```

### Pre-commit Hooks (Recommended)

Set up automatic quality checks before commits:

```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint -- --fix && npx tsc --noEmit && npm test"
```

## Troubleshooting

If tests are failing:

1. **Check database connection**:
   ```bash
   PGPASSWORD=password psql -h localhost -U passa -d passa_dev_test -c "SELECT 1;"
   ```

2. **Verify migrations are up to date**:
   ```bash
   NODE_ENV=test npm run db:status
   ```

3. **Check for any hanging database connections**:
   ```bash
   # Kill any hanging connections to test database
   sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'passa_dev_test';"
   ```

4. **Run tests with verbose output**:
   ```bash
   npm test -- --verbose
   ```

For additional help, check the test output logs or contact the development team.

## Quick Reference

### Essential Commands

```bash
# Code Quality
npm run lint                    # Check for lint errors
npm run lint -- --fix         # Fix auto-fixable lint errors
npx tsc --noEmit              # Check TypeScript errors

# Testing
npm test                      # Run all tests
npm test -- --watch          # Run tests in watch mode
npm test -- --testPathPattern=User  # Run specific tests

# Combined Quality Check
npm run lint -- --fix && npx tsc --noEmit && npm test

# Database
NODE_ENV=test npm run db:migrate    # Run test migrations
NODE_ENV=test npm run db:status     # Check migration status
```

### File Locations

- **Test files**: `src/tests/models/*.test.ts`
- **Lint config**: `.eslintrc.js`
- **TypeScript config**: `tsconfig.json`
- **Jest config**: `jest.config.js`
- **Database config**: `knexfile.ts`

### Common Error Patterns

| Error Type | Command to Check | Common Fix |
|------------|------------------|------------|
| Lint errors | `npm run lint` | `npm run lint -- --fix` |
| TypeScript errors | `npx tsc --noEmit` | Fix type annotations |
| Test failures | `npm test` | Check test logic and data |
| Import errors | `npx tsc --noEmit` | Check file paths and exports |
| Database errors | `npm test` | Check database connection and migrations |

### Quality Standards

- ✅ **0 lint errors** (warnings acceptable in development)
- ✅ **0 TypeScript errors** (strict mode enabled)
- ✅ **All tests passing** (100% success rate)
- ✅ **No `any` types** (use proper TypeScript types)
- ✅ **No console statements** (use logger instead)
- ✅ **Proper error handling** (try/catch with typed errors)
