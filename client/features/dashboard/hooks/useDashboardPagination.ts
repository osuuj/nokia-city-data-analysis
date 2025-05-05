'use client';

import { useMemo } from 'react';

export interface PaginationProps<T> {
  /** The table rows to paginate */
  tableRows?: T[] | null | undefined;
  /** The current page number */
  currentPage: number;
  /** The number of items per page */
  pageSize: number;
  /** Function to set the current page */
  setCurrentPage: (page: number) => void;
}

/**
 * Hook to manage pagination for dashboard data
 */
export function useDashboardPagination<T>({
  tableRows,
  currentPage,
  pageSize,
  setCurrentPage,
}: PaginationProps<T>) {
  // Calculate the total number of pages
  const totalPages = useMemo(() => {
    if (!tableRows || !tableRows.length) return 0;
    return Math.ceil(tableRows.length / pageSize);
  }, [tableRows, pageSize]);

  // Get the paginated data for the current page
  const paginated = useMemo(() => {
    if (!tableRows) return [];

    // Ensure current page is valid
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      return [];
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return tableRows.slice(start, end);
  }, [tableRows, currentPage, pageSize, totalPages, setCurrentPage]);

  return {
    paginated,
    totalPages,
  };
}
