/**
 * API Endpoints - Compatibility Layer
 *
 * This file provides endpoint constants that are referenced in other files.
 * It's part of the compatibility layer to minimize changes needed in existing code.
 */

// Base API URL
const API_BASE = '/api/v1';

// Core endpoints
export const CITIES = `${API_BASE}/cities`;
export const COMPANIES = `${API_BASE}/companies`;
export const GEOJSON = `${API_BASE}/companies.geojson`;

// Analytics endpoints
export const ANALYTICS = {
  INDUSTRY_DISTRIBUTION: `${API_BASE}/analytics/industry-distribution`,
  CITY_COMPARISON: `${API_BASE}/analytics/city-comparison`,
  TOP_CITIES: `${API_BASE}/analytics/top-cities`,
  STATS: `${API_BASE}/stats`,
};

// Dashboard endpoints
export const DASHBOARD = {
  OVERVIEW: `${API_BASE}/dashboard/overview`,
  CITIES: CITIES,
  COMPANIES: COMPANIES,
};

// Export as API_ENDPOINTS to match existing imports
export const API_ENDPOINTS = {
  CITIES,
  COMPANIES,
  GEOJSON,
  ANALYTICS,
  DASHBOARD,
};

// Default export for direct imports
export default {
  CITIES,
  COMPANIES,
  GEOJSON,
  ANALYTICS,
  DASHBOARD,
};
