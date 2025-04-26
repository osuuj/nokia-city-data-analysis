import { DashboardError } from '../../types';
import {
  calculateRetryDelay,
  convertToDashboardError,
  defaultRetryConfig,
  logError,
  shouldRetry,
} from '../../utils/errorHandling';

// Mock console.error
const originalConsoleError = console.error;
console.error = jest.fn();

describe('errorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  describe('calculateRetryDelay', () => {
    it('calculates exponential backoff delay', () => {
      // First attempt
      expect(calculateRetryDelay(1)).toBeGreaterThanOrEqual(1000);
      expect(calculateRetryDelay(1)).toBeLessThanOrEqual(1100);

      // Second attempt
      expect(calculateRetryDelay(2)).toBeGreaterThanOrEqual(2000);
      expect(calculateRetryDelay(2)).toBeLessThanOrEqual(2200);

      // Third attempt
      expect(calculateRetryDelay(3)).toBeGreaterThanOrEqual(4000);
      expect(calculateRetryDelay(3)).toBeLessThanOrEqual(4400);

      // Fourth attempt
      expect(calculateRetryDelay(4)).toBeGreaterThanOrEqual(8000);
      expect(calculateRetryDelay(4)).toBeLessThanOrEqual(8800);

      // Fifth attempt (should be capped at maxDelay)
      expect(calculateRetryDelay(5)).toBeLessThanOrEqual(10000);
    });

    it('respects custom config', () => {
      const customConfig = {
        ...defaultRetryConfig,
        baseDelay: 500,
        maxDelay: 2000,
      };

      expect(calculateRetryDelay(1, customConfig)).toBeGreaterThanOrEqual(500);
      expect(calculateRetryDelay(1, customConfig)).toBeLessThanOrEqual(550);

      expect(calculateRetryDelay(5, customConfig)).toBeLessThanOrEqual(2000);
    });
  });

  describe('shouldRetry', () => {
    it('returns true for retryable status codes', () => {
      const error = { status: 500, message: 'Server error' };
      expect(shouldRetry(error, 1)).toBe(true);

      const error2 = { status: 503, message: 'Service unavailable' };
      expect(shouldRetry(error2, 1)).toBe(true);
    });

    it('returns true for network errors', () => {
      const error = { status: 0, message: 'Network error' };
      expect(shouldRetry(error, 1)).toBe(true);

      const error2 = { status: 0, message: 'Request timeout' };
      expect(shouldRetry(error2, 1)).toBe(true);
    });

    it('returns false for non-retryable status codes', () => {
      const error = { status: 400, message: 'Bad request' };
      expect(shouldRetry(error, 1)).toBe(false);

      const error2 = { status: 404, message: 'Not found' };
      expect(shouldRetry(error2, 1)).toBe(false);
    });

    it('returns false when max attempts is reached', () => {
      const error = { status: 500, message: 'Server error' };
      expect(shouldRetry(error, 3)).toBe(false);
    });
  });

  describe('convertToDashboardError', () => {
    it('converts API error with status to DashboardError', () => {
      const apiError = {
        status: 500,
        message: 'Internal Server Error',
      };

      const dashboardError = convertToDashboardError(apiError);

      expect(dashboardError).toEqual({
        code: 'SERVER_ERROR',
        message: 'Internal Server Error',
      });
    });

    it('converts API error without status to DashboardError', () => {
      const apiError = {
        status: 400,
        message: 'Validation Error',
      };

      const dashboardError = convertToDashboardError(apiError);

      expect(dashboardError).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Validation Error',
      });
    });

    it('converts Error object to DashboardError', () => {
      const error = new Error('Unknown error');

      const dashboardError = convertToDashboardError(error);

      expect(dashboardError).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Unknown error',
      });
    });
  });

  describe('logError', () => {
    it('logs error with context', () => {
      const error = new Error('Test error');
      const context = 'TestComponent';

      logError(error, context);

      expect(console.error).toHaveBeenCalledWith('Error in TestComponent:', error);
    });

    it('logs error without context', () => {
      const error = new Error('Test error');

      logError(error);

      expect(console.error).toHaveBeenCalledWith('Error:', error);
    });
  });
});
