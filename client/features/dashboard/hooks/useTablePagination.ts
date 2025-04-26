import { useCallback, useMemo, useState } from 'react';

interface UseTablePaginationProps<T> {
  data: T[];
  initialPageSize?: number;
  initialPage?: number;
}

interface UseTablePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: T[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  startItem: number;
  endItem: number;
  totalItems: number;
}

/**
 * Custom hook for handling table pagination
 *
 * @param data - The data to paginate
 * @param initialPageSize - The initial page size (default: 10)
 * @param initialPage - The initial page number (default: 1)
 * @returns Pagination state and handlers
 */
export function useTablePagination<T>({
  data,
  initialPageSize = 10,
  initialPage = 1,
}: UseTablePaginationProps<T>): UseTablePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / pageSize);
  }, [data.length, pageSize]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Calculate start and end items for display
  const startItem = useMemo(() => {
    return data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  }, [currentPage, pageSize, data.length]);

  const endItem = useMemo(() => {
    return Math.min(currentPage * pageSize, data.length);
  }, [currentPage, pageSize, data.length]);

  // Handle page change
  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle page size change
  const onPageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    // Reset to first page when changing page size
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    pageSize,
    paginatedData,
    onPageChange,
    onPageSizeChange,
    startItem,
    endItem,
    totalItems: data.length,
  };
}
