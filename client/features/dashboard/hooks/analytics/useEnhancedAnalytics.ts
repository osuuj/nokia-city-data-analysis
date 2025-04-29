import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { createQueryKey, useApiQuery } from '@/shared/hooks/api';
import { CACHE_CONFIG } from '../../config/cache';
import type {
  PivotedData as CityComparison,
  PivotedData as IndustryByCity,
  DistributionDataRaw as IndustryDistribution,
  TopCityData as TopCity,
} from './types';

// These types should match what's expected by the useApiQuery hook
interface AnalyticsQueryOptions<T> {
  enabled: boolean;
  staleTime: number;
  gcTime: number;
  onError?: (error: Error & { status?: number; data?: unknown }) => void;
}

interface ApiRequestConfig {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  data?: unknown;
}

/**
 * Hook for fetching top cities data with enhanced error handling and caching
 */
export const useTopCitiesEnhanced = (enabled = true) => {
  return useApiQuery<TopCity[]>(
    createQueryKey('topCities'),
    API_ENDPOINTS.ANALYTICS.TOP_CITIES,
    undefined,
    {
      enabled,
      staleTime: CACHE_CONFIG.ANALYTICS.STALE_TIME,
      gcTime: CACHE_CONFIG.ANALYTICS.GC_TIME,
      onError: (error) => {
        console.error('Failed to fetch top cities:', error);
        // Here you can add custom error handling like showing a toast notification
      },
    } as AnalyticsQueryOptions<TopCity[]>,
  );
};

/**
 * Hook for fetching industry distribution data with enhanced error handling and caching
 */
export const useIndustryDistributionEnhanced = (selectedCities: string[], enabled = true) => {
  return useApiQuery<IndustryDistribution[]>(
    createQueryKey('industryDistribution', { cities: selectedCities }),
    API_ENDPOINTS.ANALYTICS.INDUSTRY_DISTRIBUTION,
    {
      params: {
        cities: selectedCities.join(','),
      },
    } as ApiRequestConfig,
    {
      enabled: enabled && selectedCities.length > 0,
      staleTime: CACHE_CONFIG.ANALYTICS.STALE_TIME,
      gcTime: CACHE_CONFIG.ANALYTICS.GC_TIME,
      onError: (error) => {
        console.error('Failed to fetch industry distribution:', error);
      },
    } as AnalyticsQueryOptions<IndustryDistribution[]>,
  );
};

/**
 * Hook for fetching industries by city data with enhanced error handling and caching
 */
export const useIndustriesByCityEnhanced = (selectedCities: string[], enabled = true) => {
  return useApiQuery<IndustryByCity[]>(
    createQueryKey('industriesByCity', { cities: selectedCities }),
    '/api/v1/analytics/industries-by-city',
    {
      params: {
        cities: selectedCities.join(','),
      },
    } as ApiRequestConfig,
    {
      enabled: enabled && selectedCities.length > 0,
      staleTime: CACHE_CONFIG.ANALYTICS.STALE_TIME,
      gcTime: CACHE_CONFIG.ANALYTICS.GC_TIME,
      onError: (error) => {
        console.error('Failed to fetch industries by city:', error);
      },
    } as AnalyticsQueryOptions<IndustryByCity[]>,
  );
};

/**
 * Hook for fetching city comparison data with enhanced error handling and caching
 */
export const useCityComparisonEnhanced = (selectedCities: string[], enabled = true) => {
  return useApiQuery<CityComparison[]>(
    createQueryKey('cityComparison', { cities: selectedCities }),
    API_ENDPOINTS.ANALYTICS.CITY_COMPARISON,
    {
      params: {
        cities: selectedCities.join(','),
      },
    } as ApiRequestConfig,
    {
      enabled: enabled && selectedCities.length >= 2,
      staleTime: CACHE_CONFIG.ANALYTICS.STALE_TIME,
      gcTime: CACHE_CONFIG.ANALYTICS.GC_TIME,
      onError: (error) => {
        console.error('Failed to fetch city comparison:', error);
      },
    } as AnalyticsQueryOptions<CityComparison[]>,
  );
};
