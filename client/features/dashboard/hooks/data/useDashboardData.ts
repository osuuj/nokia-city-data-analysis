import type { CompanyProperties, SortDescriptor } from '@/features/dashboard/types';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { getVisibleColumns } from '@/features/dashboard/utils/table';
import { useOptimizedFetch } from '@/shared/hooks/useOptimizedFetch';
import { columns as allColumns } from '@shared/config';
import type { FeatureCollection, Point } from 'geojson';
import { useMemo } from 'react';
import { useFilteredBusinesses } from './useFilteredBusinesses';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Custom hook for fetching and processing dashboard data
 * Centralizes data fetching, filtering, and transformation logic
 * Uses optimized fetching with debouncing and caching
 */
export function useDashboardData({
  selectedCity,
  selectedIndustries,
  userLocation,
  distanceLimit,
  query,
}: {
  selectedCity: string;
  selectedIndustries: string[];
  userLocation: { latitude: number; longitude: number } | null;
  distanceLimit: number | null;
  query: string;
}) {
  // Fetch GeoJSON data for the selected city with optimized fetching
  const {
    data: geojsonData,
    isLoading: isFetching,
    error: geojsonError,
    refetch: refetchGeojson,
  } = useOptimizedFetch<FeatureCollection<Point, CompanyProperties>>(
    selectedCity
      ? `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(selectedCity)}`
      : null,
    {
      debounceDelay: 300,
      maxWait: 1000,
      cacheTime: 60000, // Cache for 1 minute
      deps: [selectedCity],
    },
  );

  // Fetch cities list with optimized fetching and longer cache time
  const {
    data: cities = [],
    isLoading: cityLoading,
    error: citiesError,
    refetch: refetchCities,
  } = useOptimizedFetch<string[]>(`${BASE_URL}/api/v1/cities`, {
    debounceDelay: 500,
    maxWait: 2000,
    cacheTime: 300000, // Cache for 5 minutes
  });

  // Process table rows from GeoJSON data
  const tableRows = useMemo(() => {
    const seen = new Set<string>();

    return (
      geojsonData?.features
        ?.map((f) => f.properties)
        .filter((row) => {
          const visiting = row.addresses?.['Visiting address'];
          const postal = row.addresses?.['Postal address'];
          const hasValidAddress =
            (visiting?.latitude && visiting?.longitude) || (postal?.latitude && postal?.longitude);

          if (!hasValidAddress) return false;

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

  return {
    geojsonData,
    cities,
    isLoading: isFetching,
    cityLoading,
    tableRows,
    visibleColumns,
    handleCityChange,
    errors: {
      geojson: geojsonError,
      cities: citiesError,
    },
    refetch: {
      geojson: refetchGeojson,
      cities: refetchCities,
    },
  };
}
