'use client';

import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { FeatureCollection, Point } from 'geojson';
import { useApiGet } from './useReactQuery';

// Define types for API responses
type CitiesResponse = string[];
type CompaniesGeoJsonResponse = FeatureCollection<Point, CompanyProperties>;

/**
 * Hook for fetching the list of cities
 *
 * @example
 * const { data: cities, isLoading, error } = useCities();
 */
export function useCities() {
  return useApiGet<CitiesResponse>('/cities', undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: [], // Empty array fallback
  });
}

/**
 * Hook for fetching company data for a specific city
 *
 * @example
 * const { data: companies, isLoading, error } = useCompanies('Helsinki');
 */
export function useCompanies(city: string, enabled = !!city) {
  return useApiGet<CompaniesGeoJsonResponse>(
    '/geojson_companies/companies.geojson',
    { city },
    {
      enabled,
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      placeholderData: { type: 'FeatureCollection', features: [] },
    },
  );
}

/**
 * Extracts company properties from the GeoJSON response
 *
 * @example
 * const { data: companyProperties } = useCompanyProperties('Helsinki');
 */
export function useCompanyProperties(city: string, enabled = !!city) {
  const { data, ...rest } = useCompanies(city, enabled);

  // Extract and return just the properties from the GeoJSON features
  const companyProperties = data?.features.map((feature) => feature.properties) || [];

  return {
    ...rest,
    data: companyProperties,
  };
}
