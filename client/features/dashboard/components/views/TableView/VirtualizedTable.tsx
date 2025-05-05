import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor, TableColumnConfig } from '@/features/dashboard/types/table';
import { Checkbox } from '@heroui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';

// Constants for virtualization optimization
const BUFFER_SIZE = 10; // Increased buffer for smoother scrolling
const ROW_HEIGHT = 48; // Fixed row height for consistent calculations
const SCROLL_THROTTLE_MS = 16; // ~60fps for scroll updates

interface VirtualizedTableProps {
  data: CompanyProperties[];
  columns: TableColumnConfig[];
  sortDescriptor: SortDescriptor;
  onSortChange: (column: string) => void;
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
  rowHeight?: number;
}

// Helper to render cell value - moved outside of component to avoid recreation
function renderCellValue(item: CompanyProperties, columnKey: string): React.ReactNode {
  const value = item[columnKey as keyof CompanyProperties];

  // Format the value for display
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// Lightweight checkbox component to reduce render cost
const SelectionCheckbox = React.memo(function SelectionCheckbox({
  isSelected,
  onValueChange,
  ariaLabel,
}: {
  isSelected: boolean;
  onValueChange: () => void;
  ariaLabel: string;
}) {
  return <Checkbox aria-label={ariaLabel} isSelected={isSelected} onValueChange={onValueChange} />;
});

// Create a memoized row component to prevent unnecessary re-renders
const Row = React.memo(function TableRow({
  item,
  columns,
  isSelected,
  onSelect,
  rowHeight,
}: {
  item: CompanyProperties;
  columns: TableColumnConfig[];
  isSelected: boolean;
  onSelect: () => void;
  rowHeight: number;
}) {
  return (
    <div
      className={`flex w-full border-b border-default-100 hover:bg-default-50 ${
        isSelected ? 'bg-primary-50' : ''
      }`}
      style={{ height: rowHeight }}
    >
      {/* Checkbox cell */}
      <div className="w-12 px-2 flex items-center justify-center flex-shrink-0">
        <SelectionCheckbox
          ariaLabel={`Select ${item.company_name}`}
          isSelected={isSelected}
          onValueChange={onSelect}
        />
      </div>

      {/* Data cells */}
      {columns.map((column) => (
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
  );
});

// Create a memoized header component
const Header = React.memo(function TableHeader({
  columns,
  sortDescriptor,
  onSortChange,
  selectedKeys,
  totalItems,
  onHeaderSelection,
}: {
  columns: TableColumnConfig[];
  sortDescriptor: SortDescriptor;
  onSortChange: (column: string) => void;
  selectedKeys: Set<string>;
  totalItems: number;
  onHeaderSelection: () => void;
}) {
  // Calculate selection state only once
  const isAllSelected = selectedKeys.size > 0 && selectedKeys.size === totalItems;
  const isIndeterminate = selectedKeys.size > 0 && selectedKeys.size < totalItems;

  return (
    <div className="flex w-full border-b border-default-200 bg-default-50 sticky top-0 z-10">
      {/* Checkbox column */}
      <div className="w-12 px-2 py-3 flex items-center justify-center flex-shrink-0">
        <SelectionCheckbox
          ariaLabel="Select all rows"
          isSelected={isAllSelected}
          onValueChange={onHeaderSelection}
        />
      </div>

      {/* Column headers */}
      {columns.map((column) => (
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
  );
});

export function VirtualizedTable({
  data,
  columns,
  sortDescriptor,
  onSortChange,
  selectedKeys,
  onSelectionChange,
  rowHeight = ROW_HEIGHT,
}: VirtualizedTableProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600); // Default height
  const [containerWidth, setContainerWidth] = useState(1000); // Default width

  // Ref for tracking previous scroll position to avoid unnecessary updates
  const prevScrollTopRef = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Get only visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible !== false);
  }, [columns]);

  // Optimized calculation of visible rows to reduce memory usage for large tables
  const { visibleRows, startIndex, endIndex } = useMemo(() => {
    // Calculate visible row count plus buffer
    const visibleRowsCount = Math.ceil(containerHeight / rowHeight) + BUFFER_SIZE * 2;

    // Calculate start and end indices with buffer
    const newStartIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_SIZE);
    const newEndIndex = Math.min(data.length, newStartIndex + visibleRowsCount);

    // Only slice the needed portion of data
    const newVisibleRows = data.slice(newStartIndex, newEndIndex);

    return {
      visibleRows: newVisibleRows,
      startIndex: newStartIndex,
      endIndex: newEndIndex,
    };
  }, [data, containerHeight, rowHeight, scrollTop]);

  // Handle scroll events with improved throttling to reduce state updates
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;

    // Skip if the change is too small (< 8px) to be visible
    if (Math.abs(newScrollTop - prevScrollTopRef.current) < 8) {
      return;
    }

    // Clear any pending timeout
    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Set a timeout to update the scroll position after a short delay
    scrollTimeoutRef.current = window.setTimeout(() => {
      prevScrollTopRef.current = newScrollTop;
      setScrollTop(newScrollTop);
      scrollTimeoutRef.current = null;
    }, SCROLL_THROTTLE_MS);
  }, []);

  // Update container dimensions when window resizes
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        if (containerRef.current) {
          setContainerHeight(containerRef.current.clientHeight);
          setContainerWidth(containerRef.current.clientWidth);
        }
      };

      updateDimensions();

      // Use ResizeObserver instead of window resize events for better performance
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
        resizeObserver.disconnect();
      };
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Cached selection handlers to avoid recreating functions during render
  const selectionHandlersCache = useRef(new Map<string, () => void>());

  // Handle row selection with improved caching
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
    if (selectedKeys.size === data.length) {
      // If all are selected, deselect all
      onSelectionChange(new Set());
    } else {
      // Otherwise, select all
      onSelectionChange(new Set(data.map((item) => item.business_id)));
    }
  }, [selectedKeys.size, data, onSelectionChange]);

  // Get row selection handler with effective caching
  const getRowSelectionHandler = useCallback(
    (id: string) => {
      // Check if we already have a cached handler for this ID
      if (!selectionHandlersCache.current.has(id)) {
        // Create and cache a new handler
        selectionHandlersCache.current.set(id, () => handleRowSelection(id));
      }

      // Return the cached handler
      const handler = selectionHandlersCache.current.get(id);
      if (!handler) {
        // Create a new handler if somehow it's missing (shouldn't happen)
        const newHandler = () => handleRowSelection(id);
        selectionHandlersCache.current.set(id, newHandler);
        return newHandler;
      }
      return handler;
    },
    [handleRowSelection],
  );

  // Clean up unused handlers when data changes
  useEffect(() => {
    const currentIds = new Set(data.map((item) => item.business_id));

    // Remove handlers for rows that are no longer in the data
    selectionHandlersCache.current.forEach((_, id) => {
      if (!currentIds.has(id)) {
        selectionHandlersCache.current.delete(id);
      }
    });
  }, [data]);

  return (
    <div className="flex flex-col border border-default-200 rounded-lg overflow-hidden">
      {/* Header row */}
      <Header
        columns={visibleColumns}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        selectedKeys={selectedKeys}
        totalItems={data.length}
        onHeaderSelection={handleHeaderSelection}
      />

      {/* Scrollable body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto w-full"
        onScroll={handleScroll}
        style={{ height: 'calc(100vh - 350px)', minHeight: '400px' }}
      >
        {/* Spacer to position visible rows */}
        {startIndex > 0 && <div style={{ height: startIndex * rowHeight }} />}

        {/* Visible rows */}
        {visibleRows.map((item) => (
          <Row
            key={item.business_id}
            item={item}
            columns={visibleColumns}
            isSelected={selectedKeys.has(item.business_id)}
            onSelect={getRowSelectionHandler(item.business_id)}
            rowHeight={rowHeight}
          />
        ))}

        {/* Empty state */}
        {data.length === 0 && (
          <div className="w-full py-10 text-center text-default-500">No data available</div>
        )}

        {/* Bottom spacer */}
        {endIndex < data.length && <div style={{ height: (data.length - endIndex) * rowHeight }} />}
      </div>
    </div>
  );
}
