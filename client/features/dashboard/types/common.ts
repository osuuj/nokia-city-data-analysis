/**
 * Common types used across the dashboard feature
 */

export interface City {
  id: string;
  name: string;
  country: string;
  population?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Industry {
  value: string;
  title: string;
  icon?: string;
  color?: {
    light: string;
    dark: string;
  };
}

export interface DashboardFilter {
  key: string;
  options?: Industry[];
  industries?: Industry[];
  name?: string;
  darkColor?: string;
  lightColor?: string;
  value?: string;
  title?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: string;
}

export interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Dashboard error type for consistent error handling
 */
export interface DashboardError {
  message: string;
  code?: string;
  status?: number;
}

export type DashboardView = 'overview' | 'analytics' | 'reports' | 'settings';
