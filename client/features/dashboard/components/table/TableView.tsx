'use client';

import { TableToolbar } from '@/features/dashboard/components/table/toolbar';
import type {
  CompanyProperties,
  CompanyTableKey,
  SortDescriptor,
  TableCellRendererProps,
  TableColumnConfig,
  TableViewProps,
} from '@/features/dashboard/types';
import { useMemoizedCallback } from '@/shared/hooks';
import { useCompanyStore } from '@features/dashboard/store';
import {
  Card,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { VirtualizedTable } from './VirtualizedTable';
import { TableSkeleton } from './skeletons/TableSkeleton';

interface TableViewComponentProps extends TableViewProps {
  allFilteredData: CompanyProperties[];
}

/**
 * Custom comparison function for TableView props
 * Only re-renders when important props change
 */
const arePropsEqual = (
  prevProps: TableViewComponentProps,
  nextProps: TableViewComponentProps,
): boolean => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.allFilteredData === nextProps.allFilteredData &&
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.totalPages === nextProps.totalPages &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.sortDescriptor.column === nextProps.sortDescriptor.column &&
    prevProps.sortDescriptor.direction === nextProps.sortDescriptor.direction
  );
};

export const TableView = React.memo<TableViewComponentProps>(
  ({
    data,
    allFilteredData,
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortDescriptor,
    setSortDescriptor,
  }) => {
    const { visibleColumns } = useCompanyStore();
    const [useLocation, setUseLocation] = useState(false);
    const [address, setAddress] = useState('');
    const selectedKeys = useCompanyStore((s) => s.selectedKeys);
    const setSelectedKeys = useCompanyStore((s) => s.setSelectedKeys);
    const [windowWidth, setWindowWidth] = useState(
      typeof window !== 'undefined' ? window.innerWidth : 1024,
    );
    const [mounted, setMounted] = useState(false);

    // Set mounted state to true after component mounts
    useEffect(() => {
      setMounted(true);
    }, []);

    // Use window width to detect screen size
    const isMobile = windowWidth < 640;
    const isXsScreen = windowWidth < 400;

    // Update window width on resize
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Memoize event handlers
    const handleSearchChange = useCallback(
      (term: string) => {
        setSearchTerm(term);
      },
      [setSearchTerm],
    );

    const handleSortChange = useCallback(
      (key: CompanyTableKey) => {
        setSortDescriptor((prev) => ({
          column: key,
          direction: prev.column === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
      },
      [setSortDescriptor],
    );

    const handleSelectionChange = useCallback(
      (keys: Set<string> | 'all') => {
        if (keys === 'all') {
          const allKeys = new Set(allFilteredData.map((item) => item.business_id));
          setSelectedKeys(allKeys);
        } else {
          setSelectedKeys(new Set(Array.from(keys).map(String)));
        }
      },
      [allFilteredData, setSelectedKeys],
    );

    // Use the data directly since filtering is already handled by useFilteredBusinesses
    const filteredData = data ?? [];

    const bottomContent = useMemo(
      () => (
        <div className="flex w-full flex-col items-center justify-center gap-1 px-1 py-1 sm:gap-1 sm:px-2 sm:py-2 md:gap-2 md:px-3 md:py-3">
          {data.length > 0 && (
            <>
              <div className="flex w-full justify-center">
                <Pagination
                  disableCursorAnimation
                  classNames={{
                    base: 'text-xs gap-0.5 sm:text-sm sm:gap-1 md:text-sm md:gap-1',
                    item: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
                    cursor:
                      'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary-500',
                    next: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
                    prev: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
                    ellipsis: 'w-7 h-7 min-w-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
                    wrapper: 'w-full flex justify-center max-w-full overflow-x-auto px-0',
                  }}
                  siblings={1}
                  boundaries={1}
                  showControls={true}
                  isCompact={isMobile}
                  showShadow={!isXsScreen}
                  dotsJump={1}
                  color="primary"
                  page={currentPage}
                  total={totalPages}
                  onChange={onPageChange}
                  size={isMobile ? 'sm' : 'md'}
                  aria-label="Table pagination"
                />
              </div>

              {/* Only show page info on larger screens */}
              {!isMobile && (
                <div className="text-xs text-default-500 mt-0.5 sm:mt-1">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </>
          )}
        </div>
      ),
      [currentPage, totalPages, onPageChange, isMobile, isXsScreen, data.length],
    );

    // Don't render the table until the component is mounted on the client
    if (!mounted) {
      return (
        <Card className="h-full w-full p-0.5 xs:p-1 sm:p-2 md:p-3 lg:p-4 shadow-md border border-default-200">
          <TableSkeleton rows={10} columns={visibleColumns.length} />
        </Card>
      );
    }

    if (isLoading) {
      return (
        <Card className="h-full w-full p-0.5 xs:p-1 sm:p-2 md:p-3 lg:p-4 shadow-md border border-default-200">
          <TableSkeleton rows={10} columns={visibleColumns.length} />
        </Card>
      );
    }

    return (
      <Card className="h-full w-full p-0.5 xs:p-1 sm:p-2 md:p-3 lg:p-4 shadow-md border border-default-200">
        <div className="flex flex-col gap-4">
          <TableToolbar
            searchTerm={searchTerm}
            onSearch={handleSearchChange}
            selectedKeys={selectedKeys}
            useLocation={useLocation}
            setUseLocation={setUseLocation}
            address={address}
            setAddress={setAddress}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
            setSelectedKeys={setSelectedKeys}
          />

          <div className="w-full overflow-x-auto">
            <VirtualizedTable
              data={filteredData}
              visibleColumns={visibleColumns.map((col) => {
                // Add suggested widths for columns based on content type
                let width: number | undefined;
                switch (col.key) {
                  case 'business_id':
                    width = 80;
                    break;
                  case 'company_name':
                    width = 200;
                    break;
                  case 'street':
                  case 'city':
                    width = 150;
                    break;
                  default:
                    width = 120; // Default column width
                }
                return { ...col, width };
              })}
              selectedKeys={selectedKeys}
              onSelectionChange={handleSelectionChange}
              height={600}
              width={windowWidth - 96} // Adjust for padding and margins
            />
          </div>

          {bottomContent}
        </div>
      </Card>
    );
  },
  arePropsEqual,
);

TableView.displayName = 'TableView';
