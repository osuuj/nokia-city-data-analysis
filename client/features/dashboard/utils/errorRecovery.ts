import type { ApiError } from '@/shared/api/types/ApiTypes';
import type { DashboardError } from '../types/common';
import { errorReporting } from './errorReporting';

/**
 * Error recovery strategies for different types of errors
 * Provides a centralized way to handle error recovery flows
 */
export class ErrorRecoveryService {
  private static instance: ErrorRecoveryService;
  private recoveryStrategies: Map<string, (error: DashboardError) => Promise<boolean>> = new Map();
  private recoveryCallbacks: Map<string, () => Promise<void>> = new Map();

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the singleton instance of the error recovery service
   */
  public static getInstance(): ErrorRecoveryService {
    if (!ErrorRecoveryService.instance) {
      ErrorRecoveryService.instance = new ErrorRecoveryService();
    }
    return ErrorRecoveryService.instance;
  }

  /**
   * Register a recovery strategy for a specific error type
   *
   * @param errorType - The type of error to register a strategy for
   * @param strategy - The recovery strategy function
   */
  public registerRecoveryStrategy(
    errorType: string,
    strategy: (error: DashboardError) => Promise<boolean>,
  ): void {
    this.recoveryStrategies.set(errorType, strategy);
  }

  /**
   * Register a recovery callback for a specific error ID
   *
   * @param errorId - The ID of the error to register a callback for
   * @param callback - The recovery callback function
   */
  public registerRecoveryCallback(errorId: string, callback: () => Promise<void>): void {
    this.recoveryCallbacks.set(errorId, callback);
  }

  /**
   * Attempt to recover from an error
   *
   * @param error - The error to recover from
   * @param errorId - Optional ID of the error
   * @returns A promise that resolves to true if recovery was successful, false otherwise
   */
  public async attemptRecovery(error: DashboardError, errorId?: string): Promise<boolean> {
    // Report the error
    errorReporting.reportError(error, 'Error Recovery', 'ErrorRecoveryService');

    // Try to find a specific recovery strategy for this error type
    const strategy = this.recoveryStrategies.get(error.code);
    if (strategy) {
      try {
        return await strategy(error);
      } catch (recoveryError) {
        errorReporting.reportError(
          recoveryError,
          'Error Recovery Strategy Failed',
          'ErrorRecoveryService',
        );
      }
    }

    // Try to find a specific recovery callback for this error ID
    if (errorId) {
      const callback = this.recoveryCallbacks.get(errorId);
      if (callback) {
        try {
          await callback();
          return true;
        } catch (callbackError) {
          errorReporting.reportError(
            callbackError,
            'Error Recovery Callback Failed',
            'ErrorRecoveryService',
          );
        }
      }
    }

    // Fall back to default recovery strategy
    return this.defaultRecovery(error);
  }

  /**
   * Default recovery strategy for errors without a specific strategy
   *
   * @param error - The error to recover from
   * @returns A promise that resolves to true if recovery was successful, false otherwise
   */
  private async defaultRecovery(error: DashboardError): Promise<boolean> {
    // Default recovery strategies based on error type
    switch (error.code) {
      case 'NETWORK_ERROR':
        // For network errors, wait a bit and retry
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return true;

      case 'VALIDATION_ERROR':
        // For validation errors, clear cached data
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            // Clear relevant cached data
            localStorage.removeItem('dashboard-cache');
            return true;
          } catch (e) {
            errorReporting.reportError(e, 'Cache Clear Failed', 'ErrorRecoveryService');
          }
        }
        return false;

      case 'SERVER_ERROR':
        // For server errors, implement a retry mechanism
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return true;

      case 'AUTH_ERROR':
        // For auth errors, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
          return true;
        }
        return false;

      default:
        // For unknown errors, just return false
        return false;
    }
  }
}

// Export a singleton instance
export const errorRecovery = ErrorRecoveryService.getInstance();

/**
 * Initialize default recovery strategies
 */
export function initializeRecoveryStrategies(): void {
  const service = ErrorRecoveryService.getInstance();

  // Register recovery strategies for common error types
  service.registerRecoveryStrategy('NETWORK_ERROR', async (error) => {
    // Wait and retry for network errors
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true;
  });

  service.registerRecoveryStrategy('VALIDATION_ERROR', async (error) => {
    // Clear cached data for validation errors
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('dashboard-cache');
        return true;
      } catch (e) {
        errorReporting.reportError(e, 'Cache Clear Failed', 'ErrorRecoveryService');
      }
    }
    return false;
  });

  service.registerRecoveryStrategy('SERVER_ERROR', async (error) => {
    // Wait and retry for server errors
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return true;
  });

  service.registerRecoveryStrategy('AUTH_ERROR', async (error) => {
    // Redirect to login for auth errors
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
      return true;
    }
    return false;
  });
}
