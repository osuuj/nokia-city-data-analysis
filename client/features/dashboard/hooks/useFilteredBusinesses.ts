import type { CompanyTableKey, FilteredBusinessParams } from '@/features/dashboard/types';
import { useMemo } from 'react';
import { getDistanceInKm } from '../utils/geo';

/**
 * useFilteredBusinesses
 * Filters and sorts a list of businesses based on name, industry, distance, and sort descriptor.
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

    let filtered = [...data];

    // 🔍 Filter by company name
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => item.company_name.toLowerCase().includes(term));
    }

    // 🏭 Filter by industry
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((item) => selectedIndustries.includes(item.industry_letter ?? ''));
    }

    // 📍 Filter by geo distance (Visiting address only)
    if (userLocation && distanceLimit != null) {
      filtered = filtered.filter((item) => {
        const visiting = item.addresses?.['Visiting address'];
        if (!visiting) return false;

        const distance = getDistanceInKm(userLocation, {
          latitude: visiting.latitude,
          longitude: visiting.longitude,
        });

        return distance <= distanceLimit;
      });
    }

    // 🔀 Sort by table key (excluding derived address keys)
    const { column, direction } = sortDescriptor;

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
