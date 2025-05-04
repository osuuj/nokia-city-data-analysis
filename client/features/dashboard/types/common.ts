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
 * Error codes for dashboard errors
 */
export type ErrorCode =
  | 'AUTH_ERROR'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Structure for API errors
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
}

/**
 * Dashboard-specific error structure
 */
export interface DashboardError {
  code: ErrorCode;
  message: string;
  status: number;
  details?: unknown;
}

export type DashboardView = 'overview' | 'analytics' | 'reports' | 'settings';
