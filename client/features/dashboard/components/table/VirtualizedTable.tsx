'use client';

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import type React from 'react';
import { useRef, useState } from 'react';
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
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRowCount = Math.ceil(height / ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + height) / ROW_HEIGHT) + BUFFER_SIZE,
  );

  const visibleRows = data.slice(startIndex, endIndex);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const handleSelectionChange = (keys: unknown) => {
    if (Array.isArray(keys)) {
      onSelectionChange(new Set(keys));
    } else if (keys instanceof Set) {
      onSelectionChange(new Set([...keys].map(String)));
    }
  };

  const renderCellValue = (
    value: string | number | boolean | object | null | undefined,
  ): string => {
    if (value === null || value === undefined) return '';
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

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width: '100%',
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: startIndex * ROW_HEIGHT }} />
      <div className="w-full min-w-full">
        <Table
          aria-label="Virtualized table"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          isHeaderSticky
          isStriped
          layout="fixed"
          classNames={{
            base: 'w-full',
            wrapper: 'w-full rounded-lg border border-default-200',
            table: 'w-full table-fixed',
            td: 'text-[10px] xs:text-xs sm:text-xs md:text-sm px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2',
            th: 'text-[10px] xs:text-xs sm:text-xs md:text-sm px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2 bg-default-200 text-default-800 font-semibold',
            tr: 'hover:bg-default-50 data-[selected=true]:bg-primary-50',
          }}
          checkboxesProps={{
            size: 'sm',
            radius: 'sm',
            color: 'primary',
          }}
        >
          <TableHeader>
            {visibleColumns.map((column) => (
              <TableColumn
                key={`header-${column.key}`}
                className="py-1"
                style={{
                  width: getColumnWidth(column.key),
                }}
              >
                <div className="flex items-center justify-start gap-1.5">
                  <span className="truncate text-[10px] xs:text-xs sm:text-xs md:text-sm whitespace-nowrap">
                    {column.label}
                  </span>
                </div>
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="text-center py-3 text-default-500 text-xs md:text-sm">
                No data available
              </div>
            }
          >
            {visibleRows.length > 0 ? (
              visibleRows.map((item) => {
                const isSelected = selectedKeys.has(item.business_id);
                return (
                  <TableRow
                    key={`row-${item.business_id}`}
                    style={{ height: ROW_HEIGHT }}
                    aria-selected={isSelected}
                    onClick={() => {
                      const newSelectedKeys = new Set(selectedKeys);
                      if (isSelected) {
                        newSelectedKeys.delete(item.business_id);
                      } else {
                        newSelectedKeys.add(item.business_id);
                      }
                      onSelectionChange(newSelectedKeys);
                    }}
                  >
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={`cell-${item.business_id}-${column.key}`}
                        style={{
                          minWidth: column.key === 'business_id' ? '60px' : '80px',
                          maxWidth: column.key === 'business_id' ? '100px' : '300px',
                          overflow: 'hidden',
                        }}
                      >
                        <span className="truncate block w-full">
                          {renderCellValue(item[column.key as keyof CompanyProperties])}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="text-center py-4">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div style={{ height: (data.length - endIndex) * ROW_HEIGHT }} />
    </div>
  );
};
