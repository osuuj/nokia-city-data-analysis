import { API_ENDPOINTS } from '@shared/api';
import { useEnhancedQuery } from '@shared/hooks/data/useEnhancedQuery';
import type { TopCityData } from './useAnalytics';

/**
 * Hook to fetch top cities data with enhanced caching and error handling
 *
 * @param selectedCities - Array of selected city names
 * @param selectedIndustries - Array of selected industry codes
 * @returns Query result with top cities data
 */
export function useTopCitiesEnhanced(selectedCities: string[], selectedIndustries: string[]) {
  return useEnhancedQuery<TopCityData[]>(
    ['top-cities', selectedCities, selectedIndustries],
    API_ENDPOINTS.ANALYTICS.TOP_CITIES,
    {
      params: {
        cities: selectedCities.join(','),
        industries: selectedIndustries.join(','),
      },
    },
    {
      enabled: selectedCities.length > 0,
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  );
}

/**
 * Hook to fetch industry distribution data with enhanced caching and error handling
 *
 * @param selectedCities - Array of selected city names
 * @param selectedIndustries - Array of selected industry codes
 * @returns Query result with industry distribution data
 */
export function useIndustryDistributionEnhanced(
  selectedCities: string[],
  selectedIndustries: string[],
) {
  return useEnhancedQuery(
    ['industry-distribution', selectedCities, selectedIndustries],
    API_ENDPOINTS.ANALYTICS.INDUSTRY_DISTRIBUTION,
    {
      params: {
        cities: selectedCities.join(','),
        industries: selectedIndustries.join(','),
      },
    },
    {
      enabled: selectedCities.length > 0,
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  );
}

/**
 * Hook to fetch industries by city data with enhanced caching and error handling
 *
 * @param selectedCities - Array of selected city names
 * @param selectedIndustries - Array of selected industry codes
 * @returns Query result with industries by city data
 */
export function useIndustriesByCityEnhanced(
  selectedCities: string[],
  selectedIndustries: string[],
) {
  return useEnhancedQuery(
    ['industries-by-city', selectedCities, selectedIndustries],
    API_ENDPOINTS.ANALYTICS.INDUSTRIES_BY_CITY,
    {
      params: {
        cities: selectedCities.join(','),
        industries: selectedIndustries.join(','),
      },
    },
    {
      enabled: selectedCities.length > 0,
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  );
}

/**
 * Hook to fetch city comparison data with enhanced caching and error handling
 *
 * @param selectedCities - Array of selected city names
 * @param selectedIndustries - Array of selected industry codes
 * @returns Query result with city comparison data
 */
export function useCityComparisonEnhanced(selectedCities: string[], selectedIndustries: string[]) {
  return useEnhancedQuery(
    ['city-comparison', selectedCities, selectedIndustries],
    API_ENDPOINTS.ANALYTICS.CITY_COMPARISON,
    {
      params: {
        cities: selectedCities.join(','),
        industries: selectedIndustries.join(','),
      },
    },
    {
      enabled: selectedCities.length > 0,
      staleTime: 1000 * 60 * 10, // 10 minutes
    },
  );
}
