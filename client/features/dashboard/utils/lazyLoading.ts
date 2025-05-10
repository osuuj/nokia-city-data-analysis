/**
 * Lazy Loading Utilities
 * Pure utility functions for lazy loading components without JSX
 */

import type { ComponentType } from 'react';
import { lazy } from 'react';

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
}

/**
 * Creates a lazy-loaded component without Suspense or ErrorBoundary
 * This function contains no JSX
 *
 * @param config - Configuration for lazy loading
 * @returns A lazy-loaded component
 */
// biome-ignore lint/suspicious/noExplicitAny: Using generic component pattern common in React
export function createLazyComponentLoader<T extends ComponentType<any>>(config: LazyLoadConfig): T {
  const { path, componentName } = config;

  // Create the lazy component
  const LazyComponent = lazy(() => import(`../components/views/${path}`)) as unknown as T;
  LazyComponent.displayName = componentName;

  return LazyComponent;
}

/**
 * Preload a component for faster subsequent loading
 *
 * @param path - The path to the component to preload
 * @param componentName - The name of the component to preload
 */
export function preloadComponent(path: string, componentName: string): void {
  import(/* webpackChunkName: "[request]" */ `../components/${path}`)
    .then(() => {
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
