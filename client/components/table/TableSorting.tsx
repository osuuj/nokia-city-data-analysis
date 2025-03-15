'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Column {
  uid: string;
  name: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

interface TableSortingProps {
  columns: Column[];
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;
}

export default function TableSorting({
  columns,
  sortDescriptor,
  setSortDescriptor,
}: TableSortingProps) {
  // ✅ Handles sorting toggle logic properly
  const handleSort = (column: string) => {
    setSortDescriptor({
      column,
      direction:
        sortDescriptor.column === column
          ? sortDescriptor.direction === 'asc'
            ? 'desc'
            : sortDescriptor.direction === 'desc'
              ? null // Reset sorting on third click
              : 'asc'
          : 'asc',
    });
  };

  return (
    <div className="flex gap-2">
      {columns.map((col: Column) => {
        const isSorted = sortDescriptor.column === col.uid;
        const iconType =
          sortDescriptor.direction === 'asc'
            ? 'solar:arrow-up-outline'
            : sortDescriptor.direction === 'desc'
              ? 'solar:arrow-down-outline'
              : null;

        return (
          <Button
            key={col.uid}
            size="sm"
            variant="light"
            aria-label={`Sort by ${col.name}`}
            onPress={() => handleSort(col.uid)}
          >
            {col.name}
            {isSorted && iconType && (
              <Icon icon={iconType} width={16} className="ml-2 text-default-500" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
