import type { FilteredBusinessParams } from '@/features/dashboard/types/table';
import { applyAllFilters } from '@/features/dashboard/utils/filters.utils';
import { useMemo } from 'react';

/**
 * useFilteredBusinesses
 * Filters and sorts a list of businesses based on name, industry, distance, and sort descriptor.
 * Uses the centralized filtering utilities for consistent behavior.
 */
export function useFilteredBusinesses({
  data,
  searchTerm,
  selectedIndustries,
  userLocation,
  distanceLimit,
  sortDescriptor,
  isFetching,
}: FilteredBusinessParams) {
  return useMemo(() => {
    if (!data || isFetching) return [];

    // Use the centralized filtering function
    return applyAllFilters(data, {
      searchTerm,
      selectedIndustries,
      userLocation,
      distanceLimit,
      sortDescriptor,
    });
  }, [
    data,
    searchTerm,
    selectedIndustries,
    userLocation,
    distanceLimit,
    sortDescriptor,
    isFetching,
  ]);
}
