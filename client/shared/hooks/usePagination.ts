import { useMemo } from 'react';

/**
 * A hook that paginates a data array into slices based on the current page and row count.
 * Useful for implementing pagination in tables, lists, or any data display component.
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

  // Validate input parameters if enabled
  const validatedPage = validateInput ? Math.max(1, Math.floor(page)) : page;
  const validatedRowsPerPage = validateInput ? Math.max(1, Math.floor(rowsPerPage)) : rowsPerPage;

  // Calculate pagination metadata
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / validatedRowsPerPage) || 1;
  const startIndex = (validatedPage - 1) * validatedRowsPerPage;
  const endIndex = Math.min(startIndex + validatedRowsPerPage, totalItems);

  // Get the paginated data slice
  const paginated = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  // Calculate additional pagination metadata
  const pageInfo = {
    startIndex,
    endIndex,
    totalItems,
    isFirstPage: validatedPage === 1,
    isLastPage: validatedPage === totalPages,
    hasNextPage: validatedPage < totalPages,
    hasPreviousPage: validatedPage > 1,
  };

  return {
    paginated,
    totalPages,
    pageInfo,
  };
}
