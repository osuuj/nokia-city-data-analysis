import { useEffect, useMemo, useRef } from 'react';

/**
 * A hook that paginates a data array into slices based on the current page and row count.
 * Enhanced version with performance optimizations for large datasets.
 *
 * @template T - The type of data being paginated
 * @param data - The full data array to paginate
 * @param page - The current page number (1-indexed)
 * @param rowsPerPage - How many rows to show per page
 * @param options - Optional configuration options
 * @param options.validateInput - Whether to validate input parameters (default: true)
 * @returns An object containing the paginated data slice, total page count, and pagination metadata
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { paginated, totalPages } = usePagination(data, currentPage, rowsPerPage);
 *
 * // With options
 * const { paginated, totalPages, pageInfo } = usePagination(data, currentPage, rowsPerPage, {
 *   validateInput: true
 * });
 *
 * // Using in a component
 * function PaginatedTable() {
 *   const [page, setPage] = useState(1);
 *   const [rowsPerPage, setRowsPerPage] = useState(10);
 *   const { paginated, totalPages, pageInfo } = usePagination(data, page, rowsPerPage);
 *
 *   return (
 *     <div>
 *       <table>
 *         <tbody>
 *           {paginated.map(item => (
 *             <tr key={item.id}>Row content</tr>
 *           ))}
 *         </tbody>
 *       </table>
 *
 *       <div>
 *         <button
 *           onClick={() => setPage(p => Math.max(1, p - 1))}
 *           disabled={pageInfo.isFirstPage}
 *         >
 *           Previous
 *         </button>
 *         <span>Page {page} of {totalPages}</span>
 *         <button
 *           onClick={() => setPage(p => Math.min(totalPages, p + 1))}
 *           disabled={pageInfo.isLastPage}
 *         >
 *           Next
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePagination<T>(
  data: T[],
  page: number,
  rowsPerPage: number,
  options: { validateInput?: boolean } = {},
) {
  const { validateInput = true } = options;

  // Refs to keep track of previous values and cache
  const paginatedCacheRef = useRef<{
    data: T[];
    page: number;
    rowsPerPage: number;
    result: T[];
  }>({ data: [], page: 0, rowsPerPage: 0, result: [] });

  // Validate input parameters if enabled
  const validatedPage = validateInput ? Math.max(1, Math.floor(page)) : page;
  const validatedRowsPerPage = validateInput ? Math.max(1, Math.floor(rowsPerPage)) : rowsPerPage;

  // Calculate pagination metadata
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / validatedRowsPerPage) || 1;
  const startIndex = (validatedPage - 1) * validatedRowsPerPage;
  const endIndex = Math.min(startIndex + validatedRowsPerPage, totalItems);

  // Check if we can use cached result
  const canUseCache = useMemo(() => {
    const cache = paginatedCacheRef.current;
    return (
      cache.data === data &&
      cache.page === validatedPage &&
      cache.rowsPerPage === validatedRowsPerPage &&
      cache.result.length > 0
    );
  }, [data, validatedPage, validatedRowsPerPage]);

  // Get the paginated data slice with optimizations
  const paginated = useMemo(() => {
    // If we can use cache, return it immediately
    if (canUseCache) {
      return paginatedCacheRef.current.result;
    }

    // If data length is small or requesting all data, just return or slice once
    if (totalItems <= validatedRowsPerPage && startIndex === 0) {
      const result = data.slice(0);
      paginatedCacheRef.current = {
        data,
        page: validatedPage,
        rowsPerPage: validatedRowsPerPage,
        result,
      };
      return result;
    }

    // Standard pagination slice
    const result = data.slice(startIndex, endIndex);

    // Update cache
    paginatedCacheRef.current = {
      data,
      page: validatedPage,
      rowsPerPage: validatedRowsPerPage,
      result,
    };

    return result;
  }, [canUseCache, data, startIndex, endIndex, totalItems, validatedPage, validatedRowsPerPage]);

  // Calculate additional pagination metadata
  const pageInfo = useMemo(
    () => ({
      startIndex,
      endIndex,
      totalItems,
      isFirstPage: validatedPage === 1,
      isLastPage: validatedPage === totalPages,
      hasNextPage: validatedPage < totalPages,
      hasPreviousPage: validatedPage > 1,
    }),
    [startIndex, endIndex, totalItems, validatedPage, totalPages],
  );

  return {
    paginated,
    totalPages,
    pageInfo,
  };
}
