import type { FilteredBusinessParams } from '@/types/table';
import { getDistanceInKm } from '@/utils/geo';
import { useMemo } from 'react';

/**
 * useFilteredBusinesses
 * Filters and sorts a list of businesses based on various criteria.
 *
 * @param data - The list of businesses to filter and sort.
 * @param searchTerm - The search string to match against company names.
 * @param selectedIndustries - The selected industry letters to filter by.
 * @param userLocation - Coordinates to filter by distance (if enabled).
 * @param distanceLimit - Max allowed distance in km from userLocation.
 * @param sortDescriptor - Determines which column and direction to sort by.
 * @param isFetching - Skip computation while data is loading.
 * @returns The filtered and sorted list of businesses.
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

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.company_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((item) => selectedIndustries.includes(item.industry_letter || ''));
    }

    if (userLocation && distanceLimit != null) {
      filtered = filtered.filter((item) => {
        if (!item.latitude_wgs84 || !item.longitude_wgs84) return false;
        const distance = getDistanceInKm(userLocation, {
          latitude: item.latitude_wgs84,
          longitude: item.longitude_wgs84,
        });
        return distance <= distanceLimit;
      });
    }

    return filtered.sort((a, b) => {
      const key = sortDescriptor.column;
      const valA = a[key] ?? '';
      const valB = b[key] ?? '';
      const comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDescriptor.direction === 'desc' ? -comparison : comparison;
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
