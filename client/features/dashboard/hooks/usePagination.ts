import { useMemo } from 'react';

/**
 * Custom hook for handling pagination functionality
 *
 * @param data The full dataset to paginate
 * @param currentPage The current page number (1-based)
 * @param rowsPerPage Number of items per page
 * @returns Object containing paginated data and total pages
 */
export function usePagination<T>(data: T[], currentPage: number, rowsPerPage: number) {
  return useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    const startIndex = (safePage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalItems);

    const paginated = data.slice(startIndex, endIndex);

    return {
      paginated,
      totalPages,
      startIndex,
      endIndex,
      totalItems,
    };
  }, [data, currentPage, rowsPerPage]);
}
