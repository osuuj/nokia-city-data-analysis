'use client';

import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor, TableColumnConfig } from '@/features/dashboard/types/table';
import { TableSkeleton } from '@/shared/components/loading';
import {
  Pagination,
  type Selection,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { VirtualizedTable } from './VirtualizedTable';
import { TableToolbar } from './toolbar/TableToolbar';

// Lower the threshold to use virtualization more often for better performance
const VIRTUALIZATION_THRESHOLD = 50;

// Create a memoized toolbar component
const MemoizedTableToolbar = React.memo(TableToolbar);

// Create a memoized pagination component
const MemoizedPagination = React.memo(Pagination);

interface TableViewProps {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
  columns: TableColumnConfig[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
  pageSize: number;
}

/**
 * Table View component
 * Displays businesses in a filterable, sortable table
 */
export function TableView({
  data,
  allFilteredData,
  columns,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange: _onPageSizeChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  sortDescriptor,
  setSortDescriptor,
  pageSize,
}: TableViewProps) {
  // Access store values with specific selectors to prevent unnecessary re-renders
  const selectedKeys = useCompanyStore((state) => state.selectedKeys);
  const setSelectedKeys = useCompanyStore((state) => state.setSelectedKeys);
  const visibleColumns = useCompanyStore((state) => state.visibleColumns);

  // Local state for toolbar components
  const [useLocation, setUseLocation] = useState(false);
  const [address, setAddress] = useState('');

  // To avoid hydration errors, we'll mount the table only on client-side
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter columns to only show visible ones from the store
  const displayColumns = useMemo(() => {
    return visibleColumns.length > 0 ? visibleColumns : columns.filter((col) => col.visible);
  }, [columns, visibleColumns]);

  // Handle column sorting
  const handleSortChange = useCallback(
    (columnKey: string) => {
      setSortDescriptor((prev) => ({
        column: columnKey,
        direction: prev.column === columnKey ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'asc',
      }));
    },
    [setSortDescriptor],
  );

  // Handle table selection change
  const handleSelectionChange = useCallback(
    (selection: Selection) => {
      if (selection === 'all') {
        setSelectedKeys('all', allFilteredData);
      } else if (selection instanceof Set) {
        // Convert any non-string keys to strings to ensure type compatibility
        const stringKeys = new Set(Array.from(selection).map((key) => String(key)));
        setSelectedKeys(stringKeys);
      } else {
        setSelectedKeys(new Set());
      }
    },
    [setSelectedKeys, allFilteredData],
  );

  // Determine if we should use virtualized table - lower threshold for better performance
  const shouldUseVirtualizedTable = useMemo(() => {
    return data.length > VIRTUALIZATION_THRESHOLD;
  }, [data.length]);

  // Memoized toolbar props to prevent object recreation
  const toolbarProps = useMemo(
    () => ({
      searchTerm,
      onSearch: setSearchTerm,
      selectedKeys,
      useLocation,
      setUseLocation,
      address,
      setAddress,
      sortDescriptor,
      setSortDescriptor,
      setSelectedKeys,
    }),
    [
      searchTerm,
      setSearchTerm,
      selectedKeys,
      useLocation,
      address,
      sortDescriptor,
      setSortDescriptor,
      setSelectedKeys,
    ],
  );

  // Memoize pagination controls container to prevent re-renders
  const paginationControls = useMemo(() => {
    return (
      <div className="flex flex-col sm:flex-row items-center mt-4 px-2 gap-2">
        {/* Information about page size - full width on mobile, 1/4 on larger screens */}
        <div className="w-full sm:w-1/4 text-xs text-default-500 text-center sm:text-left whitespace-nowrap">
          Showing {pageSize} rows per page
        </div>

        {/* Centered pagination */}
        <div className="flex justify-center w-full sm:flex-1">
          <MemoizedPagination
            total={totalPages}
            initialPage={currentPage}
            page={currentPage}
            onChange={onPageChange}
            showControls
            size="sm"
            siblings={1}
            boundaries={1}
            className="overflow-x-auto sm:overflow-visible"
            classNames={{
              cursor: 'bg-primary text-white',
              item: 'text-xs sm:text-sm',
            }}
          />
        </div>

        {/* Empty div to balance the layout - hidden on mobile */}
        <div className="hidden sm:block sm:w-1/4" />
      </div>
    );
  }, [currentPage, totalPages, onPageChange, pageSize]);

  // Render standard table with memoization
  const standardTable = useMemo(() => {
    return (
      <Table
        aria-label="Companies table"
        isHeaderSticky
        classNames={{
          base: 'max-h-[680px]',
          table: 'min-h-[400px]',
          th: 'text-xs md:text-sm',
          td: 'text-xs md:text-sm text-foreground',
          tr: '@media(hover: hover){hover:bg-default-50} data-[selected=true]:bg-primary-50',
        }}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader>
          {displayColumns.map((column: TableColumnConfig) => (
            <TableColumn
              key={column.key}
              className="cursor-pointer"
              onClick={() => handleSortChange(column.key)}
            >
              <div className="flex items-center gap-1">
                {column.label}
                {sortDescriptor.column === column.key && (
                  <span className="text-xs text-primary font-bold">
                    {sortDescriptor.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody
          emptyContent={isLoading ? 'Loading...' : 'No companies found'}
          isLoading={isLoading}
        >
          {data.map((item) => (
            <TableRow key={item.business_id}>
              {displayColumns.map((column: TableColumnConfig) => (
                <TableCell key={`${item.business_id}-${column.key}`} className="truncate max-w-xs">
                  {String(item[column.key as keyof typeof item] || '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [
    data,
    displayColumns,
    isLoading,
    selectedKeys,
    handleSelectionChange,
    sortDescriptor,
    handleSortChange,
  ]);

  // Show loading state when data is being fetched
  if (isLoading || !data) {
    return (
      <div className="w-full">
        <MemoizedTableToolbar {...toolbarProps} />
        <div className="relative min-h-[400px] flex items-center justify-center bg-default-50/50">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-default-500">Loading company data...</p>
          </div>
        </div>
        {paginationControls}
      </div>
    );
  }

  // Render a placeholder during SSR to prevent layout shift
  if (!isMounted) {
    return (
      <div className="w-full">
        <MemoizedTableToolbar {...toolbarProps} />
        <div className="max-h-[600px] min-h-[400px] w-full bg-default-50 rounded-lg animate-pulse" />
        <div className="flex justify-center mt-4">
          <div className="h-10 w-64 bg-default-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  // Render virtualized table for many rows
  if (shouldUseVirtualizedTable && !isLoading) {
    return (
      <div className="w-full">
        <MemoizedTableToolbar {...toolbarProps} />
        <VirtualizedTable
          data={data}
          columns={displayColumns}
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        />
        {paginationControls}
      </div>
    );
  }

  // Use standard table for smaller datasets
  return (
    <div className="w-full">
      <MemoizedTableToolbar {...toolbarProps} />
      {standardTable}
      {paginationControls}
    </div>
  );
}
