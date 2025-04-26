import type React from 'react';
import { type ComponentType, Suspense, lazy } from 'react';
import ErrorBoundary from '../components/ui/ErrorBoundary';

/**
 * Configuration for lazy loading a component
 */
export interface LazyLoadConfig {
  /**
   * The path to the component to lazy load
   */
  path: string;

  /**
   * The name of the component to lazy load
   */
  componentName: string;

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
 * Creates a lazy-loaded component with error boundary and suspense
 *
 * @param config - Configuration for lazy loading
 * @returns A component that lazy loads the specified component
 */
export function createLazyComponent<T extends ComponentType<Record<string, unknown>>>(
  config: LazyLoadConfig,
): React.FC<Record<string, unknown>> {
  const { path, componentName, fallback, errorBoundaryProps } = config;

  // Create the lazy component
  const LazyComponent = lazy(() => import(`../views/${path}`));
  LazyComponent.displayName = componentName;

  // Return a component that wraps the lazy component with error boundary and suspense
  return function LazyLoadedComponent(props: Record<string, unknown>) {
    return (
      <ErrorBoundary componentName={componentName} {...errorBoundaryProps}>
        <Suspense fallback={fallback || <DefaultLoadingFallback />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

/**
 * Preload a component for faster subsequent loading
 *
 * @param path - The path to the component to preload
 * @param componentName - The name of the component to preload
 */
export function preloadComponent(path: string, componentName: string): void {
  import(/* webpackChunkName: "[request]" */ `../components/${path}`)
    .then((module) => {
      console.log(`Preloaded component ${componentName} from ${path}`);
    })
    .catch((error) => {
      console.error(`Error preloading component ${componentName} from ${path}:`, error);
    });
}

/**
 * Preload multiple components
 *
 * @param components - Array of components to preload
 */
export function preloadComponents(
  components: Array<{ path: string; componentName: string }>,
): void {
  for (const { path, componentName } of components) {
    preloadComponent(path, componentName);
  }
}
