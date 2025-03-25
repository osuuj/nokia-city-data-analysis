import type { FilteredBusinessParams } from '@/types/table';
import { getDistanceInKm } from '@/utils/geo';
import { useMemo } from 'react';

/**
 * useFilteredBusinesses
 * Filters and sorts a list of businesses based on various criteria.
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

    // 🔍 Filter by name
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.company_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 🏭 Filter by industry
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((item) => selectedIndustries.includes(item.industry_letter ?? ''));
    }

    // 📍 Filter by distance (optional)
    if (userLocation && distanceLimit != null) {
      filtered = filtered.filter((item) => {
        const latRaw =
          (item as Record<string, unknown>).latitude ??
          (item as Record<string, unknown>).latitude_wgs84;

        const lonRaw =
          (item as Record<string, unknown>).longitude ??
          (item as Record<string, unknown>).longitude_wgs84;

        const lat =
          typeof latRaw === 'string'
            ? Number.parseFloat(latRaw)
            : typeof latRaw === 'number'
              ? latRaw
              : Number.NaN;

        const lon =
          typeof lonRaw === 'string'
            ? Number.parseFloat(lonRaw)
            : typeof lonRaw === 'number'
              ? lonRaw
              : Number.NaN;

        if (Number.isNaN(lat) || Number.isNaN(lon)) return false;

        const distance = getDistanceInKm(userLocation, { latitude: lat, longitude: lon });
        return distance <= distanceLimit;
      });
    }

    // 🔀 Sort by column
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
