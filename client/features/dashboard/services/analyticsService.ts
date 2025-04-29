/**
 * Analytics Service
 * Handles data fetching, processing and transformation for analytics features
 */

import type {
  ApiResponse,
  CityComparisonResponse,
  ErrorWithApi,
  IndustryDistributionResponse,
  TopCitiesResponse,
} from '../hooks/analytics/types';

// Constants
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

/**
 * Fetches analytics data for a specific city
 */
export async function fetchCityAnalytics(cityName: string): Promise<TopCitiesResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/analytics/city/${encodeURIComponent(cityName)}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch city analytics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching city analytics:', error);
    throw error;
  }
}

/**
 * Fetches comparison data between cities
 */
export async function fetchCityComparison(cities: string[]): Promise<CityComparisonResponse> {
  try {
    const citiesParam = cities.map((city) => encodeURIComponent(city)).join(',');
    const response = await fetch(`${BASE_URL}/api/v1/analytics/comparison?cities=${citiesParam}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch city comparison: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching city comparison:', error);
    throw error;
  }
}

/**
 * Fetches industry distribution data
 */
export async function fetchIndustryDistribution(
  cityName?: string,
): Promise<IndustryDistributionResponse> {
  try {
    const url = cityName
      ? `${BASE_URL}/api/v1/analytics/industries/${encodeURIComponent(cityName)}`
      : `${BASE_URL}/api/v1/analytics/industries`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch industry distribution: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching industry distribution:', error);
    throw error;
  }
}

/**
 * Helper function to handle API responses with error handling
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: ErrorWithApi | null }> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      return {
        data: null,
        error: {
          name: 'ApiError',
          message: `API error: ${response.statusText}`,
          status: response.status,
          code: response.status.toString(),
        },
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        name: 'NetworkError',
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
        code: 'NETWORK_ERROR',
      },
    };
  }
}
