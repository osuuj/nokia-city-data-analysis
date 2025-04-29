import {
  type PerformanceMetrics,
  PerformanceMonitor,
  type PerformanceMonitoringOptions,
  withPerformanceTracking as baseWithPerformanceTracking,
} from '@/shared/utils/performance';
import type React from 'react';

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
    return baseWithPerformanceTracking(Component, `Analytics:${componentName}`);
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
    return baseWithPerformanceTracking(Component, `Table:${componentName}`);
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
    return baseWithPerformanceTracking(Component, `Map:${componentName}`);
  }

  /**
   * Get metrics for an analytics component
   */
  public getAnalyticsMetrics(componentName: string): PerformanceMetrics[] {
    return this.monitor.getMetrics(`Analytics:${componentName}`);
  }

  /**
   * Get metrics for a table component
   */
  public getTableMetrics(componentName: string): PerformanceMetrics[] {
    return this.monitor.getMetrics(`Table:${componentName}`);
  }

  /**
   * Get metrics for a map component
   */
  public getMapMetrics(componentName: string): PerformanceMetrics[] {
    return this.monitor.getMetrics(`Map:${componentName}`);
  }

  /**
   * Get a performance report for all dashboard components
   */
  public getDashboardReport(): Record<string, PerformanceMetrics[]> {
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
