import type React from 'react';
import { Profiler, type ProfilerOnRenderCallback, createElement } from 'react';

/**
 * Dashboard-specific performance monitoring options
 */
export interface DashboardPerformanceOptions extends PerformanceMonitoringOptions {
  /** Whether to track analytics components */
  trackAnalytics?: boolean;
  /** Whether to track table components */
  trackTable?: boolean;
  /** Whether to track map components */
  trackMap?: boolean;
}

/**
 * Default dashboard performance monitoring options
 */
const defaultOptions: DashboardPerformanceOptions = {
  logToConsole: process.env.NODE_ENV === 'development',
  trackRenders: true,
  trackInteractions: true,
  trackAnalytics: true,
  trackTable: true,
  trackMap: true,
};

// Define types previously imported from shared utils
interface PerformanceMonitoringOptions {
  /** Whether to log metrics to console */
  logToConsole?: boolean;
  /** Whether to track component renders */
  trackRenders?: boolean;
  /** Whether to track interactions */
  trackInteractions?: boolean;
  /** Custom callback for performance data */
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

type Interaction = { id: number; name: string; timestamp: number };

interface PerformanceMetrics {
  id: string;
  phase: string;
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<Interaction>;
}

// Define the PerformanceMonitor class
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  private options: PerformanceMonitoringOptions;

  private constructor(options: PerformanceMonitoringOptions = {}) {
    this.options = {
      logToConsole: process.env.NODE_ENV === 'development',
      trackRenders: true,
      trackInteractions: true,
      ...options,
    };
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
 * Higher-order component that wraps a component with React Profiler
 * to measure its rendering performance.
 */
function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
): React.ComponentType<P> {
  const profilerCallback: ProfilerOnRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<{ id: number; name: string; timestamp: number }>,
    nextInteractions?: Set<{ id: number; name: string; timestamp: number }>,
  ) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
      });
    }
  };

  const ProfilerWrapper: React.FC<P> = (props: P) =>
    createElement(
      Profiler,
      { id: componentName, onRender: profilerCallback },
      createElement(Component, props),
    );

  ProfilerWrapper.displayName = `WithPerformanceTracking(${componentName})`;
  return ProfilerWrapper;
}

/**
 * Dashboard performance monitoring class
 * Extends the shared PerformanceMonitor with dashboard-specific functionality
 */
export class DashboardPerformanceMonitor {
  private static instance: DashboardPerformanceMonitor;
  private monitor: PerformanceMonitor;
  private options: DashboardPerformanceOptions;

  private constructor(options: DashboardPerformanceOptions = {}) {
    this.options = { ...defaultOptions, ...options };
    this.monitor = PerformanceMonitor.getInstance({
      logToConsole: this.options.logToConsole,
      trackRenders: this.options.trackRenders,
      trackInteractions: this.options.trackInteractions,
      onMetrics: this.options.onMetrics,
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(options?: DashboardPerformanceOptions): DashboardPerformanceMonitor {
    if (!DashboardPerformanceMonitor.instance) {
      DashboardPerformanceMonitor.instance = new DashboardPerformanceMonitor(options);
    }
    return DashboardPerformanceMonitor.instance;
  }

  /**
   * Create a profiler wrapper for an analytics component
   */
  public withAnalyticsProfiler<P extends object>(
    Component: React.ComponentType<P>,
    componentName: string,
  ): React.ComponentType<P> {
    if (!this.options.trackAnalytics) {
      return Component;
    }
    return withPerformanceTracking(Component, `Analytics:${componentName}`);
  }

  /**
   * Create a profiler wrapper for a table component
   */
  public withTableProfiler<P extends object>(
    Component: React.ComponentType<P>,
    componentName: string,
  ): React.ComponentType<P> {
    if (!this.options.trackTable) {
      return Component;
    }
    return withPerformanceTracking(Component, `Table:${componentName}`);
  }

  /**
   * Create a profiler wrapper for a map component
   */
  public withMapProfiler<P extends object>(
    Component: React.ComponentType<P>,
    componentName: string,
  ): React.ComponentType<P> {
    if (!this.options.trackMap) {
      return Component;
    }
    return withPerformanceTracking(Component, `Map:${componentName}`);
  }

  /**
   * Get metrics for an analytics component
   */
  public getAnalyticsMetrics(componentName: string) {
    return this.monitor.getMetrics(`Analytics:${componentName}`);
  }

  /**
   * Get metrics for a table component
   */
  public getTableMetrics(componentName: string) {
    return this.monitor.getMetrics(`Table:${componentName}`);
  }

  /**
   * Get metrics for a map component
   */
  public getMapMetrics(componentName: string) {
    return this.monitor.getMetrics(`Map:${componentName}`);
  }

  /**
   * Get a performance report for all dashboard components
   */
  public getDashboardReport() {
    return this.monitor.getReport();
  }

  /**
   * Clear all dashboard performance metrics
   */
  public clearAllMetrics(): void {
    this.monitor.clearAllMetrics();
  }
}

/**
 * Create a profiler wrapper for an analytics component
 */
export function withAnalyticsProfiler<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
): React.ComponentType<P> {
  const monitor = DashboardPerformanceMonitor.getInstance();
  return monitor.withAnalyticsProfiler(Component, componentName);
}

/**
 * Create a profiler wrapper for a table component
 */
export function withTableProfiler<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
): React.ComponentType<P> {
  const monitor = DashboardPerformanceMonitor.getInstance();
  return monitor.withTableProfiler(Component, componentName);
}

/**
 * Create a profiler wrapper for a map component
 */
export function withMapProfiler<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
): React.ComponentType<P> {
  const monitor = DashboardPerformanceMonitor.getInstance();
  return monitor.withMapProfiler(Component, componentName);
}

/**
 * Track dashboard component render performance
 */
export function useDashboardPerformanceTracking(
  componentName: string,
  componentType: 'analytics' | 'table' | 'map',
): void {
  const monitor = DashboardPerformanceMonitor.getInstance();

  // Log component mount for tracking
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Dashboard Performance] ${componentType} component ${componentName} mounted`);
  }
}

/**
 * Track dashboard user interaction performance
 */
export function useDashboardInteractionTracking(interactionName: string): void {
  const monitor = DashboardPerformanceMonitor.getInstance();

  // Log interaction for tracking
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Dashboard Performance] Interaction ${interactionName} tracked`);
  }
}
