import type { ApiError } from '@/shared/api/types/ApiTypes';
import type { ErrorInfo } from 'react';
import type { DashboardError } from '../types/common';
import { errorRecovery } from './errorRecovery';
import { errorReporting } from './errorReporting';

/**
 * Log levels for error logging
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Error context information
 */
interface ErrorContext {
  componentName?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  additionalInfo?: Record<string, unknown>;
}

/**
 * Configuration for retry logic
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableStatuses: number[];
}

/**
 * Default retry configuration
 */
export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

/**
 * Calculate delay for next retry attempt using exponential backoff
 */
export const calculateRetryDelay = (
  attempt: number,
  config: RetryConfig = defaultRetryConfig,
): number => {
  const delay = Math.min(config.baseDelay * config.backoffFactor ** (attempt - 1), config.maxDelay);

  // Add jitter to prevent thundering herd problem
  const jitter = Math.random() * 0.1 * delay;
  return delay + jitter;
};

/**
 * Determine if an error should be retried based on configuration
 */
export const shouldRetry = (
  error: ApiError,
  attempt: number,
  config: RetryConfig = defaultRetryConfig,
): boolean => {
  // Don't retry if we've reached max attempts
  if (attempt >= config.maxAttempts) {
    return false;
  }

  // Retry network errors
  if (error.message.includes('network') || error.message.includes('timeout')) {
    return true;
  }

  // Retry specific HTTP status codes
  if (error.status && config.retryableStatuses.includes(error.status)) {
    return true;
  }

  return false;
};

/**
 * Convert API error to DashboardError
 */
export const convertToDashboardError = (error: unknown): DashboardError => {
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      status: 500,
    };
  }

  const apiError = error as ApiError;
  if (apiError?.status) {
    // Map HTTP status codes to error codes
    let errorCode = 'UNKNOWN_ERROR';

    if (apiError.status === 401) {
      errorCode = 'AUTH_ERROR';
    } else if (apiError.status === 403) {
      errorCode = 'AUTH_ERROR';
    } else if (apiError.status === 404) {
      errorCode = 'NOT_FOUND_ERROR';
    } else if (apiError.status >= 500) {
      errorCode = 'SERVER_ERROR';
    } else if (apiError.status === 422) {
      errorCode = 'VALIDATION_ERROR';
    } else if (apiError.status === 429) {
      errorCode = 'RATE_LIMIT_ERROR';
    }

    return {
      code: errorCode,
      message: apiError.message || `API error: ${apiError.status}`,
      status: apiError.status,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    status: 500,
  };
};

/**
 * Log an error with context information
 *
 * @param error - The error object
 * @param errorInfo - React error info
 * @param componentName - Name of the component where the error occurred
 * @param additionalInfo - Additional information to log
 */
export function logError(
  error: Error,
  errorInfo?: ErrorInfo,
  componentName?: string,
  additionalInfo?: Record<string, unknown>,
): void {
  const context: ErrorContext = {
    componentName,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    additionalInfo,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `[${context.timestamp}] Error in ${componentName || 'unknown component'}:`,
      error,
      errorInfo,
      additionalInfo,
    );
  }

  // Here you would typically send to an error reporting service
  // e.g., Sentry, LogRocket, etc.
}

/**
 * Log a warning message
 *
 * @param message - The warning message
 * @param componentName - Name of the component where the warning occurred
 * @param additionalInfo - Additional information to log
 */
export function logWarning(
  message: string,
  componentName?: string,
  additionalInfo?: Record<string, unknown>,
): void {
  const context: ErrorContext = {
    componentName,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    additionalInfo,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[${context.timestamp}] Warning in ${componentName || 'unknown component'}:`,
      message,
      additionalInfo,
    );
  }

  // Here you would typically send to a monitoring service
}

/**
 * Higher-order function to add error logging to async operations
 *
 * @param operation - The async operation to wrap
 * @param componentName - Name of the component where the operation is used
 * @returns The wrapped operation with error logging
 */
export function withErrorLogging<T extends (...args: unknown[]) => Promise<unknown>>(
  operation: T,
  componentName?: string,
): T {
  return (async (...args: unknown[]) => {
    try {
      return await operation(...args);
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), undefined, componentName);
      throw error;
    }
  }) as T;
}

/**
 * Handle error with recovery attempt
 */
export const handleErrorWithRecovery = async (
  error: unknown,
  context?: string,
  errorId?: string,
): Promise<boolean> => {
  const dashboardError = convertToDashboardError(error);

  // Log the error
  logError(error instanceof Error ? error : new Error(String(error)), undefined, context);

  // Report the error
  errorReporting.reportError(error, context);

  // Attempt recovery
  return await errorRecovery.attemptRecovery(dashboardError, errorId);
};
