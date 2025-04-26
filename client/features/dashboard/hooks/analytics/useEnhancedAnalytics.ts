import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiError, ApiResponse } from '@/shared/api/types';
import { useApiQuery } from '@/shared/hooks/api/useApi';
import type { UseQueryOptions } from '@tanstack/react-query';

// Types for analytics responses
interface TopCity {
  id: string;
  name: string;
  score: number;
  rank: number;
}

interface IndustryDistribution {
  industryId: string;
  industryName: string;
  percentage: number;
  count: number;
}

interface IndustryByCity {
  cityId: string;
  cityName: string;
  industries: {
    industryId: string;
    industryName: string;
    count: number;
  }[];
}

interface CityComparison {
  cityId: string;
  cityName: string;
  metrics: {
    name: string;
    value: number;
  }[];
}

// Cache time constants
const STALE_TIME = 1000 * 60 * 10; // 10 minutes
const GC_TIME = 1000 * 60 * 30; // 30 minutes

// Common query options type
type QueryOptions<TData> = Omit<
  UseQueryOptions<ApiResponse<TData>, ApiError, ApiResponse<TData>>,
  'queryKey' | 'queryFn'
>;

/**
 * Hook for fetching top cities data with enhanced error handling and caching
 */
export const useTopCitiesEnhanced = (enabled = true) => {
  return useApiQuery<TopCity[]>(
    ['analytics', 'topCities'],
    API_ENDPOINTS.ANALYTICS.TOP_CITIES,
    undefined,
    {
      enabled,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      onError: (error: ApiError) => {
        console.error('Failed to fetch top cities:', error);
        // Here you can add custom error handling like showing a toast notification
      },
    } as QueryOptions<TopCity[]>,
  );
};

/**
 * Hook for fetching industry distribution data with enhanced error handling and caching
 */
export const useIndustryDistributionEnhanced = (selectedCities: string[], enabled = true) => {
  return useApiQuery<IndustryDistribution[]>(
    ['analytics', 'industryDistribution', selectedCities],
    API_ENDPOINTS.ANALYTICS.INDUSTRY_DISTRIBUTION,
    {
      params: {
        cities: selectedCities.join(','),
      },
    },
    {
      enabled: enabled && selectedCities.length > 0,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      onError: (error: ApiError) => {
        console.error('Failed to fetch industry distribution:', error);
      },
    } as QueryOptions<IndustryDistribution[]>,
  );
};

/**
 * Hook for fetching industries by city data with enhanced error handling and caching
 */
export const useIndustriesByCityEnhanced = (selectedCities: string[], enabled = true) => {
  return useApiQuery<IndustryByCity[]>(
    ['analytics', 'industriesByCity', selectedCities],
    API_ENDPOINTS.ANALYTICS.INDUSTRIES_BY_CITY,
    {
      params: {
        cities: selectedCities.join(','),
      },
    },
    {
      enabled: enabled && selectedCities.length > 0,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      onError: (error: ApiError) => {
        console.error('Failed to fetch industries by city:', error);
      },
    } as QueryOptions<IndustryByCity[]>,
  );
};

/**
 * Hook for fetching city comparison data with enhanced error handling and caching
 */
export const useCityComparisonEnhanced = (selectedCities: string[], enabled = true) => {
  return useApiQuery<CityComparison[]>(
    ['analytics', 'cityComparison', selectedCities],
    API_ENDPOINTS.ANALYTICS.CITY_COMPARISON,
    {
      params: {
        cities: selectedCities.join(','),
      },
    },
    {
      enabled: enabled && selectedCities.length >= 2,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      onError: (error: ApiError) => {
        console.error('Failed to fetch city comparison:', error);
      },
    } as QueryOptions<CityComparison[]>,
  );
};
