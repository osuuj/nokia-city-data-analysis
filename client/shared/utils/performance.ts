'use client';

import type { ComponentType, FC, ProfilerOnRenderCallback, PropsWithChildren } from 'react';
import { Profiler, createElement } from 'react';

type Interaction = { id: number; name: string; timestamp: number };

/**
 * Performance metrics interface
 */
interface PerformanceMetrics {
  id: string;
  phase: string;
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<Interaction>;
}

interface PerformanceData {
  componentName: string;
  metrics: PerformanceMetrics;
}

/**
 * Performance monitoring options
 */
export interface PerformanceMonitoringOptions {
  /** Whether to log metrics to console */
  logToConsole?: boolean;
  /** Whether to track component renders */
  trackRenders?: boolean;
  /** Whether to track interactions */
  trackInteractions?: boolean;
  /** Custom callback for performance data */
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

/**
 * Default performance monitoring options
 */
const defaultOptions: PerformanceMonitoringOptions = {
  logToConsole: process.env.NODE_ENV === 'development',
  trackRenders: true,
  trackInteractions: true,
};

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  private options: PerformanceMonitoringOptions;

  private constructor(options: PerformanceMonitoringOptions = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(options?: PerformanceMonitoringOptions): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(options);
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Create a profiler callback for a component
   */
  public createProfilerCallback(
    componentName: string,
  ): (
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<Interaction>,
  ) => void {
    return (
      id: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number,
      interactions: Set<Interaction>,
    ): void => {
      const metrics: PerformanceMetrics = {
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      };

      // Store metrics
      if (!this.metrics.has(componentName)) {
        this.metrics.set(componentName, []);
      }
      this.metrics.get(componentName)?.push(metrics);

      // Log to console if enabled
      if (this.options.logToConsole) {
        console.log(`[Performance] ${componentName}:`, {
          phase,
          actualDuration: `${actualDuration.toFixed(2)}ms`,
          baseDuration: `${baseDuration.toFixed(2)}ms`,
          interactions: interactions.size,
        });
      }

      // Call custom callback if provided
      if (this.options.onMetrics) {
        this.options.onMetrics(metrics);
      }
    };
  }

  /**
   * Get metrics for a component
   */
  public getMetrics(componentName: string): PerformanceMetrics[] {
    return this.metrics.get(componentName) || [];
  }

  /**
   * Clear metrics for a component
   */
  public clearMetrics(componentName: string): void {
    this.metrics.delete(componentName);
  }

  /**
   * Clear all metrics
   */
  public clearAllMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Get a performance report
   */
  public getReport(): Record<string, PerformanceMetrics[]> {
    const report: Record<string, PerformanceMetrics[]> = {};
    this.metrics.forEach((metrics, componentName) => {
      report[componentName] = metrics;
    });
    return report;
  }
}

/**
 * Logs performance metrics to the console in development mode
 * and sends them to an analytics service in production.
 */
const logPerformanceMetrics = (data: PerformanceData): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance metrics for ${data.componentName}:`, {
      renderTime: `${data.metrics.actualDuration.toFixed(2)}ms`,
      baseTime: `${data.metrics.baseDuration.toFixed(2)}ms`,
      phase: data.metrics.phase,
      timestamp: new Date(data.metrics.startTime).toISOString(),
    });
  } else {
    // TODO: Send metrics to analytics service
    // analyticsService.logPerformance(data);
  }
};

/**
 * Higher-order component that wraps a component with React Profiler
 * to measure its rendering performance.
 *
 * @example
 * ```tsx
 * const ProfiledComponent = withPerformanceTracking(MyComponent, 'MyComponent');
 * ```
 */
export function withPerformanceTracking<P extends object>(
  Component: ComponentType<P>,
  componentName: string,
): FC<P> {
  const profilerCallback: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
    nextInteractions,
  ) => {
    const metrics: PerformanceMetrics = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions,
    };

    logPerformanceMetrics({
      componentName,
      metrics,
    });
  };

  const ProfilerWrapper: FC<P> = (props: P) =>
    createElement(
      Profiler,
      { id: componentName, onRender: profilerCallback },
      createElement(Component, props),
    );

  ProfilerWrapper.displayName = `WithPerformanceTracking(${componentName})`;
  return ProfilerWrapper;
}

/**
 * Hook to track component performance using React Profiler
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useDashboardPerformanceTracking('MyComponent');
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useDashboardPerformanceTracking(componentName: string): ProfilerOnRenderCallback {
  return (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
    nextInteractions,
  ) => {
    const metrics: PerformanceMetrics = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions,
    };

    logPerformanceMetrics({
      componentName,
      metrics,
    });
  };
}

/**
 * Track component render performance
 */
export function usePerformanceTracking(componentName: string): void {
  // Only log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] Component ${componentName} mounted`);
  }
}

/**
 * Track user interaction performance
 */
export function useInteractionTracking(interactionName: string): void {
  // Only log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] Interaction ${interactionName} tracked`);
  }
}
