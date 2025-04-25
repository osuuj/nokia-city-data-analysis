import type { CompanyTableKey, FilteredBusinessParams } from '@/features/dashboard/types';
import { getDistanceInKm } from '@/features/dashboard/utils/geo';
import { useMemo } from 'react';

/**
 * useFilteredBusinesses
 * Filters and sorts a list of businesses based on name, industry, distance, and sort descriptor.
 * Optimized to use a single pass through the data for filtering.
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

    // Prepare search term once
    const searchTermLower = searchTerm.toLowerCase();
    const hasSearchTerm = searchTermLower.length > 0;
    const hasIndustryFilter = selectedIndustries.length > 0;
    const hasDistanceFilter = userLocation && distanceLimit != null;
    const { column, direction } = sortDescriptor;

    // Single pass through data for filtering
    const filtered = data.filter((item) => {
      // Search term filter
      if (hasSearchTerm && !item.company_name.toLowerCase().includes(searchTermLower)) {
        return false;
      }

      // Industry filter
      if (hasIndustryFilter && !selectedIndustries.includes(item.industry_letter ?? '')) {
        return false;
      }

      // Distance filter
      if (hasDistanceFilter) {
        const visiting = item.addresses?.['Visiting address'];
        if (!visiting) return false;

        const distance = getDistanceInKm(userLocation, {
          latitude: visiting.latitude,
          longitude: visiting.longitude,
        });

        if (distance > distanceLimit) return false;
      }

      return true;
    });

    // Sort the filtered data
    return filtered.sort((a, b) => {
      const aVal = column in a ? String(a[column as keyof typeof a] ?? '') : '';
      const bVal = column in b ? String(b[column as keyof typeof b] ?? '') : '';
      const comparison = aVal.localeCompare(bVal);
      return direction === 'desc' ? -comparison : comparison;
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
