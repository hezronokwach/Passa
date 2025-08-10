import { describe, it, expect } from '@jest/globals';

describe('Application Startup', () => {
  it('should import the main application without errors', async () => {
    // This test verifies that the application can be imported without syntax errors
    // or missing dependencies
    expect(async () => {
      await import('@/index');
    }).not.toThrow();
  });
});