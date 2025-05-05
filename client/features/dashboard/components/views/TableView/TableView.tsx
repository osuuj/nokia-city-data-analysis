'use client';

import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor, TableColumnConfig } from '@/features/dashboard/types/table';
import {
  Pagination,
  Select,
  SelectItem,
  type Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { VirtualizedTable } from './VirtualizedTable';
import { TableToolbar } from './toolbar/TableToolbar';

// Page size options
const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
];

// Maximum allowed page size - for validation
const MAX_PAGE_SIZE = 50;

// Memoized page size options to prevent recreation
const MEMOIZED_PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS.map((option) => (
  <SelectItem key={option.value} textValue={option.label}>
    {option.label}
  </SelectItem>
));

// Threshold for switching to virtualized table
const VIRTUALIZATION_THRESHOLD = 100;

interface TableViewProps {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
  columns: TableColumnConfig[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
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
  onPageChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  sortDescriptor,
  setSortDescriptor,
  pageSize = 20,
  onPageSizeChange,
}: TableViewProps) {
  // Access store values
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

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = Number(e.target.value);
      // Validate that the size doesn't exceed the maximum
      const validatedSize = Math.min(newSize, MAX_PAGE_SIZE);

      if (onPageSizeChange && !Number.isNaN(validatedSize)) {
        onPageSizeChange(validatedSize);
      }
    },
    [onPageSizeChange],
  );

  // Optimize page size change to reduce component tree updates
  const handleOptimizedPageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      // Directly call the handler instead of using setTimeout which can cause React DevTools issues
      handlePageSizeChange(e);
    },
    [handlePageSizeChange],
  );

  // Determine if we should use virtualized table
  const shouldUseVirtualizedTable = useMemo(() => {
    return data.length > VIRTUALIZATION_THRESHOLD || pageSize > VIRTUALIZATION_THRESHOLD;
  }, [data.length, pageSize]);

  // Render toolbar with shared props
  const renderToolbar = useCallback(
    () => (
      <TableToolbar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        selectedKeys={selectedKeys}
        useLocation={useLocation}
        setUseLocation={setUseLocation}
        address={address}
        setAddress={setAddress}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        setSelectedKeys={setSelectedKeys}
      />
    ),
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

  // Memoize pagination component to prevent re-renders
  const renderPagination = useCallback(
    () => (
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        page={currentPage}
        onChange={onPageChange}
        showControls
        classNames={{
          cursor: 'bg-primary text-white',
        }}
      />
    ),
    [currentPage, totalPages, onPageChange],
  );

  // Memoize page size selector to prevent re-renders
  const renderPageSizeSelector = useCallback(
    () =>
      onPageSizeChange && (
        <div className="flex items-center gap-2 mb-2 md:mb-0 w-1/4">
          <span className="text-sm whitespace-nowrap">Rows per page:</span>
          <Select
            size="sm"
            selectedKeys={[pageSize.toString()]}
            onChange={handleOptimizedPageSizeChange}
            className="min-w-[70px] w-[70px]"
            classNames={{
              trigger: 'min-w-[70px] w-[70px]',
              listbox: 'min-w-[70px]',
            }}
          >
            {MEMOIZED_PAGE_SIZE_OPTIONS}
          </Select>
        </div>
      ),
    [onPageSizeChange, pageSize, handleOptimizedPageSizeChange],
  );

  // Memoize pagination controls container to prevent re-renders
  const renderPaginationControls = useCallback(
    () => (
      <div className="flex flex-wrap md:flex-nowrap items-center mt-4 px-2">
        {/* Page size selector */}
        {renderPageSizeSelector()}

        {/* Centered pagination */}
        <div className="flex justify-center flex-1">{renderPagination()}</div>

        {/* Empty div to balance the layout */}
        <div className="w-1/4" />
      </div>
    ),
    [renderPageSizeSelector, renderPagination],
  );

  // Render standard table for smaller datasets
  const renderTableBody = useCallback(() => {
    // Use windowing approach even for regular tables when dataset is large
    const shouldUseWindowing = data.length > 50;

    if (shouldUseWindowing) {
      // Simplified windowing for regular tables (just show current page without virtualization)
      return (
        <TableBody
          emptyContent={isLoading ? 'Loading...' : 'No companies found'}
          isLoading={isLoading}
        >
          {data.map((item, index) => (
            <TableRow key={item.business_id} className={index % 2 === 0 ? 'bg-default-50' : ''}>
              {displayColumns.map((column: TableColumnConfig) => (
                <TableCell key={`${item.business_id}-${column.key}`} className="truncate max-w-xs">
                  {String(item[column.key as keyof typeof item] || '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      );
    }

    // Traditional approach for smaller datasets
    return (
      <TableBody
        emptyContent={isLoading ? 'Loading...' : 'No companies found'}
        isLoading={isLoading}
      >
        {data.map((item) => (
          <TableRow key={item.business_id}>
            {displayColumns.map((column: TableColumnConfig) => (
              <TableCell key={`${item.business_id}-${column.key}`}>
                {String(item[column.key as keyof typeof item] || '')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }, [data, displayColumns, isLoading]);

  // Render table header
  const renderTableHeader = useCallback(
    () => (
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
                <span className="text-xs">{sortDescriptor.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </div>
          </TableColumn>
        ))}
      </TableHeader>
    ),
    [displayColumns, handleSortChange, sortDescriptor],
  );

  // Memoize standard table
  const renderStandardTable = useCallback(
    () => (
      <Table
        aria-label="Companies table"
        isHeaderSticky
        classNames={{
          base: 'max-h-[600px]',
          table: 'min-h-[400px]',
        }}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        {renderTableHeader()}
        {renderTableBody()}
      </Table>
    ),
    [selectedKeys, handleSelectionChange, renderTableHeader, renderTableBody],
  );

  // Render a placeholder during SSR to prevent layout shift
  if (!isMounted) {
    return (
      <div className="w-full">
        {renderToolbar()}
        <div className="max-h-[600px] min-h-[400px] w-full bg-default-50 rounded-lg animate-pulse" />
        <div className="flex justify-center mt-4">
          <div className="h-10 w-64 bg-default-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  // Render virtualized table for large datasets
  if (shouldUseVirtualizedTable && !isLoading) {
    return (
      <div className="w-full">
        {renderToolbar()}

        <VirtualizedTable
          data={data}
          columns={displayColumns}
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        />

        {renderPaginationControls()}
      </div>
    );
  }

  // Use standard table for smaller datasets
  return (
    <div className="w-full">
      {renderToolbar()}
      {renderStandardTable()}
      {renderPaginationControls()}
    </div>
  );
}
