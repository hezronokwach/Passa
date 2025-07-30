// Test setup file

// Set test environment
process.env['NODE_ENV'] = 'test';
process.env['DB_NAME'] = 'passa_test';

// Increase timeout for database operations
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // Any global setup can go here
});

afterAll(async () => {
  // Any global cleanup can go here
});
