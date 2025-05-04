'use client';

import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor, TableColumnConfig } from '@/features/dashboard/types/table';
import {
  Pagination,
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
import { TableToolbar } from './toolbar/TableToolbar';

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
      } else {
        setSelectedKeys(new Set(Array.from(selection).map(String)));
      }
    },
    [setSelectedKeys, allFilteredData],
  );

  // Render toolbar with shared props
  const renderToolbar = () => (
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

  return (
    <div className="w-full">
      {renderToolbar()}

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
      </Table>

      <div className="flex justify-center mt-4">
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
      </div>
    </div>
  );
}
