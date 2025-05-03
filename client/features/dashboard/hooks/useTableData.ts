'use client';

import type { CompanyProperties, SortDescriptor } from '@/features/dashboard/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseTableDataProps {
  data: CompanyProperties[];
  pageSize: number;
  searchTerm: string;
  sortDescriptor: SortDescriptor;
}

interface UseTableDataResult {
  currentPage: number;
  totalPages: number;
  paginatedData: CompanyProperties[];
  isLoading: boolean;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  sortedData: CompanyProperties[];
  filteredData: CompanyProperties[];
}

/**
 * Hook for handling table data operations:
 * - Filtering by search term
 * - Sorting by column
 * - Pagination
 */
export function useTableData({
  data,
  pageSize: initialPageSize,
  searchTerm,
  sortDescriptor,
}: UseTableDataProps): UseTableDataResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(false);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Reset to page 1 when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Apply search filter
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return data.filter((item) => {
      // Search in all text fields
      return (
        item.company_name?.toLowerCase().includes(lowercaseSearchTerm) ||
        item.business_id?.toLowerCase().includes(lowercaseSearchTerm) ||
        item.industry_description?.toLowerCase().includes(lowercaseSearchTerm) ||
        item.industry?.toLowerCase().includes(lowercaseSearchTerm) ||
        item.addresses?.['Visiting address']?.street?.toLowerCase().includes(lowercaseSearchTerm) ||
        item.addresses?.['Visiting address']?.city?.toLowerCase().includes(lowercaseSearchTerm)
      );
    });
  }, [data, searchTerm]);

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    if (!sortDescriptor.column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = sortDescriptor.column;
      const direction = sortDescriptor.direction;

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
  }, [filteredData, sortDescriptor]);

  // Calculate pagination
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedData.length / pageSize));
  }, [sortedData.length, pageSize]);

  // If current page is beyond total pages, adjust it
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Get paginated data slice
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handle loading states
  useEffect(() => {
    // Simulate loading during filtering and sorting
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Page change handler with validation
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages],
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
  };
}
