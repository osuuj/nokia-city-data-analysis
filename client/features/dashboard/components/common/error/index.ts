/**
 * Dashboard Error Components
 *
 * This module re-exports the shared error components.
 * All dashboard-specific error utilities have been consolidated into shared components.
 *
 * @deprecated This file will be removed in future. Import directly from '@/shared/components/error'.
 */

// Re-export from shared components
export {
  FeatureErrorBoundary,
  ErrorBoundary,
  ErrorMessage,
  withErrorBoundary,
  ErrorDisplay,
  SimpleErrorMessage,
} from '@/shared/components/error';

// Export error related hooks and utilities
export { logError } from '../../../utils';
