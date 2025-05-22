'use client';

import type { CompanyProperties } from '@/features/dashboard/types/business';
import { logger } from '@/shared/utils/logger';
import { notifySystemError, notifySystemWarning } from '@/shared/utils/notifications';
import { useQuery } from '@tanstack/react-query';
import type { FeatureCollection, Point } from 'geojson';

// Smart default URL based on environment
const isProd = process.env.NODE_ENV === 'production';
const PROD_DEFAULT = 'https://api.osuuj.ai';
const DEV_DEFAULT = 'http://localhost:8000';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? PROD_DEFAULT : DEV_DEFAULT);

// Log the actual API URL only in development
if (process.env.NODE_ENV === 'development') {
  logger.info(`API Base URL: ${BASE_URL}`);
}

// Fallback data in case API is down
const FALLBACK_CITIES = ['Helsinki', 'Tampere', 'Oulu', 'Turku', 'Espoo'];

// Only use logger.error for critical issues. Debug/info logs are now globally suppressed unless debug mode is enabled.

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

  // List of known large cities that might have performance issues
  const largeCities = ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'];

  // Warn about potential performance issues for large cities
  if (largeCities.includes(city)) {
    notifySystemWarning(
      `Data fetching for ${city} might be slower due to the large number of companies.`,
    );
  }

  // Try the original path first (might be the correct one in production)
  const apiUrl = `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(city)}`;

  logger.info(`Fetching companies from: ${city} using URL: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      signal: AbortSignal.timeout(10000), // Increased timeout to 10s
    });

    if (!response.ok) {
      const errorMessage = `Failed to fetch businesses: ${response.status} ${response.statusText}`;
      logger.error(errorMessage);

      // Notify users about the error
      if (response.status === 504 || response.status === 408) {
        notifySystemError(
          `Data fetching timeout for ${city}. The city might have too many companies to process.`,
        );
      } else {
        notifySystemError(`Unable to load company data for ${city}. Please try again later.`);
      }

      throw new Error(errorMessage);
    }

    const geojsonData = (await response.json()) as FeatureCollection<Point, CompanyProperties>;
    const companyCount = geojsonData.features.length;

    logger.info(`Successfully fetched ${companyCount} companies for ${city}`);

    // Notify if the result set is large
    if (companyCount > 1000) {
      notifySystemWarning(`${city} has ${companyCount} companies. Performance might be affected.`);
    }

    return geojsonData.features.map((feature) => feature.properties);
  } catch (error) {
    logger.error('Error fetching companies:', error);

    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'TimeoutError') {
      notifySystemError(
        `Request timeout while fetching data for ${city}. The dataset might be too large.`,
      );
    }

    // Return empty array instead of throwing to prevent app from breaking
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
  const apiUrl = `${BASE_URL}/api/v1/cities`;

  logger.info(`Fetching cities from URL: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      logger.error(`Failed to fetch cities: Status ${response.status} - ${response.statusText}`);
      throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
    }

    const cities = await response.json();
    logger.info(`Successfully fetched ${cities.length} cities`);
    return cities;
  } catch (error) {
    logger.error('Error fetching cities:', error);

    // Show more details about the error only in development
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      logger.debug('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
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
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: FALLBACK_CITIES,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
    enabled: !!city,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
