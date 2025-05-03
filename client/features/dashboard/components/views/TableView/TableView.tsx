'use client';

import { FadeIn, ScaleIn } from '@/features/dashboard/components/shared/animations';
import type {
  CompanyProperties,
  CompanyTableKey,
  TableColumnConfig,
  TableViewProps,
} from '@/features/dashboard/types';
import { Card, Pagination, Select, SelectItem, Spinner } from '@heroui/react';
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TableSkeleton } from './skeletons/TableSkeleton';
import { TableToolbar } from './toolbar';

// Lazy load VirtualizedTable component for code splitting
const VirtualizedTable = lazy(() =>
  import('./VirtualizedTable').then((module) => ({
    default: module.VirtualizedTable,
  })),
);

interface TableViewComponentProps extends TableViewProps {
  allFilteredData: CompanyProperties[];
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  emptyStateReason: string;
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
    prevProps.sortDescriptor.direction === nextProps.sortDescriptor.direction &&
    prevProps.pageSize === nextProps.pageSize &&
    prevProps.emptyStateReason === nextProps.emptyStateReason
  );
};

export const TableViewComponent: React.FC<TableViewComponentProps> = React.memo(
  ({
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
    pageSize = 10,
    onPageSizeChange,
    emptyStateReason,
  }) => {
    // Get selections and filteredBusinessIds from store to maintain state across pagination
    // Use separate selectors to avoid infinite re-renders
    const storeSelectedKeys: string[] = [];
    const filteredBusinessIds: string[] = [];

    // Local state for tracking selected keys - initialized from the store
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
      new Set(Array.from(storeSelectedKeys).filter((id) => filteredBusinessIds.includes(id))),
    );

    const [useLocation, setUseLocation] = useState(false);
    const [address, setAddress] = useState('');
    const [windowWidth, setWindowWidth] = useState(
      typeof window !== 'undefined' ? window.innerWidth : 1024,
    );

    // Track previous data to prevent unnecessary loading states
    const prevDataRef = useRef<CompanyProperties[]>([]);
    const prevPageSizeRef = useRef<number>(pageSize);
    const [effectiveIsLoading, setEffectiveIsLoading] = useState(isLoading);

    // Cache rendered data to improve performance when changing page size
    const dataCache = useRef<Record<string, CompanyProperties[]>>({});

    // Get visible columns from company store - must be at top level, not inside hooks
    const storeVisibleColumns: TableColumnConfig[] = [];

    // Sync local selectedKeys with store selection when filteredBusinessIds change
    useEffect(() => {
      // Only update if the sets are actually different to prevent render loops
      const filteredStoreKeys = Array.from(storeSelectedKeys).filter((id) =>
        filteredBusinessIds.includes(id),
      );
      if (
        filteredStoreKeys.length !== selectedKeys.size ||
        !filteredStoreKeys.every((id) => selectedKeys.has(id))
      ) {
        setSelectedKeys(new Set(filteredStoreKeys));
      }
    }, [selectedKeys]); // removed filteredBusinessIds, storeSelectedKeys from dependencies

    // Check if we're switching page size and cache the current page of data
    useEffect(() => {
      // When page size changes, cache the current data
      if (prevPageSizeRef.current !== pageSize) {
        // Clean cache when page size changes to prevent memory issues
        dataCache.current = {};
        prevPageSizeRef.current = pageSize;
      }

      // Cache data for current page size and page number
      if (data.length > 0 && !isLoading) {
        const cacheKey = `${pageSize}-${currentPage}`;
        dataCache.current[cacheKey] = [...data];
      }
    }, [data, pageSize, currentPage, isLoading]);

    // Determine if we should show loading spinner or keep showing previous data
    useEffect(() => {
      if (!isLoading) {
        // When loading completes, update previous data reference and set effective loading to false
        prevDataRef.current = data;
        setEffectiveIsLoading(false);
      } else if (isLoading && prevDataRef.current.length === 0) {
        // Only show loading on first load or when we have no previous data
        setEffectiveIsLoading(true);
      } else if (
        isLoading &&
        data &&
        data.length > 0 &&
        JSON.stringify(data) !== JSON.stringify(prevDataRef.current)
      ) {
        // Show loading only if the data is actually different
        setEffectiveIsLoading(true);

        // For better UX during filtering, use a short timeout to prevent flickering
        const timer = setTimeout(() => {
          setEffectiveIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
      }
      // Keep showing previous data if the city selection is the same
    }, [isLoading, data]);

    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchTerm(value);
      },
      [setSearchTerm],
    );

    // Update the store with the new selection and maintain local state
    const handleSelectionChange = useCallback(
      (keys: Set<string>) => {
        // Only update if the keys are different from current selection to prevent loops
        if (
          keys.size !== selectedKeys.size ||
          Array.from(keys).some((key) => !selectedKeys.has(key))
        ) {
          setSelectedKeys(keys);
        }
      },
      [selectedKeys], // removed allFilteredData from dependencies
    );

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Transform columns to match VirtualizedTable props, respecting the visibility from the store
    const transformedColumns = useMemo(() => {
      // Use a Map for fast lookup of visibility status
      const visibilityMap = new Map(storeVisibleColumns.map((col) => [col.key, true]));
      return columns.map((col) => ({
        ...col,
        visible: visibilityMap.has(col.key),
        userVisible: col.userVisible,
      }));
    }, [columns]); // removed storeVisibleColumns from dependencies

    // Handle sort change
    const handleSortChange = useCallback(
      (column: string) => {
        setSortDescriptor((prev) => {
          if (prev.column === column) {
            // Toggle direction if same column
            return {
              column,
              direction: prev.direction === 'ascending' ? 'descending' : 'ascending',
            };
          }
          // Default to ascending if new column
          return {
            column,
            direction: 'ascending',
          };
        });
      },
      [setSortDescriptor],
    );

    const pageSizeOptions = [
      { value: '10', label: '10' },
      { value: '20', label: '20' },
      { value: '50', label: '50' },
      { value: '100', label: '100' },
    ];

    const handlePageSizeChange = useCallback(
      (value: string) => {
        if (onPageSizeChange) {
          onPageSizeChange(Number(value));
        }
      },
      [onPageSizeChange],
    );

    // If we're searching, filtering, or the data hasn't loaded yet, show a skeleton for better UX
    if (data.length === 0 && searchTerm && !effectiveIsLoading) {
      // Show empty state for search with no results
      return (
        <Card className="min-h-[400px] flex flex-col">
          <TableToolbar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            columns={transformedColumns}
            selectedCount={selectedKeys.size}
            useLocation={useLocation}
            setUseLocation={setUseLocation}
            address={address}
            setAddress={setAddress}
          />
          <div className="flex-grow flex items-center justify-center p-10 text-center">
            <div>
              <p className="text-lg font-medium mb-2">No results found for "{searchTerm}"</p>
              <p className="text-gray-500">Try a different search term or clear filters</p>
            </div>
          </div>
        </Card>
      );
    }

    if (data.length === 0 && !effectiveIsLoading && emptyStateReason) {
      // Show custom empty state reason
      return (
        <Card className="min-h-[400px] flex flex-col">
          <TableToolbar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            columns={transformedColumns}
            selectedCount={selectedKeys.size}
            useLocation={useLocation}
            setUseLocation={setUseLocation}
            address={address}
            setAddress={setAddress}
          />
          <div className="flex-grow flex items-center justify-center p-10 text-center">
            <div>
              <p className="text-lg font-medium mb-2">No data available</p>
              <p className="text-gray-500">{emptyStateReason}</p>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="w-full min-h-[400px] flex flex-col overflow-hidden">
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          columns={transformedColumns}
          selectedCount={selectedKeys.size}
          useLocation={useLocation}
          setUseLocation={setUseLocation}
          address={address}
          setAddress={setAddress}
        />

        <div className="flex-1 relative overflow-hidden">
          {effectiveIsLoading ? (
            <ScaleIn>
              <TableSkeleton columns={transformedColumns.filter((col) => col.visible)} />
            </ScaleIn>
          ) : (
            <Suspense
              fallback={<TableSkeleton columns={transformedColumns.filter((col) => col.visible)} />}
            >
              <div className="h-full">
                <VirtualizedTable
                  data={data}
                  columns={transformedColumns}
                  sortDescriptor={sortDescriptor}
                  onSortChange={handleSortChange}
                  selectedKeys={selectedKeys}
                  onSelectionChange={handleSelectionChange}
                  rowHeight={48}
                  windowWidth={windowWidth}
                />
              </div>
            </Suspense>
          )}
        </div>

        <div className="px-4 py-2 flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Rows per page:</span>
            <Select
              size="sm"
              selectedKeys={[pageSize.toString()]}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="min-w-16"
            >
              {pageSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Pagination
            total={totalPages}
            color="default"
            page={currentPage}
            onChange={onPageChange}
            isCompact={windowWidth < 768}
            showControls
            showShadow={false}
            size="sm"
            className="items-center"
          />
        </div>
      </Card>
    );
  },
  arePropsEqual,
);
