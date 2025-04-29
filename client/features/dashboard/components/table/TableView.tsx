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
              address={address}
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
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={onPageChange}
                    showControls
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </ScaleIn>
    );
  },
  arePropsEqual,
);

export default TableView;
