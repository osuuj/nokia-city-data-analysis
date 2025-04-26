import { useCallback, useState } from 'react';
import type { DashboardError } from '../types/common';
import { errorRecovery } from '../utils/errorRecovery';
import { errorReporting } from '../utils/errorReporting';

interface UseErrorRecoveryOptions {
  onRecoverySuccess?: () => void;
  onRecoveryFailure?: (error: DashboardError) => void;
  context?: string;
}

interface UseErrorRecoveryResult {
  isRecovering: boolean;
  recoverySuccessful: boolean;
  recoveryError: DashboardError | null;
  attemptRecovery: (error: DashboardError, errorId?: string) => Promise<boolean>;
  resetRecovery: () => void;
}

/**
 * Hook for using the error recovery system in components
 *
 * @param options - Configuration options for error recovery
 * @returns Object with error recovery state and methods
 */
export function useErrorRecovery(options: UseErrorRecoveryOptions = {}): UseErrorRecoveryResult {
  const { onRecoverySuccess, onRecoveryFailure, context = 'Component' } = options;

  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySuccessful, setRecoverySuccessful] = useState(false);
  const [recoveryError, setRecoveryError] = useState<DashboardError | null>(null);

  /**
   * Attempt to recover from an error
   *
   * @param error - The error to recover from
   * @param errorId - Optional unique identifier for the error
   * @returns Promise that resolves to true if recovery was successful
   */
  const attemptRecovery = useCallback(
    async (error: DashboardError, errorId?: string): Promise<boolean> => {
      setIsRecovering(true);
      setRecoverySuccessful(false);
      setRecoveryError(null);

      try {
        // Log the error
        errorReporting.reportError(error, `Attempting recovery in ${context}`, 'useErrorRecovery');

        // Attempt recovery
        const success = await errorRecovery.attemptRecovery(error, errorId);

        setRecoverySuccessful(success);

        if (success) {
          // Call success callback if provided
          if (onRecoverySuccess) {
            onRecoverySuccess();
          }
        } else {
          // Set recovery error if unsuccessful
          setRecoveryError(error);

          // Call failure callback if provided
          if (onRecoveryFailure) {
            onRecoveryFailure(error);
          }
        }

        return success;
      } catch (recoveryError) {
        // Handle errors during recovery
        const dashboardError: DashboardError = {
          code: 'RECOVERY_ERROR',
          message:
            recoveryError instanceof Error
              ? recoveryError.message
              : 'Error during recovery attempt',
          severity: 'error',
          timestamp: new Date(),
          details: recoveryError instanceof Error ? { stack: recoveryError.stack } : undefined,
        };

        setRecoveryError(dashboardError);

        // Call failure callback if provided
        if (onRecoveryFailure) {
          onRecoveryFailure(dashboardError);
        }

        return false;
      } finally {
        setIsRecovering(false);
      }
    },
    [context, onRecoverySuccess, onRecoveryFailure],
  );

  /**
   * Reset recovery state
   */
  const resetRecovery = useCallback(() => {
    setIsRecovering(false);
    setRecoverySuccessful(false);
    setRecoveryError(null);
  }, []);

  return {
    isRecovering,
    recoverySuccessful,
    recoveryError,
    attemptRecovery,
    resetRecovery,
  };
}

export default useErrorRecovery;
