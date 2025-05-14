/**
 * Logger utility for consistent logging across the application
 * Logs only appear in development environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Common development errors to filter out from console
const DEVELOPMENT_ERROR_FILTERS = [
  'Failed to fetch RSC payload',
  'NetworkError when attempting to fetch resource',
  'react_devtools_backend.js', // React DevTools errors
  '[Fast Refresh]', // Next.js Fast Refresh messages
];

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private debugEnabled = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

  /**
   * Check if an error message should be filtered out in development
   */
  public shouldFilterError(message: string): boolean {
    if (this.isProduction) return false;

    return DEVELOPMENT_ERROR_FILTERS.some(
      (filter) => typeof message === 'string' && message.includes(filter),
    );
  }

  /**
   * Log a debug message - only in development or when debug mode is enabled
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.isProduction && !this.debugEnabled) return;
    console.debug(`🔍 ${message}`, ...args);
  }

  /**
   * Log an info message - only in development or when debug mode is enabled
   */
  info(message: string, ...args: unknown[]): void {
    if (this.isProduction && !this.debugEnabled) return;
    console.info(`ℹ️ ${message}`, ...args);
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(`⚠️ ${message}`, ...args);
  }

  /**
   * Log an error message
   */
  error(message: string, ...args: unknown[]): void {
    // Filter out common development-only errors
    if (this.shouldFilterError(message)) return;

    console.error(`❌ ${message}`, ...args);
  }
}

// Override the native console.error to filter development-specific errors
if (process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0];
    const logger = new Logger();

    if (typeof message === 'string' && logger.shouldFilterError(message)) {
      return; // Skip logging this error
    }

    originalConsoleError.apply(console, args);
  };
}

export const logger = new Logger();
