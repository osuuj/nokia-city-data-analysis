import type { Business } from '@/app/types/business'; // Use Business type to match API data
import { useMemo, useState } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortDescriptor {
  column: keyof Business | ''; // Column must be a valid key of Business or an empty string
  direction: SortDirection;
}

interface UseTableSortingReturn {
  sortedItems: Business[];
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;
}

export function useTableSorting(data: Business[]): UseTableSortingReturn {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: '',
    direction: 'asc',
  });

  const sortedItems = useMemo(() => {
    if (!sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const column = sortDescriptor.column as keyof Business;
      const dir = sortDescriptor.direction === 'asc' ? 1 : -1;

      // ✅ Handle sorting for different column types (strings, numbers)
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * dir;
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * dir;
      }

      if (column === 'latitude_wgs84' || column === 'longitude_wgs84') {
        // Convert latitude/longitude strings to numbers for sorting
        const numA = Number.parseFloat(a[column] as string);
        const numB = Number.parseFloat(b[column] as string);
        return (numA - numB) * dir;
      }

      return 0; // If the values are not comparable, keep them in the same order
    });
  }, [sortDescriptor, data]);

  return {
    sortedItems,
    sortDescriptor,
    setSortDescriptor,
  };
}
