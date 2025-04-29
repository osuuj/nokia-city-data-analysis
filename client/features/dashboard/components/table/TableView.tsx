'use client';

import { FadeIn, ScaleIn } from '@/features/dashboard/components/shared/animations';
import { TableToolbar } from '@/features/dashboard/components/table/toolbar';
import type { CompanyProperties, TableViewProps } from '@/features/dashboard/types';
import { Card, Pagination, Spinner } from '@heroui/react';
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { TableSkeleton } from './skeletons/TableSkeleton';

// Lazy load VirtualizedTable component for code splitting
const VirtualizedTable = lazy(() =>
  import('./VirtualizedTable').then((module) => ({
    default: module.VirtualizedTable,
  })),
);

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

export const TableView: React.FC<TableViewComponentProps> = React.memo(
  ({
    data,
    allFilteredData: _allFilteredData,
    columns,
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortDescriptor,
    setSortDescriptor,
  }) => {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [useLocation, setUseLocation] = useState(false);
    const [address, setAddress] = useState('');
    const [windowWidth, setWindowWidth] = useState(
      typeof window !== 'undefined' ? window.innerWidth : 1024,
    );

    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchTerm(value);
      },
      [setSearchTerm],
    );

    const handleSelectionChange = useCallback((keys: Set<string>) => {
      setSelectedKeys(keys);
    }, []);

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Transform columns to match VirtualizedTable props
    const transformedColumns = useMemo(() => {
      return columns.map((col) => ({
        key: col.key,
        label: col.label,
        visible: true,
        userVisible: true,
      }));
    }, [columns]);

    // Create pagination content
    const bottomContent = useMemo(() => {
      const isMobile = windowWidth < 640;
      const isXsScreen = windowWidth < 400;

      // Calculate the range of items being displayed
      const startItem = _allFilteredData.length > 0 ? (currentPage - 1) * 10 + 1 : 0;
      const endItem = Math.min(currentPage * 10, _allFilteredData.length);

      return (
        <div className="flex w-full flex-col items-center justify-center gap-1 px-1 py-1 sm:gap-1 sm:px-2 sm:py-2 md:gap-2 md:px-3 md:py-3">
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
        </div>
      );
    }, [currentPage, totalPages, onPageChange, windowWidth, _allFilteredData]);

    return (
      <ScaleIn>
        <Card className="w-full">
          <FadeIn>
            <TableToolbar
              searchTerm={searchTerm}
              onSearch={handleSearchChange}
              selectedKeys={selectedKeys}
              useLocation={useLocation}
              setUseLocation={setUseLocation}
              setAddress={setAddress}
              sortDescriptor={sortDescriptor}
              setSortDescriptor={setSortDescriptor}
              setSelectedKeys={setSelectedKeys}
            />
          </FadeIn>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Suspense fallback={<TableSkeleton />}>
                <VirtualizedTable
                  data={data}
                  visibleColumns={transformedColumns}
                  selectedKeys={selectedKeys}
                  onSelectionChange={handleSelectionChange}
                  height={600}
                  width={windowWidth - 96} // Adjust for padding and margins
                />
              </Suspense>
              {bottomContent}
            </>
          )}
        </Card>
      </ScaleIn>
    );
  },
  arePropsEqual,
);

export default TableView;
