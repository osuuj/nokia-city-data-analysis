import type React from 'react';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
  lastRender: number;
}

/**
 * Performance monitoring options
 */
export interface PerformanceMonitoringOptions {
  logToConsole?: boolean;
  trackRenders?: boolean;
  trackInteractions?: boolean;
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

/**
 * Performance monitoring singleton class
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Record<string, PerformanceMetrics[]> = {};
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
    return this.metrics[componentName] || [];
  }

  /**
   * Get all metrics as a report
   */
  public getReport(): Record<string, PerformanceMetrics[]> {
    return { ...this.metrics };
  }

  /**
   * Clear all metrics
   */
  public clearAllMetrics(): void {
    this.metrics = {};
  }
}

/**
 * HOC to track component performance
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
): React.ComponentType<P> {
  // This is a simplified version that just returns the component
  // In a real implementation, this would wrap with a Profiler
  return Component;
}
