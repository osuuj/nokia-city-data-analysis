import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiError, ApiRequestConfig, ApiResponse } from '@/shared/api/types';
import { useApiQuery } from '@/shared/hooks/api/useApi';
import { CACHE_CONFIG } from '../../config/cache';
import type {
  AnalyticsQueryOptions,
  CityComparison,
  IndustryByCity,
  IndustryDistribution,
  TopCity,
} from '../../types/analytics';

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
      staleTime: CACHE_CONFIG.ANALYTICS.STALE_TIME,
      gcTime: CACHE_CONFIG.ANALYTICS.GC_TIME,
      onError: (error: ApiError) => {
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
    ['analytics', 'industryDistribution', selectedCities],
    API_ENDPOINTS.ANALYTICS.INDUSTRY_DISTRIBUTION,
    {
      url: API_ENDPOINTS.ANALYTICS.INDUSTRY_DISTRIBUTION,
      method: 'GET',
      params: {
        cities: selectedCities.join(','),
      },
    } as ApiRequestConfig,
    {
      enabled: enabled && selectedCities.length > 0,
      staleTime: CACHE_CONFIG.ANALYTICS.STALE_TIME,
      gcTime: CACHE_CONFIG.ANALYTICS.GC_TIME,
      onError: (error: ApiError) => {
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
    ['analytics', 'industriesByCity', selectedCities],
    API_ENDPOINTS.ANALYTICS.INDUSTRIES_BY_CITY,
    {
      url: API_ENDPOINTS.ANALYTICS.INDUSTRIES_BY_CITY,
      method: 'GET',
      params: {
        cities: selectedCities.join(','),
      },
    } as ApiRequestConfig,
    {
      enabled: enabled && selectedCities.length > 0,
      staleTime: CACHE_CONFIG.ANALYTICS.STALE_TIME,
      gcTime: CACHE_CONFIG.ANALYTICS.GC_TIME,
      onError: (error: ApiError) => {
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
    ['analytics', 'cityComparison', selectedCities],
    API_ENDPOINTS.ANALYTICS.CITY_COMPARISON,
    {
      url: API_ENDPOINTS.ANALYTICS.CITY_COMPARISON,
      method: 'GET',
      params: {
        cities: selectedCities.join(','),
      },
    } as ApiRequestConfig,
    {
      enabled: enabled && selectedCities.length >= 2,
      staleTime: CACHE_CONFIG.ANALYTICS.STALE_TIME,
      gcTime: CACHE_CONFIG.ANALYTICS.GC_TIME,
      onError: (error: ApiError) => {
        console.error('Failed to fetch city comparison:', error);
      },
    } as AnalyticsQueryOptions<CityComparison[]>,
  );
};
