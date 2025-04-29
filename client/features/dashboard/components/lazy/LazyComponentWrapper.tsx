/**
 * LazyComponentWrapper
 * React component that wraps lazy-loaded components with Suspense and ErrorBoundary
 */

import { ErrorBoundary } from '@/shared/components/error';
import type { ComponentType } from 'react';
import { Suspense } from 'react';
import type { LazyLoadConfig } from '../../utils/lazyLoading';
import { createLazyComponentLoader } from '../../utils/lazyLoading';

/**
 * Extended configuration for lazy loading with UI options
 */
export interface LazyComponentWrapperConfig extends LazyLoadConfig {
  /**
   * Optional fallback component to show while loading
   */
  fallback?: React.ReactNode;

  /**
   * Optional error boundary props
   */
  errorBoundaryProps?: {
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  };
}

/**
 * Default loading fallback component
 */
const DefaultLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
);

/**
 * Creates a wrapped lazy-loaded component with error boundary and suspense
 *
 * @param config - Configuration for lazy loading with UI options
 * @returns A component that wraps the lazy component with error handling and loading states
 */
// biome-ignore lint/suspicious/noExplicitAny: Using generic component pattern common in React
export function createLazyComponent<T extends ComponentType<any>>(
  config: LazyComponentWrapperConfig,
): React.FC<React.ComponentProps<T>> {
  const { componentName, fallback, errorBoundaryProps } = config;

  // Create the lazy component using the pure utility function
  const LazyComponent = createLazyComponentLoader<T>(config);

  // Return a component that wraps the lazy component with error boundary and suspense
  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <ErrorBoundary
        fallback={errorBoundaryProps?.fallback}
        onError={errorBoundaryProps?.onError}
        ariaLabel={`Error in ${componentName}`}
      >
        <Suspense fallback={fallback || <DefaultLoadingFallback />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
