import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor, TableColumnConfig } from '@/features/dashboard/types/table';
import { Checkbox } from '@heroui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

// Constants for virtualization optimization
const ROW_HEIGHT = 48; // Fixed row height for consistent calculations

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

// Create an even more optimized row component with minimal re-renders
const Row = React.memo(
  function TableRow({
    item,
    columns,
    isSelected,
    onSelect,
    height,
    style,
  }: {
    item: CompanyProperties;
    columns: TableColumnConfig[];
    isSelected: boolean;
    onSelect: () => void;
    height: number;
    style?: React.CSSProperties;
  }) {
    // Pre-render cells once to avoid recreating them on each render
    const cells = useMemo(() => {
      return columns.map((column) => {
        const value = renderCellValue(item, column.key as string);
        return (
          <div
            key={`${item.business_id}-${column.key as string}`}
            className={`flex items-center px-4 truncate text-xs md:text-sm ${
              column.key === 'company_name' ? 'flex-1 min-w-[200px]' : 'w-40 flex-shrink-0'
            }`}
            title={value as string}
          >
            {value}
          </div>
        );
      });
    }, [columns, item]);

    return (
      <div
        className={`flex w-full border-b border-default-100 hover:bg-default-50 ${
          isSelected ? 'bg-primary-50' : ''
        }`}
        style={{
          ...style,
          height: height,
        }}
      >
        {/* Checkbox cell */}
        <div className="w-12 px-2 flex items-center justify-center flex-shrink-0">
          <SelectionCheckbox
            ariaLabel={`Select ${item.company_name}`}
            isSelected={isSelected}
            onValueChange={onSelect}
          />
        </div>

        {/* Pre-rendered data cells */}
        {cells}
      </div>
    );
  },
  // Custom equality function to improve performance
  (prevProps, nextProps) => {
    // Only re-render if these specific props changed
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.item.business_id === nextProps.item.business_id &&
      prevProps.height === nextProps.height
    );
  },
);

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
          className={`flex items-center px-4 py-3 cursor-pointer select-none text-left w-full text-xs md:text-sm ${
            column.key === 'company_name' ? 'flex-1 min-w-[200px]' : 'w-40 flex-shrink-0'
          } ${sortDescriptor.column === column.key ? 'bg-default-100' : ''}`}
          onClick={() => onSortChange(column.key as string)}
          aria-label={`Sort by ${column.label}`}
        >
          <span className="font-medium">{column.label}</span>
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Get only visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible !== false);
  }, [columns]);

  // Cached selection handlers to avoid recreating functions during render
  const selectionHandlersCache = useRef(new Map<string, () => void>());

  // Handle row selection with improved caching
  const handleRowSelection = useCallback(
    (id: string) => {
      // Update selection directly
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

      // Return the cached handler with proper null check
      const handler = selectionHandlersCache.current.get(id);
      // This should never happen as we just set it above if it didn't exist
      if (!handler) {
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

  // TanStack Virtual implementation
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

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
        style={{ height: 'min(calc(100vh - 350px), 500px)', minHeight: '300px' }}
      >
        {/* Virtualized rows container */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Only render visible rows */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = data[virtualRow.index];

            return (
              <Row
                key={item.business_id}
                item={item}
                columns={visibleColumns}
                isSelected={selectedKeys.has(item.business_id)}
                onSelect={getRowSelectionHandler(item.business_id)}
                height={rowHeight}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </div>

        {/* Empty state */}
        {data.length === 0 && (
          <div className="w-full py-10 text-center text-default-500">No data available</div>
        )}
      </div>
    </div>
  );
}
