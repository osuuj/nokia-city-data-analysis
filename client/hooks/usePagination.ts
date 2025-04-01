/**
 * Paginates a data array into slices based on the current page and row count.
 *
 * @template T - The type of data being paginated.
 * @param data - The full data array to paginate.
 * @param page - The current page number (1-indexed).
 * @param rowsPerPage - How many rows to show per page.
 * @returns An object containing the paginated data slice and total page count.
 */
export function usePagination<T>(data: T[], page: number, rowsPerPage: number) {
  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
  const paginated = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  return { paginated, totalPages };
}
