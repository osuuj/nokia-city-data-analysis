import { ApiResponse } from '@/shared/api/types';
import { createQueryKey, useApiQuery } from '@/shared/hooks/api';
import { API_ENDPOINTS } from '@shared/api';
import type { DistributionDataRaw, PivotedData, TopCityData } from './types';

/**
 * Hook to fetch top cities data
 *
 * @param limit - The maximum number of cities to return (default: 10)
 * @returns Query result with top cities data
 */
export const useTopCities = (limit = 10) => {
  return useApiQuery<TopCityData[]>(
    createQueryKey('top-cities', { limit }),
    `${API_ENDPOINTS.ANALYTICS.TOP_CITIES}?limit=${limit}`,
  );
};

/**
 * Hook to fetch industry distribution data for selected cities
 *
 * @param cities - Array of city names to fetch data for
 * @returns Query result with industry distribution data
 */
export const useIndustryDistribution = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<DistributionDataRaw>(
    createQueryKey('industry-distribution', { cities }),
    `${API_ENDPOINTS.ANALYTICS.INDUSTRY_DISTRIBUTION}?cities=${encodeURIComponent(citiesParam)}`,
    undefined,
    {
      enabled: cities.length > 0,
    },
  );
};

/**
 * Hook to fetch industries by city data
 *
 * @param cities - Array of city names to fetch data for (max 5 cities)
 * @returns Query result with industries by city data
 */
export const useIndustriesByCity = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<PivotedData>(
    createQueryKey('industries-by-city', { cities }),
    `${API_ENDPOINTS.ANALYTICS.INDUSTRIES_BY_CITY}?cities=${encodeURIComponent(citiesParam)}`,
    undefined,
    {
      enabled: cities.length > 0 && cities.length <= 5,
    },
  );
};

/**
 * Hook to fetch city comparison data
 *
 * @param cities - Array of city names to compare (max 5 cities)
 * @returns Query result with city comparison data
 */
export const useCityComparison = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<PivotedData>(
    createQueryKey('city-comparison', { cities }),
    `${API_ENDPOINTS.ANALYTICS.CITY_COMPARISON}?cities=${encodeURIComponent(citiesParam)}`,
    undefined,
    {
      enabled: cities.length > 0 && cities.length <= 5,
    },
  );
};
