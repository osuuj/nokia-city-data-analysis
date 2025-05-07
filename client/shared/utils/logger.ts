/**
 * Logger utility for consistent logging across the application
 * Logs only appear in development environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private debugEnabled = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

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
    console.error(`❌ ${message}`, ...args);
  }
}

export const logger = new Logger();
