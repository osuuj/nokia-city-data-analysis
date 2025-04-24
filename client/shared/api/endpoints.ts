/**
 * API endpoints constants
 */
export const API_ENDPOINTS = {
  // Cities endpoints
  CITIES: {
    LIST: '/cities',
    DETAIL: (id: string) => `/cities/${id}`,
    STATISTICS: (id: string) => `/cities/${id}/statistics`,
  },

  // Companies endpoints
  COMPANIES: {
    LIST: '/companies',
    DETAIL: (id: string) => `/companies/${id}`,
    STATISTICS: (id: string) => `/companies/${id}/statistics`,
  },

  // Dashboard endpoints
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    STATISTICS: '/dashboard/statistics',
  },

  // Analytics endpoints
  ANALYTICS: {
    TOP_CITIES: '/analytics/top-cities',
    INDUSTRY_DISTRIBUTION: '/analytics/industry-distribution',
    INDUSTRIES_BY_CITY: '/analytics/industries-by-city',
    CITY_COMPARISON: '/analytics/city-comparison',
  },

  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
} as const;

/**
 * API base URL
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * API timeout in milliseconds
 */
export const API_TIMEOUT = 30000;

/**
 * API retry count
 */
export const API_RETRY_COUNT = 3;

/**
 * API retry delay in milliseconds
 */
export const API_RETRY_DELAY = 1000;
