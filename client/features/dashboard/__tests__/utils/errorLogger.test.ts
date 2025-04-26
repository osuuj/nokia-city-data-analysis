import { logError, logWarning, withErrorLogging } from '../../utils/errorLogger';

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

describe('errorLogger', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock console methods
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  describe('logError', () => {
    it('logs error with context information', () => {
      const error = new Error('Test error');
      const errorInfo = { componentStack: 'TestComponent' };
      const componentName = 'TestComponent';
      const additionalInfo = { key: 'value' };

      logError(error, errorInfo, componentName, additionalInfo);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Test error'),
        expect.objectContaining({
          error,
          errorInfo,
          context: expect.objectContaining({
            componentName,
            additionalInfo,
          }),
        }),
      );
    });

    it('handles errors with minimal information', () => {
      const error = new Error('Test error');
      const errorInfo = { componentStack: '' };

      logError(error, errorInfo);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Test error'),
        expect.objectContaining({
          error,
          errorInfo,
          context: expect.any(Object),
        }),
      );
    });
  });

  describe('logWarning', () => {
    it('logs warning with context information', () => {
      const message = 'Test warning';
      const componentName = 'TestComponent';
      const additionalInfo = { key: 'value' };

      logWarning(message, componentName, additionalInfo);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Test warning'),
        expect.objectContaining({
          context: expect.objectContaining({
            componentName,
            additionalInfo,
          }),
        }),
      );
    });

    it('handles warnings with minimal information', () => {
      const message = 'Test warning';

      logWarning(message);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Test warning'),
        expect.objectContaining({
          context: expect.any(Object),
        }),
      );
    });
  });

  describe('withErrorLogging', () => {
    it('wraps async function and logs errors', async () => {
      const error = new Error('Test error');
      const asyncFunction = jest.fn().mockRejectedValue(error);
      const componentName = 'TestComponent';

      const wrappedFunction = withErrorLogging(asyncFunction, componentName);

      await expect(wrappedFunction()).rejects.toThrow('Test error');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Test error'),
        expect.objectContaining({
          error,
          errorInfo: expect.objectContaining({ componentStack: '' }),
          context: expect.objectContaining({ componentName }),
        }),
      );
    });

    it('wraps async function and returns result on success', async () => {
      const result = { data: 'test' };
      const asyncFunction = jest.fn().mockResolvedValue(result);
      const componentName = 'TestComponent';

      const wrappedFunction = withErrorLogging(asyncFunction, componentName);

      const actualResult = await wrappedFunction();
      expect(actualResult).toEqual(result);
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
