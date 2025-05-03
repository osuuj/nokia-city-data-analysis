'use client';

import type {
  CompanyProperties,
  SortDescriptor,
  TableColumnConfig,
} from '@/features/dashboard/types';
import { Checkbox } from '@heroui/react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface VirtualizedTableProps {
  data: CompanyProperties[];
  columns: TableColumnConfig[];
  sortDescriptor: SortDescriptor;
  onSortChange: (column: string) => void;
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
  rowHeight: number;
  windowWidth: number;
}

const BUFFER_SIZE = 5; // Extra rows to render above/below visible area for smooth scrolling

export const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  columns,
  sortDescriptor,
  onSortChange,
  selectedKeys,
  onSelectionChange,
  rowHeight = 48,
  windowWidth,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600); // Default height

  // Get only visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible !== false);
  }, [columns]);

  // Sort the data based on sortDescriptor
  const sortedData = useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const column = sortDescriptor.column;
      const direction = sortDescriptor.direction;

      // Get values for comparison
      let valueA: string | number | boolean | object | null | undefined =
        a[column as keyof CompanyProperties];
      let valueB: string | number | boolean | object | null | undefined =
        b[column as keyof CompanyProperties];

      // Handle special cases like addresses
      if (
        column === 'street' ||
        column === 'building_number' ||
        column === 'postal_code' ||
        column === 'city'
      ) {
        valueA =
          a.addresses?.['Visiting address']?.[
            column as keyof (typeof a.addresses)['Visiting address']
          ] || '';
        valueB =
          b.addresses?.['Visiting address']?.[
            column as keyof (typeof b.addresses)['Visiting address']
          ] || '';
      }

      // Convert to lowercase strings for string comparison
      if (valueA && valueB && typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Handle null/undefined values (sort them to the end)
      if (valueA === null || valueA === undefined) return direction === 'asc' ? 1 : -1;
      if (valueB === null || valueB === undefined) return direction === 'asc' ? -1 : 1;

      // Perform the comparison
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortDescriptor]);

  // Calculate visible rows based on scroll position
  const visibleRowCount = Math.ceil(containerHeight / rowHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_SIZE);
  const endIndex = Math.min(
    sortedData.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + BUFFER_SIZE,
  );

  const visibleRows = sortedData.slice(startIndex, endIndex);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  // Update container height when window resizes
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to render cell value
  const renderCellValue = (item: CompanyProperties, columnKey: string): React.ReactNode => {
    let value: string | number | boolean | object | null | undefined =
      item[columnKey as keyof CompanyProperties];

    // Handle special cases for address fields
    if (
      columnKey === 'street' ||
      columnKey === 'building_number' ||
      columnKey === 'postal_code' ||
      columnKey === 'city' ||
      columnKey === 'entrance'
    ) {
      const visitingAddress = item.addresses?.['Visiting address'];
      if (visitingAddress) {
        value = visitingAddress[columnKey as keyof typeof visitingAddress] || '-';
      } else {
        value = '-';
      }
    }

    // Format the value for display
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Handle row selection
  const handleRowSelection = useCallback(
    (id: string) => {
      const newKeys = new Set(selectedKeys);
      if (newKeys.has(id)) {
        newKeys.delete(id);
      } else {
        newKeys.add(id);
      }
      onSelectionChange(newKeys);
    },
    [selectedKeys, onSelectionChange],
  );

  // Handle header selection (select all/none)
  const handleHeaderSelection = useCallback(() => {
    if (selectedKeys.size === sortedData.length) {
      // If all are selected, deselect all
      onSelectionChange(new Set());
    } else {
      // Otherwise, select all
      onSelectionChange(new Set(sortedData.map((item) => item.business_id)));
    }
  }, [selectedKeys.size, sortedData, onSelectionChange]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header row */}
      <div className="flex w-full border-b border-default-200 bg-default-50 sticky top-0 z-10">
        {/* Checkbox column */}
        <div className="w-12 px-2 py-3 flex items-center justify-center flex-shrink-0">
          <Checkbox
            aria-label="Select all rows"
            isSelected={selectedKeys.size > 0 && selectedKeys.size === sortedData.length}
            isIndeterminate={selectedKeys.size > 0 && selectedKeys.size < sortedData.length}
            onChange={handleHeaderSelection}
          />
        </div>

        {/* Column headers */}
        {visibleColumns.map((column) => (
          <button
            type="button"
            key={column.key as string}
            className={`flex items-center px-4 py-3 cursor-pointer select-none text-left w-full ${
              column.key === 'company_name' ? 'flex-1 min-w-[200px]' : 'w-40 flex-shrink-0'
            } ${sortDescriptor.column === column.key ? 'bg-default-100' : ''}`}
            onClick={() => onSortChange(column.key as string)}
            aria-label={`Sort by ${column.label}`}
          >
            <span className="font-medium text-sm">{column.label}</span>
            {sortDescriptor.column === column.key && (
              <span className="ml-1">{sortDescriptor.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div ref={containerRef} className="flex-1 overflow-auto" onScroll={handleScroll}>
        {/* Spacer to position visible rows */}
        <div style={{ height: startIndex * rowHeight }} />

        {/* Visible rows */}
        {visibleRows.map((item) => (
          <div
            key={item.business_id}
            className={`flex w-full border-b border-default-100 hover:bg-default-50 ${
              selectedKeys.has(item.business_id) ? 'bg-primary-50' : ''
            }`}
            style={{ height: rowHeight }}
          >
            {/* Checkbox cell */}
            <div className="w-12 px-2 flex items-center justify-center flex-shrink-0">
              <Checkbox
                aria-label={`Select ${item.company_name}`}
                isSelected={selectedKeys.has(item.business_id)}
                onChange={() => handleRowSelection(item.business_id)}
              />
            </div>

            {/* Data cells */}
            {visibleColumns.map((column) => (
              <div
                key={`${item.business_id}-${column.key as string}`}
                className={`flex items-center px-4 truncate ${
                  column.key === 'company_name' ? 'flex-1 min-w-[200px]' : 'w-40 flex-shrink-0'
                }`}
                title={renderCellValue(item, column.key as string) as string}
              >
                {renderCellValue(item, column.key as string)}
              </div>
            ))}
          </div>
        ))}

        {/* Empty state */}
        {sortedData.length === 0 && (
          <div className="w-full py-10 text-center text-default-500">No data available</div>
        )}

        {/* Bottom spacer */}
        <div style={{ height: (sortedData.length - endIndex) * rowHeight }} />
      </div>
    </div>
  );
};
