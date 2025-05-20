/**
 * Logger utility for consistent logging across the application
 * Debug and info logs only appear in development environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Common development messages and errors to filter out from console
const DEVELOPMENT_FILTERS = [
  // API and network related
  'Failed to fetch RSC payload',
  'NetworkError when attempting to fetch resource',

  // React and tooling related
  'react_devtools_backend.js', // React DevTools errors
  '[Fast Refresh]', // Next.js Fast Refresh messages
  'Fast Refresh', // Alternative Fast Refresh messages
  'rebuilding', // Webpack/Turbopack rebuilding messages
  'report-hmr-latency', // HMR latency reporting

  // Mapbox specific warnings (common and not actionable)
  'featureNamespace', // Mapbox feature namespace warnings
  'Failed to evaluate expression',
];

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private debugEnabled = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

  /**
   * Check if a message should be filtered out
   */
  public shouldFilter(message: string): boolean {
    if (this.isProduction) return false;

    if (typeof message !== 'string') return false;

    return DEVELOPMENT_FILTERS.some((filter) => message.includes(filter));
  }

  /**
   * Log a debug message - only in development or when debug mode is enabled
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.isProduction && !this.debugEnabled) return;
    if (this.shouldFilter(message)) return;

    console.debug(`🔍 ${message}`, ...args);
  }

  /**
   * Log an info message - only in development or when debug mode is enabled
   */
  info(message: string, ...args: unknown[]): void {
    if (this.isProduction && !this.debugEnabled) return;
    if (this.shouldFilter(message)) return;

    console.info(`ℹ️ ${message}`, ...args);
  }

  /**
   * Log a warning message - filtered in development, all shown in production
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.isProduction && this.shouldFilter(message)) return;

    console.warn(`⚠️ ${message}`, ...args);
  }

  /**
   * Log an error message - filtered in development, all shown in production
   */
  error(message: string, ...args: unknown[]): void {
    // Filter out common development-only errors
    if (!this.isProduction && this.shouldFilter(message)) return;

    console.error(`❌ ${message}`, ...args);
  }
}

// Override the native console methods to filter development-specific noise
if (process.env.NODE_ENV === 'development') {
  const logger = new Logger();

  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;
  const originalConsoleDebug = console.debug;
  const originalConsoleLog = console.log;

  // Override console.error
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && logger.shouldFilter(message)) {
      return; // Skip logging this error
    }
    originalConsoleError.apply(console, args);
  };

  // Override console.warn - less aggressive filtering
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && logger.shouldFilter(message)) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  // Optionally filter info and debug as well for a cleaner console
  console.info = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && logger.shouldFilter(message)) {
      return;
    }
    originalConsoleInfo.apply(console, args);
  };

  // Filter console.log for Fast Refresh messages only
  console.log = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('Fast Refresh') ||
        message.includes('rebuilding') ||
        message.includes('hmr'))
    ) {
      return;
    }
    originalConsoleLog.apply(console, args);
  };
}

export const logger = new Logger();
