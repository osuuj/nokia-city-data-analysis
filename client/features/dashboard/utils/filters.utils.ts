/**
 * Shared filtering utilities for the dashboard
 *
 * This file centralizes filtering logic used by both table.ts and the useFilteredBusinesses hook
 */

import { AddressTypeEnum, type Coordinates } from '@/features/dashboard/types/addressTypes';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor } from '@/features/dashboard/types/table';
import { getDistanceInKm } from './geo';

/**
 * Apply name search filter to a list of companies
 *
 * @param data Companies data to filter
 * @param searchTerm Search term to filter by
 * @returns Filtered companies list
 */
export function filterBySearchTerm(
  data: CompanyProperties[],
  searchTerm = '',
): CompanyProperties[] {
  if (!searchTerm || !searchTerm.trim()) {
    return data;
  }

  const term = searchTerm.toLowerCase().trim();
  return data.filter((item) => item.company_name.toLowerCase().includes(term));
}

/**
 * Filter companies by industry codes
 *
 * @param data Companies data to filter
 * @param selectedIndustries Array of industry letter codes
 * @returns Filtered companies list
 */
export function filterByIndustry(
  data: CompanyProperties[],
  selectedIndustries: string[] = [],
): CompanyProperties[] {
  if (!selectedIndustries.length) {
    return data;
  }

  return data.filter((item) => {
    const industry = item.industry_letter || '';
    return selectedIndustries.includes(industry);
  });
}

/**
 * Filter companies by distance from user location
 *
 * @param data Companies data to filter
 * @param userLocation User's coordinates
 * @param distanceLimit Maximum distance in kilometers
 * @returns Filtered companies list
 */
export function filterByDistance(
  data: CompanyProperties[],
  userLocation: Coordinates | null,
  distanceLimit: number | null,
): CompanyProperties[] {
  if (!userLocation || distanceLimit == null || distanceLimit <= 0) {
    return data;
  }

  return data.filter((item) => {
    // Prefer visiting address for distance calculations
    const visiting = item.addresses?.[AddressTypeEnum.VISITING];
    if (!visiting) return false;

    // Check for valid coordinates
    if (typeof visiting.latitude !== 'number' || typeof visiting.longitude !== 'number') {
      return false;
    }

    const distance = getDistanceInKm(userLocation, {
      latitude: visiting.latitude,
      longitude: visiting.longitude,
    });

    return distance <= distanceLimit;
  });
}

/**
 * Sort companies by a specified field and direction
 *
 * @param data Companies data to sort
 * @param sortDescriptor Sort column and direction
 * @returns Sorted companies list
 */
export function sortCompanies(
  data: CompanyProperties[],
  sortDescriptor: SortDescriptor,
): CompanyProperties[] {
  const { column, direction } = sortDescriptor;

  if (!column) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aVal = String(a[column as keyof typeof a] || '');
    const bVal = String(b[column as keyof typeof b] || '');

    const comparison = aVal.localeCompare(bVal);
    return direction === 'desc' ? -comparison : comparison;
  });
}

/**
 * Apply all filters and sorting to a dataset
 *
 * @param data Base dataset to filter
 * @param options Filtering options
 * @returns Filtered and sorted data
 */
export function applyAllFilters(
  data: CompanyProperties[] = [],
  options: {
    searchTerm?: string;
    selectedIndustries?: string[];
    userLocation?: Coordinates | null;
    distanceLimit?: number | null;
    sortDescriptor?: SortDescriptor;
  } = {},
): CompanyProperties[] {
  if (!data || !data.length) {
    return [];
  }

  const {
    searchTerm = '',
    selectedIndustries = [],
    userLocation = null,
    distanceLimit = null,
    sortDescriptor = { column: 'company_name', direction: 'asc' },
  } = options;

  // Apply filters in sequence
  let filteredData = [...data];

  // 1. Filter by search term
  filteredData = filterBySearchTerm(filteredData, searchTerm);

  // 2. Filter by industry
  filteredData = filterByIndustry(filteredData, selectedIndustries);

  // 3. Filter by distance
  filteredData = filterByDistance(filteredData, userLocation, distanceLimit);

  // 4. Apply sorting
  filteredData = sortCompanies(filteredData, sortDescriptor);

  return filteredData;
}
