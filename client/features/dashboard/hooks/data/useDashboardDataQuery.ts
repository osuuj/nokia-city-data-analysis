import type { CompanyProperties, SortDescriptor } from '@/features/dashboard/types';
import type { DashboardError } from '@/features/dashboard/types/common';
import {
  calculateRetryDelay,
  defaultRetryConfig,
  shouldRetry,
} from '@/features/dashboard/utils/errorHandling';
import { errorReporting } from '@/features/dashboard/utils/errorReporting';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { getVisibleColumns } from '@/features/dashboard/utils/table';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { createQueryKey, useApiQuery } from '@/shared/hooks/api';
import type { ApiError } from '@/shared/hooks/api/useApi';
import { columns as allColumns } from '@shared/config';
import type { FeatureCollection, Point } from 'geojson';
import { useCallback, useMemo } from 'react';
import { useFilteredBusinesses } from './useFilteredBusinesses';

// Query key factory for better type safety and reusability
const dashboardQueryKeys = {
  companies: (city: string, filters: Record<string, string | string[]>) => [
    'companies',
    'geojson',
    city,
    filters,
  ],
  cities: () => ['cities', 'list'],
  industries: () => ['industries', 'list'],
} as const;

// Paginated response type
interface PaginatedGeoJSONData extends FeatureCollection<Point, CompanyProperties> {
  hasMore: boolean;
  nextPage?: number;
}

/**
 * Custom hook for fetching and processing dashboard data using React Query
 * Centralizes data fetching, filtering, and transformation logic
 * Uses React Query for efficient caching and data management
 */
export function useDashboardDataQuery({
  selectedCity,
  selectedIndustries,
  userLocation,
  distanceLimit,
  query,
  page = 1,
  pageSize = 20,
}: {
  selectedCity: string;
  selectedIndustries: string[];
  userLocation: { latitude: number; longitude: number } | null;
  distanceLimit: number | null;
  query: string;
  page?: number;
  pageSize?: number;
}) {
  // Create filter object for query key
  const filters = useMemo(
    () => ({
      industries: selectedIndustries.join(','),
      location: userLocation ? `${userLocation.latitude},${userLocation.longitude}` : '',
      distance: distanceLimit?.toString() ?? '',
      search: query,
      page: String(page),
      pageSize: String(pageSize),
    }),
    [selectedIndustries, userLocation, distanceLimit, query, page, pageSize],
  );

  // Generate unique error IDs for each query
  const geojsonErrorId = useMemo(
    () => `geojson-${selectedCity}-${page}-${pageSize}`,
    [selectedCity, page, pageSize],
  );

  const citiesErrorId = useMemo(() => 'cities-list', []);

  // Custom retry function using error handling utilities
  const customRetry = useCallback((failureCount: number, error: Error) => {
    const apiError = error as ApiError;
    return shouldRetry(apiError, failureCount, defaultRetryConfig);
  }, []);

  // Fetch GeoJSON data for the selected city with React Query
  const {
    data: geojsonResponse,
    isLoading: isFetching,
    error: geojsonError,
    refetch: refetchGeojson,
  } = useApiQuery<PaginatedGeoJSONData>(
    dashboardQueryKeys.companies(selectedCity, filters),
    API_ENDPOINTS.GEOJSON,
    {
      params: {
        city: selectedCity,
        ...filters,
      },
    },
    {
      enabled: !!selectedCity,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
      retry: customRetry,
    },
  );

  // Extract the GeoJSON data from the response
  const geojsonData = geojsonResponse?.data;

  // Fetch cities list with React Query
  const {
    data: citiesResponse,
    isLoading: cityLoading,
    error: citiesError,
    refetch: refetchCities,
  } = useApiQuery<string[]>(
    dashboardQueryKeys.cities(),
    API_ENDPOINTS.CITIES,
    {},
    {
      staleTime: 1000 * 60 * 30, // Cache for 30 minutes
      gcTime: 1000 * 60 * 60, // Keep in garbage collection for 1 hour
      retry: customRetry,
      useErrorBoundary: false, // Don't throw errors to the error boundary
    },
  );

  // Extract cities from the response
  const cities = citiesResponse?.data || [];

  // Process table rows from GeoJSON data with memoization
  const tableRows = useMemo(() => {
    const seen = new Set<string>();

    return (
      geojsonData?.features
        ?.filter((f: { properties: CompanyProperties }) => f?.properties) // Ensure feature and properties exist
        .map((f: { properties: CompanyProperties }) => f.properties)
        .filter((row: CompanyProperties) => {
          // Check for valid address
          if (!row.addresses) {
            return false;
          }

          const visiting = row.addresses?.['Visiting address'];
          const postal = row.addresses?.['Postal address'];
          const hasValidAddress =
            (visiting?.latitude && visiting?.longitude) || (postal?.latitude && postal?.longitude);

          if (!hasValidAddress) return false;

          // Deduplicate by business ID
          if (seen.has(row.business_id)) return false;
          seen.add(row.business_id);
          return true;
        }) ?? []
    );
  }, [geojsonData]);

  // Get visible columns for the table
  const visibleColumns = useMemo(() => getVisibleColumns(allColumns), []);

  // Create a function to handle city changes
  const handleCityChange = (city: string) => {
    // This function will be implemented by the component using this hook
    return city;
  };

  // Handle errors with proper typing and error reporting
  const handleError = useCallback((error: unknown, context: string): DashboardError => {
    errorReporting.reportError(error, context, 'useDashboardDataQuery');

    // Return a default error if the reporting service doesn't return one
    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      status: error instanceof Error && 'status' in error ? (error as ApiError).status : undefined,
    };
  }, []);

  return {
    geojsonData,
    cities,
    isLoading: isFetching,
    cityLoading,
    tableRows,
    visibleColumns,
    handleCityChange,
    errors: {
      geojson: geojsonError ? handleError(geojsonError, 'GeoJSON data fetch error') : null,
      cities: citiesError ? handleError(citiesError, 'Cities data fetch error') : null,
    },
    errorIds: {
      geojson: geojsonErrorId,
      cities: citiesErrorId,
    },
    refetch: {
      geojson: refetchGeojson,
      cities: refetchCities,
    },
    pagination: {
      hasNextPage: geojsonData?.hasMore ?? false,
      currentPage: page,
      pageSize,
    },
  };
}
