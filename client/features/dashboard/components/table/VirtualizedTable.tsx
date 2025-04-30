'use client';

import { Spinner } from '@heroui/react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CompanyProperties } from '../../types';

interface VirtualizedTableProps {
  data: CompanyProperties[];
  visibleColumns: Array<{
    key: string;
    label: string;
    visible: boolean;
    userVisible: boolean;
  }>;
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
  height: number;
  width: number;
  sortDescriptor?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  onSortChange?: (column: string) => void;
  isLoading?: boolean;
}

const ROW_HEIGHT = 40;
const BUFFER_SIZE = 5;

export const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  visibleColumns,
  selectedKeys,
  onSelectionChange,
  height,
  width: _width,
  sortDescriptor,
  onSortChange,
  isLoading = false,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort the data based on sortDescriptor
  const sortedData = useMemo(() => {
    if (!sortDescriptor) return data;

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

  const visibleRowCount = Math.ceil(height / ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE);
  const endIndex = Math.min(
    sortedData.length,
    Math.ceil((scrollTop + height) / ROW_HEIGHT) + BUFFER_SIZE,
  );

  const visibleRows = sortedData.slice(startIndex, endIndex);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const renderCellValue = (
    value: string | number | boolean | object | null | undefined,
    columnKey: string,
    item: CompanyProperties,
  ): string => {
    if (
      columnKey === 'street' ||
      columnKey === 'building_number' ||
      columnKey === 'postal_code' ||
      columnKey === 'city' ||
      columnKey === 'entrance' ||
      columnKey === 'address_type'
    ) {
      const visiting = item.addresses?.['Visiting address'];
      switch (columnKey) {
        case 'street':
          return visiting?.street ?? '-';
        case 'building_number':
          return visiting?.building_number ?? '-';
        case 'postal_code':
          return visiting?.postal_code ?? '-';
        case 'city':
          return visiting?.city ?? '-';
        case 'entrance':
          return visiting?.entrance ?? '-';
        case 'address_type':
          return 'Visiting address';
      }
    }

    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const getColumnWidth = (key: string) => {
    // Calculate relative widths as percentages based on content type
    switch (key) {
      case 'business_id':
        return '10%'; // Narrow column for IDs
      case 'company_name':
        return '25%'; // Wider column for names
      case 'street':
      case 'city':
        return '20%'; // Medium-wide for text content
      default:
        return `${100 / visibleColumns.length}%`; // Evenly distribute remaining columns
    }
  };

  const getMinWidthForColumn = (key: string) => {
    // Set minimum widths in pixels for different column types
    switch (key) {
      case 'business_id':
        return '60px';
      case 'company_name':
        return '150px';
      case 'street':
        return '120px';
      case 'city':
        return '100px';
      case 'building_number':
      case 'postal_code':
        return '80px';
      default:
        return '80px';
    }
  };

  const handleSelectionChange = (businessId: string) => {
    const newSelectedKeys = new Set(selectedKeys);
    if (selectedKeys.has(businessId)) {
      newSelectedKeys.delete(businessId);
    } else {
      newSelectedKeys.add(businessId);
    }
    onSelectionChange(newSelectedKeys);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="relative"
    >
      {/* Header stays fixed at the top using regular table element */}
      <div className="sticky top-0 z-10 bg-default-200 w-full overflow-x-auto">
        <table className="w-full min-w-[650px] table-fixed border-t border-x border-default-200 rounded-t-lg">
          <thead className="bg-default-200">
            <tr>
              <th className="w-8 text-center bg-default-200 text-default-800 font-semibold">
                {/* Checkbox header */}
                <input
                  type="checkbox"
                  checked={selectedKeys.size > 0 && selectedKeys.size === data.length}
                  onChange={() => {
                    if (selectedKeys.size === data.length) {
                      onSelectionChange(new Set());
                    } else {
                      onSelectionChange(new Set(data.map((item) => item.business_id)));
                    }
                  }}
                  className="rounded-sm"
                  disabled={isLoading || data.length === 0}
                />
              </th>
              {visibleColumns.map((column) => (
                <th
                  key={`header-${column.key}`}
                  className="text-[10px] xs:text-xs sm:text-xs md:text-sm px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2 bg-default-200 text-default-800 font-semibold py-1"
                  style={{
                    width: getColumnWidth(column.key),
                  }}
                  aria-sort={
                    sortDescriptor?.column === column.key
                      ? sortDescriptor.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <button
                    className={`w-full h-full flex items-center justify-start gap-1.5 ${!isLoading ? 'cursor-pointer hover:bg-default-300' : 'cursor-default'}`}
                    onClick={() => !isLoading && onSortChange?.(column.key)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                        e.preventDefault();
                        onSortChange?.(column.key);
                      }
                    }}
                    disabled={isLoading}
                    type="button"
                  >
                    <span className="truncate text-[10px] xs:text-xs sm:text-xs md:text-sm whitespace-nowrap">
                      {column.label}
                    </span>
                    {sortDescriptor?.column === column.key && (
                      <span className="text-xs text-primary-500">
                        {sortDescriptor.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable body */}
      <div
        style={{
          height: height - 38 /* Subtract header height */,
          width: '100%',
          overflow: 'auto',
        }}
        onScroll={handleScroll}
        className="border-b border-x border-default-200 rounded-b-lg overflow-x-auto"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <>
            <div style={{ height: startIndex * ROW_HEIGHT }} />
            <table className="w-full min-w-[650px] table-fixed">
              <tbody>
                {visibleRows.length > 0 ? (
                  visibleRows.map((item) => {
                    const isSelected = selectedKeys.has(item.business_id);
                    return (
                      <tr
                        key={`row-${item.business_id}`}
                        style={{ height: ROW_HEIGHT }}
                        className={`hover:bg-default-50 ${isSelected ? 'bg-primary-50' : ''} ${
                          Number.parseInt(item.business_id) % 2 === 0 ? 'bg-default-50' : ''
                        }`}
                      >
                        <td className="w-8 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectionChange(item.business_id)}
                            className="rounded-sm text-primary-500 focus:ring-primary-500"
                          />
                        </td>
                        {visibleColumns.map((column) => (
                          <td
                            key={`cell-${item.business_id}-${column.key}`}
                            className="text-[10px] xs:text-xs sm:text-xs md:text-sm px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2"
                            style={{
                              minWidth: getMinWidthForColumn(column.key),
                              maxWidth: column.key === 'business_id' ? '100px' : '300px',
                              overflow: 'hidden',
                              width: getColumnWidth(column.key),
                            }}
                          >
                            <span className="truncate block w-full">
                              {renderCellValue(
                                item[column.key as keyof CompanyProperties],
                                column.key,
                                item,
                              )}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 1}
                      className="text-center py-4 text-default-500 text-xs md:text-sm"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div style={{ height: (sortedData.length - endIndex) * ROW_HEIGHT }} />
          </>
        )}
      </div>
    </div>
  );
};
