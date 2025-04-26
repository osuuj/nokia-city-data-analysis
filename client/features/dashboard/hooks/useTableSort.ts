import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

interface UseTableSortProps<T extends Record<string, unknown>> {
  data: T[];
  initialSort?: SortDescriptor;
}

interface UseTableSortResult<T extends Record<string, unknown>> {
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;
  sortedData: T[];
  toggleSort: (column: string) => void;
}

/**
 * Custom hook for handling table sorting
 *
 * @param data - The data to sort
 * @param initialSort - The initial sort configuration
 * @returns Sorting state and handlers
 */
export function useTableSort<T extends Record<string, unknown>>({
  data,
  initialSort = { column: '', direction: 'asc' },
}: UseTableSortProps<T>): UseTableSortResult<T> {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(initialSort);

  // Get sorted data
  const sortedData = useMemo(() => {
    if (!sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const aVal =
        sortDescriptor.column in a ? String(a[sortDescriptor.column as keyof typeof a] ?? '') : '';
      const bVal =
        sortDescriptor.column in b ? String(b[sortDescriptor.column as keyof typeof b] ?? '') : '';

      const comparison = aVal.localeCompare(bVal);
      return sortDescriptor.direction === 'desc' ? -comparison : comparison;
    });
  }, [data, sortDescriptor]);

  // Toggle sort direction for a column
  const toggleSort = useCallback((column: string) => {
    setSortDescriptor((prev) => {
      // If clicking the same column, toggle direction
      if (prev.column === column) {
        return {
          column,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      // If clicking a new column, set it as the sort column with ascending direction
      return {
        column,
        direction: 'asc',
      };
    });
  }, []);

  return {
    sortDescriptor,
    setSortDescriptor,
    sortedData,
    toggleSort,
  };
}
