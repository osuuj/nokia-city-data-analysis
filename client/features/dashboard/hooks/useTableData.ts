'use client';

import type {
  CompanyProperties,
  CompanyTableKey,
  SortDescriptor,
} from '@/features/dashboard/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Interface for useTableData props
 */
interface UseTableDataProps {
  /** Company data to display in the table */
  data: CompanyProperties[];
  /** Initial number of items per page */
  pageSize?: number;
  /** Search term for filtering the table */
  searchTerm?: string;
  /** Initial sort configuration */
  sortDescriptor?: SortDescriptor;
  /** Industry filter for the table */
  industryFilter?: string | null;
  /** Whether to use the URL for state persistence */
  useUrlParams?: boolean;
}

/**
 * Available column sorting options
 */
export type AvailableSortColumns =
  | 'company_name'
  | 'business_id'
  | 'industry'
  | 'street'
  | 'city'
  | 'postal_code'
  | 'main_business_line_description'
  | 'employee_count'
  | 'registration_date';

/**
 * Filter configuration for the table
 */
interface TableFilter {
  type: 'industry' | 'city' | 'employeeCount' | 'registrationYear';
  value: string | number | [number, number] | null;
}

/**
 * Interface for useTableData result
 */
interface UseTableDataResult {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Paginated data for the current page */
  paginatedData: CompanyProperties[];
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Function to set the current page */
  setCurrentPage: (page: number) => void;
  /** Function to set the page size */
  setPageSize: (size: number) => void;
  /** Sorted data (before pagination) */
  sortedData: CompanyProperties[];
  /** Filtered data (before sorting and pagination) */
  filteredData: CompanyProperties[];
  /** Function to update the sort descriptor */
  updateSortDescriptor: (descriptor: SortDescriptor) => void;
  /** Current sort descriptor */
  currentSortDescriptor: SortDescriptor;
  /** Available sort columns */
  availableSortColumns: AvailableSortColumns[];
  /** Available industry options */
  availableIndustries: string[];
  /** Available city options */
  availableCities: string[];
  /** Current active filters */
  activeFilters: TableFilter[];
  /** Function to add a filter */
  addFilter: (filter: TableFilter) => void;
  /** Function to remove a filter */
  removeFilter: (filterType: TableFilter['type']) => void;
  /** Function to clear all filters */
  clearAllFilters: () => void;
  /** Whether an export is in progress */
  isExporting: boolean;
  /** Function to export the current data */
  exportData: (format: 'csv' | 'excel') => Promise<void>;
  /** Error message if present */
  error: Error | null;
  /** Total row count (before pagination) */
  totalRowCount: number;
  /** Row selection state */
  selectedRows: Set<string>;
  /** Function to toggle row selection */
  toggleRowSelection: (rowId: string) => void;
  /** Function to select all rows */
  selectAllRows: () => void;
  /** Function to clear row selection */
  clearRowSelection: () => void;
}

/**
 * Hook for handling table data operations:
 * - Filtering by search term and other criteria
 * - Sorting by column
 * - Pagination
 * - Data export
 * - Row selection
 * - URL state persistence
 *
 * @param props Configuration props for the table data
 * @returns Table data state and functions
 */
export function useTableData({
  data,
  pageSize: initialPageSize = 10,
  searchTerm: initialSearchTerm = '',
  sortDescriptor: initialSortDescriptor = { column: 'company_name', direction: 'asc' },
  industryFilter: initialIndustryFilter = null,
  useUrlParams = false,
}: UseTableDataProps): UseTableDataResult {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // State for sorting and filtering
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [currentSortDescriptor, setCurrentSortDescriptor] =
    useState<SortDescriptor>(initialSortDescriptor);
  const [activeFilters, setActiveFilters] = useState<TableFilter[]>([]);

  // State for exporting
  const [isExporting, setIsExporting] = useState(false);

  // State for row selection
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Extract available sort columns
  const availableSortColumns: AvailableSortColumns[] = useMemo(
    () => [
      'company_name',
      'business_id',
      'industry',
      'street',
      'city',
      'postal_code',
      'main_business_line_description',
      'employee_count',
      'registration_date',
    ],
    [],
  );

  // Extract available filter options from data
  const availableIndustries = useMemo(() => {
    const industries = new Set<string>();

    for (const company of data) {
      if (company.industry) {
        industries.add(company.industry);
      }
    }

    return Array.from(industries).sort();
  }, [data]);

  const availableCities = useMemo(() => {
    const cities = new Set<string>();

    for (const company of data) {
      const city = company.addresses?.['Visiting address']?.city;
      if (city) {
        cities.add(city);
      }
    }

    return Array.from(cities).sort();
  }, [data]);

  // Initialize URL parameters if enabled
  useEffect(() => {
    if (!useUrlParams) return;

    try {
      const url = new URL(window.location.href);

      // Get page from URL
      const pageParam = url.searchParams.get('page');
      if (pageParam && !Number.isNaN(Number(pageParam))) {
        setCurrentPage(Number(pageParam));
      }

      // Get page size from URL
      const pageSizeParam = url.searchParams.get('pageSize');
      if (pageSizeParam && !Number.isNaN(Number(pageSizeParam))) {
        setPageSize(Number(pageSizeParam));
      }

      // Get search term from URL
      const searchParam = url.searchParams.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
      }

      // Get sort from URL
      const sortColumn = url.searchParams.get('sortColumn');
      const sortDirection = url.searchParams.get('sortDirection');
      if (sortColumn && (sortDirection === 'asc' || sortDirection === 'desc')) {
        setCurrentSortDescriptor({
          column: sortColumn as CompanyTableKey,
          direction: sortDirection,
        });
      }

      // Get industry filter from URL
      const industry = url.searchParams.get('industry');
      if (industry) {
        setActiveFilters((prev) => [
          ...prev.filter((f) => f.type !== 'industry'),
          { type: 'industry', value: industry },
        ]);
      }
    } catch (err) {
      console.error('Error parsing URL parameters:', err);
    }
  }, [useUrlParams]);

  // Update URL when parameters change
  useEffect(() => {
    if (!useUrlParams) return;

    try {
      const url = new URL(window.location.href);

      // Update page in URL
      url.searchParams.set('page', currentPage.toString());

      // Update page size in URL
      url.searchParams.set('pageSize', pageSize.toString());

      // Update search term in URL
      if (searchTerm) {
        url.searchParams.set('search', searchTerm);
      } else {
        url.searchParams.delete('search');
      }

      // Update sort in URL
      if (currentSortDescriptor.column) {
        url.searchParams.set('sortColumn', currentSortDescriptor.column);
        url.searchParams.set('sortDirection', currentSortDescriptor.direction);
      }

      // Update industry filter in URL
      const industryFilter = activeFilters.find((f) => f.type === 'industry');
      if (industryFilter && typeof industryFilter.value === 'string') {
        url.searchParams.set('industry', industryFilter.value);
      } else {
        url.searchParams.delete('industry');
      }

      // Update URL without page reload
      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      console.error('Error updating URL parameters:', err);
    }
  }, [currentPage, pageSize, searchTerm, currentSortDescriptor, activeFilters, useUrlParams]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Apply all filters to data
  const filteredData = useMemo(() => {
    setIsLoading(true);

    try {
      let filtered = [...data];

      // Apply search filter
      if (searchTerm) {
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter((item) => {
          // Search in all text fields
          return (
            item.company_name?.toLowerCase().includes(lowercaseSearchTerm) ||
            item.business_id?.toLowerCase().includes(lowercaseSearchTerm) ||
            item.industry_description?.toLowerCase().includes(lowercaseSearchTerm) ||
            item.industry?.toLowerCase().includes(lowercaseSearchTerm) ||
            item.addresses?.['Visiting address']?.street
              ?.toLowerCase()
              .includes(lowercaseSearchTerm) ||
            item.addresses?.['Visiting address']?.city?.toLowerCase().includes(lowercaseSearchTerm)
          );
        });
      }

      // Apply active filters
      if (activeFilters.length > 0) {
        filtered = filtered.filter((item) => {
          // Check each filter
          return activeFilters.every((filter) => {
            switch (filter.type) {
              case 'industry':
                return item.industry === filter.value;

              case 'city':
                return item.addresses?.['Visiting address']?.city === filter.value;

              case 'employeeCount':
                if (Array.isArray(filter.value) && filter.value.length === 2) {
                  const [min, max] = filter.value;
                  const count = Number((item as CompanyProperties).employee_count) || 0;
                  return count >= min && count <= max;
                }
                return true;

              case 'registrationYear':
                if (typeof filter.value === 'number') {
                  const registrationDate = item.registration_date
                    ? new Date(item.registration_date)
                    : null;
                  return registrationDate?.getFullYear() === filter.value;
                }
                return true;

              default:
                return true;
            }
          });
        });
      }

      return filtered;
    } catch (err) {
      console.error('Error filtering data:', err);
      setError(err instanceof Error ? err : new Error('Error filtering data'));
      return data; // Return original data on error
    } finally {
      // Simulate a short delay before removing loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [data, searchTerm, activeFilters]);

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    if (!currentSortDescriptor.column) return filteredData;

    try {
      return [...filteredData].sort((a, b) => {
        const column = currentSortDescriptor.column;
        const direction = currentSortDescriptor.direction;

        // Get values for comparison
        let valueA: string | number | boolean | object | null | undefined =
          a[column as keyof CompanyProperties];
        let valueB: string | number | boolean | object | null | undefined =
          b[column as keyof CompanyProperties];

        // Handle special cases like addresses
        if (
          column === 'street' ||
          column === 'building_number' ||
          column === 'postal_code' ||
          column === 'city'
        ) {
          valueA =
            a.addresses?.['Visiting address']?.[
              column as keyof (typeof a.addresses)['Visiting address']
            ] || '';
          valueB =
            b.addresses?.['Visiting address']?.[
              column as keyof (typeof b.addresses)['Visiting address']
            ] || '';
        }

        // Handle date fields
        if (column === 'registration_date') {
          const dateA = valueA ? new Date(valueA.toString()).getTime() : 0;
          const dateB = valueB ? new Date(valueB.toString()).getTime() : 0;

          if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
            // Fall back to string comparison if dates are invalid
            valueA = valueA?.toString() || '';
            valueB = valueB?.toString() || '';
          } else {
            return direction === 'asc' ? dateA - dateB : dateB - dateA;
          }
        }

        // Handle numeric fields
        if (column === ('employee_count' as CompanyTableKey)) {
          const numA = Number(valueA) || 0;
          const numB = Number(valueB) || 0;
          return direction === 'asc' ? numA - numB : numB - numA;
        }

        // Convert to lowercase strings for string comparison
        if (valueA && valueB && typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        // Handle null/undefined values (sort them to the end)
        if (valueA === null || valueA === undefined) return direction === 'asc' ? 1 : -1;
        if (valueB === null || valueB === undefined) return direction === 'asc' ? -1 : 1;

        // Perform the comparison
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    } catch (err) {
      console.error('Error sorting data:', err);
      setError(err instanceof Error ? err : new Error('Error sorting data'));
      return filteredData; // Return filtered but unsorted data on error
    }
  }, [filteredData, currentSortDescriptor]);

  // Calculate pagination
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedData.length / pageSize));
  }, [sortedData.length, pageSize]);

  // Total row count
  const totalRowCount = useMemo(() => {
    return sortedData.length;
  }, [sortedData]);

  // If current page is beyond total pages, adjust it
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Get paginated data slice
  const paginatedData = useMemo(() => {
    try {
      const startIndex = (currentPage - 1) * pageSize;
      return sortedData.slice(startIndex, startIndex + pageSize);
    } catch (err) {
      console.error('Error paginating data:', err);
      setError(err instanceof Error ? err : new Error('Error paginating data'));
      return []; // Return empty array on error
    }
  }, [sortedData, currentPage, pageSize]);

  // Page change handler with validation
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages],
  );

  // Update sort descriptor
  const updateSortDescriptor = useCallback((descriptor: SortDescriptor) => {
    setCurrentSortDescriptor(descriptor);
  }, []);

  // Filter management
  const addFilter = useCallback((filter: TableFilter) => {
    setActiveFilters((prev) => [
      // Remove any existing filter of the same type
      ...prev.filter((f) => f.type !== filter.type),
      filter,
    ]);
  }, []);

  const removeFilter = useCallback((filterType: TableFilter['type']) => {
    setActiveFilters((prev) => prev.filter((f) => f.type !== filterType));
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
    setSearchTerm('');
  }, []);

  // Row selection
  const toggleRowSelection = useCallback((rowId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  const selectAllRows = useCallback(() => {
    const allIds = sortedData.map((row) => row.business_id || '').filter(Boolean);
    setSelectedRows(new Set(allIds));
  }, [sortedData]);

  const clearRowSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  // Data export functionality
  const exportData = useCallback(
    async (format: 'csv' | 'excel') => {
      setIsExporting(true);
      setError(null);

      try {
        // This would normally call a service to handle the export
        // For now we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Export logic would go here
        const dataToExport =
          selectedRows.size > 0
            ? sortedData.filter((row) => row.business_id && selectedRows.has(row.business_id))
            : sortedData;

        console.log(`Exporting ${dataToExport.length} rows in ${format} format`);

        // Simulate successful export
        return Promise.resolve();
      } catch (err) {
        console.error('Error exporting data:', err);
        setError(err instanceof Error ? err : new Error('Error exporting data'));
        return Promise.reject(err);
      } finally {
        setIsExporting(false);
      }
    },
    [sortedData, selectedRows],
  );

  return {
    currentPage,
    totalPages,
    paginatedData,
    isLoading,
    setCurrentPage: handlePageChange,
    setPageSize,
    sortedData,
    filteredData,
    updateSortDescriptor,
    currentSortDescriptor,
    availableSortColumns,
    availableIndustries,
    availableCities,
    activeFilters,
    addFilter,
    removeFilter,
    clearAllFilters,
    isExporting,
    exportData,
    error,
    totalRowCount,
    selectedRows,
    toggleRowSelection,
    selectAllRows,
    clearRowSelection,
  };
}
