'use client';

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import type React from 'react';
import { useRef, useState } from 'react';
import type { Business } from '../../types';

interface VirtualizedTableProps {
  data: Business[];
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
  width,
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

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: startIndex * ROW_HEIGHT }} />
      <Table
        aria-label="Virtualized table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader>
          {visibleColumns.map((column) => (
            <TableColumn key={`header-${column.key}`}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {visibleRows.map((item) => {
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
                  <TableCell key={`cell-${item.business_id}-${column.key}`}>
                    {renderCellValue(item[column.key as keyof Business])}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div style={{ height: (data.length - endIndex) * ROW_HEIGHT }} />
    </div>
  );
};
