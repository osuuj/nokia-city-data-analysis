'use client';

import type { CompanyProperties } from '@/features/dashboard/types/business';
import { logger } from '@/shared/utils/logger';
import { useQuery } from '@tanstack/react-query';
import type { Feature, FeatureCollection, Point } from 'geojson';

// Default to http://localhost:8000, but allow override via .env
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Fallback data in case API is down
const FALLBACK_CITIES = ['Helsinki', 'Tampere', 'Oulu', 'Turku', 'Espoo'];

// Empty GeoJSON structure for fallback
const EMPTY_GEOJSON: FeatureCollection<Point, CompanyProperties> = {
  type: 'FeatureCollection',
  features: [],
};

/**
 * fetchCompanies
 * Fetches businesses for the given city from the backend API.
 *
 * @param city - The city name to filter businesses
 * @returns A promise that resolves to an array of CompanyProperties objects
 */
const fetchCompanies = async (city: string): Promise<CompanyProperties[]> => {
  if (!city) {
    logger.warn('City is empty, skipping fetch.');
    return [];
  }

  logger.info(
    `Fetching companies from: ${city} using URL: ${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(city)}`,
  );

  try {
    // First try using the configured API URL
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(city)}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
          // Add a timeout to prevent hanging requests
          signal: AbortSignal.timeout(5000),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch businesses: ${response.status} ${response.statusText}`);
      }

      const geojsonData = (await response.json()) as FeatureCollection<Point, CompanyProperties>;
      logger.info('Companies fetched:', geojsonData);

      // Extract company properties from GeoJSON features
      return geojsonData.features.map((feature) => feature.properties);
    } catch (apiError) {
      logger.error('Error with primary API endpoint:', apiError);

      // As fallback, try explicit localhost URL if BASE_URL was something different
      if (BASE_URL !== 'http://localhost:8000') {
        try {
          const fallbackResponse = await fetch(
            `http://localhost:8000/api/v1/companies.geojson?city=${encodeURIComponent(city)}`,
            {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              cache: 'no-cache',
              signal: AbortSignal.timeout(5000),
            },
          );

          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            logger.info('Companies fetched from fallback URL:', fallbackData);
            return fallbackData.features.map(
              (feature: Feature<Point, CompanyProperties>) => feature.properties,
            );
          }
        } catch (fallbackError) {
          logger.error('Fallback API also failed:', fallbackError);
        }
      }

      // If all API attempts fail, return empty array but don't break the app
      logger.warn('Returning empty companies array as fallback');
      return [];
    }
  } catch (error) {
    logger.error('Critical error fetching companies:', error);
    // Don't throw, just return empty array to prevent app from breaking
    return [];
  }
};

/**
 * fetchCities
 * Fetches a list of all supported cities from the backend API.
 *
 * @returns A promise that resolves to an array of city names
 */
const fetchCities = async (): Promise<string[]> => {
  logger.info(`Fetching cities from URL: ${BASE_URL}/api/v1/cities`);

  try {
    // First try using the configured API URL
    try {
      const response = await fetch(`${BASE_URL}/api/v1/cities`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
      }

      const cities = await response.json();
      logger.info('Cities fetched:', cities);
      return cities;
    } catch (apiError) {
      logger.error('API error fetching cities:', apiError);

      // Try fallback localhost URL if BASE_URL was something different
      if (BASE_URL !== 'http://localhost:8000') {
        try {
          const fallbackResponse = await fetch('http://localhost:8000/api/v1/cities', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000),
          });

          if (fallbackResponse.ok) {
            const fallbackCities = await fallbackResponse.json();
            logger.info('Cities fetched from fallback URL:', fallbackCities);
            return fallbackCities;
          }
        } catch (fallbackError) {
          logger.error('Fallback API also failed:', fallbackError);
        }
      }

      // Return hardcoded fallback cities
      logger.warn('Returning fallback cities list');
      return FALLBACK_CITIES;
    }
  } catch (error) {
    logger.error('Critical error fetching cities:', error);
    // Return fallback data instead of throwing
    return FALLBACK_CITIES;
  }
};

/**
 * useFetchCities
 * React Query hook to fetch available cities.
 *
 * @returns { data, error, isLoading }
 */
export function useFetchCities() {
  return useQuery<string[], Error>({
    queryKey: ['cities'],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: FALLBACK_CITIES, // Always provide fallback data
    // Add retry logic to handle temporary API issues
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
  });
}

/**
 * useFetchCompanies
 * React Query hook to fetch businesses by selected city.
 *
 * @param city - Selected city name
 * @returns { data, error, isLoading }
 */
export function useFetchCompanies(city: string) {
  return useQuery<CompanyProperties[], Error>({
    queryKey: ['companies', city],
    queryFn: () => fetchCompanies(city),
    enabled: !!city, // only fetch if a city is selected
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: [], // Provide empty array as placeholder
    // Add retry logic
    retry: 2,
  });
}
