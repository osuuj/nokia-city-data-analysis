import type { CompanyProperties } from '@/features/dashboard/types/business';
import { useMemo } from 'react';

interface UseDashboardPaginationProps {
  tableRows: CompanyProperties[];
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
}

interface PaginationResult {
  paginated: CompanyProperties[];
  totalPages: number;
}

/**
 * Custom hook for managing dashboard pagination
 * Extracts pagination logic from DashboardPage.tsx
 */
export function useDashboardPagination({
  tableRows,
  currentPage,
  pageSize,
  setCurrentPage,
}: UseDashboardPaginationProps): PaginationResult {
  // Setup pagination with edge case handling
  return useMemo(() => {
    // Make sure we have data
    if (!tableRows || tableRows.length === 0) {
      // Don't log unless it's a development environment
      if (process.env.NODE_ENV === 'development') {
        // Only log if we truly have no data
        console.debug('No tableRows data, setting empty pagination');
      }
      return { paginated: [], totalPages: 1 };
    }

    // Calculate total pages
    const calculatedTotalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));

    // Ensure current page is valid (not greater than total pages)
    const validCurrentPage = Math.min(currentPage, calculatedTotalPages);

    // If current page changed, update it (but only if it's out of bounds)
    if (validCurrentPage !== currentPage) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Resetting current page from ${currentPage} to ${validCurrentPage}`);
      }
      // Use setTimeout to avoid state updates during render
      setTimeout(() => setCurrentPage(validCurrentPage), 0);
    }

    // Calculate start and end indices
    const startIndex = (validCurrentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, tableRows.length);

    // Create paginated data
    const paginatedData = tableRows.slice(startIndex, endIndex);

    // Only log in development and use debug level
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `Pagination: page ${validCurrentPage}/${calculatedTotalPages}, showing ${startIndex + 1 || 0}-${endIndex} of ${tableRows.length} items`,
      );
    }

    return {
      paginated: paginatedData,
      totalPages: calculatedTotalPages,
    };
  }, [tableRows, pageSize, currentPage, setCurrentPage]);
}
