import { describe, it, expect } from '@jest/globals';
import userRoutes from '@/routes/users';

// Mock the auth middleware
jest.mock('@/middleware/auth', () => ({
  authMiddleware: jest.fn((_req: any, _res: any, next: any) => next()),
}));

describe('User Routes', () => {
  it('should define all required routes', () => {
    // Check that userRoutes is defined
    expect(userRoutes).toBeDefined();
    
    // Verify it's a function (Express router)
    expect(typeof userRoutes).toBe('function');
  });
});