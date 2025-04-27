import { API_ENDPOINTS } from '@shared/api';
import { createQueryKey, useApiQuery } from '@shared/hooks';

/**
 * City data type
 */
export interface City {
  id: string;
  name: string;
  country: string;
  population?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Hook to fetch all cities
 */
export function useCities() {
  return useApiQuery<City[]>('cities', API_ENDPOINTS.CITIES.LIST, undefined, {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch a specific city by ID
 */
export function useCity(id: string) {
  return useApiQuery<City>(createQueryKey('city', id), API_ENDPOINTS.CITIES.DETAIL(id), undefined, {
    enabled: !!id,
  });
}

/**
 * Hook to fetch city statistics
 */
export function useCityStatistics(id: string) {
  return useApiQuery<{
    totalCompanies: number;
    totalEmployees: number;
    industries: Record<string, number>;
    growthRate: number;
  }>(createQueryKey('city-statistics', id), API_ENDPOINTS.CITIES.STATISTICS(id), undefined, {
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
