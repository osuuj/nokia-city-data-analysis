'use client';

import { FadeIn, ScaleIn } from '@/features/dashboard/components/shared/animations';
import { TableToolbar } from '@/features/dashboard/components/table/toolbar';
import { useCompanyStore } from '@/features/dashboard/store';
import type {
  CompanyProperties,
  CompanyTableKey,
  TableViewProps,
} from '@/features/dashboard/types';
import { Card, Pagination, Select, SelectItem, Spinner } from '@heroui/react';
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TableSkeleton } from './skeletons/TableSkeleton';

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

export const TableView: React.FC<TableViewComponentProps> = React.memo(
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
    const storeSelectedKeys = useCompanyStore((state) => state.selectedKeys);
    const filteredBusinessIds = useCompanyStore((state) => state.filteredBusinessIds);

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
    const storeVisibleColumns = useCompanyStore((state) => state.visibleColumns);

    // Sync local selectedKeys with store selection when filteredBusinessIds change
    useEffect(() => {
      // Only update if the sets are actually different to prevent render loops
      const filteredStoreKeys = Array.from(storeSelectedKeys).filter((id) =>
        filteredBusinessIds.includes(id),
      );

      // Check if current selectedKeys matches filtered store keys
      const currentKeys = Array.from(selectedKeys);
      const needsUpdate =
        filteredStoreKeys.length !== currentKeys.length ||
        filteredStoreKeys.some((id) => !selectedKeys.has(id));

      if (needsUpdate) {
        setSelectedKeys(new Set(filteredStoreKeys));
      }
    }, [filteredBusinessIds, storeSelectedKeys, selectedKeys]); // Add selectedKeys to dependencies

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
        const currentKeysArray = Array.from(selectedKeys);
        const newKeysArray = Array.from(keys);

        // Check if there's an actual change in the selection
        const hasSelectionChanged =
          currentKeysArray.length !== newKeysArray.length ||
          currentKeysArray.some((id) => !keys.has(id));

        if (hasSelectionChanged) {
          // Update local state first
          setSelectedKeys(keys);

          // Update the global store with the new selection
          // setSelectedKeys in the store handles both the keys and rows
          useCompanyStore.getState().setSelectedKeys(keys, allFilteredData);
        }
      },
      [allFilteredData, selectedKeys],
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
        key: col.key,
        label: col.label,
        visible: visibilityMap.has(col.key), // Use visibility from store
        userVisible: col.userVisible,
      }));
    }, [columns, storeVisibleColumns]); // Add storeVisibleColumns as dependency

    // Handle sort change
    const handleSortChange = useCallback(
      (column: string) => {
        setSortDescriptor((prev) => {
          if (prev.column === column) {
            // Toggle direction if same column
            return {
              ...prev,
              direction: prev.direction === 'asc' ? 'desc' : 'asc',
            };
          }
          // New column, default to ascending
          return {
            column: column as CompanyTableKey,
            direction: 'asc',
          };
        });
      },
      [setSortDescriptor],
    );

    // Handle page size change
    const handlePageSizeChange = useCallback(
      (
        e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string }; keys?: Set<string> },
      ) => {
        if (onPageSizeChange) {
          // Get the selected key from the selection
          let newSize: string | null = e.target.value;

          // Check if this is a SelectionEvent with keys
          if (!newSize && 'keys' in e && e.keys && e.keys.size > 0) {
            newSize = Array.from(e.keys)[0];
          }

          if (newSize) {
            onPageSizeChange(Number.parseInt(String(newSize), 10));
          }
        }
      },
      [onPageSizeChange],
    );

    // Create pagination content
    const bottomContent = useMemo(() => {
      const isMobile = windowWidth < 640;
      const isXsScreen = windowWidth < 400;

      // Calculate the range of items being displayed
      const startItem = allFilteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
      const endItem = Math.min(currentPage * pageSize, allFilteredData.length);

      // Page size options
      const pageSizes = ['10', '25', '50', '100'];

      // Force showing pagination even if data is changing
      const displayTotalPages = totalPages > 0 ? totalPages : 1;

      return (
        <div className="flex w-full flex-col items-center justify-center gap-1 px-1 py-1 sm:gap-1 sm:px-2 sm:py-2 md:gap-2 md:px-3 md:py-3">
          <div className="flex w-full flex-wrap items-center px-2 gap-y-2">
            {/* Page size selector - left aligned, full width on mobile */}
            <div className="flex items-center gap-2 text-xs sm:text-sm w-full xs:w-1/3 justify-center xs:justify-start">
              <span className="text-gray-600 inline">Show:</span>
              <Select
                size="sm"
                aria-label="Page size"
                defaultSelectedKeys={[pageSize.toString()]}
                onSelectionChange={(keys) => {
                  if (onPageSizeChange && keys !== 'all') {
                    // Optimize performance by implementing a direct callback
                    if (keys instanceof Set && keys.size > 0) {
                      const newSize = Array.from(keys)[0] as string;

                      // START OPTIMIZED CODE
                      // Immediately update UI to show loading
                      setEffectiveIsLoading(true);

                      // Use a more efficient async approach with immediate UI update
                      const numericSize = Number.parseInt(newSize, 10);

                      // CRITICAL: Store current data as fallback during transition
                      prevDataRef.current = data.length ? [...data] : prevDataRef.current;

                      // Use microtask to avoid blocking the UI
                      Promise.resolve().then(() => {
                        // Apply the page size change - this is a synchronous operation
                        if (onPageSizeChange) {
                          onPageSizeChange(numericSize);
                        }

                        // Use another microtask to update loading state after render
                        Promise.resolve().then(() => {
                          // After a brief delay to allow rendering, show the results
                          setTimeout(() => {
                            setEffectiveIsLoading(false);
                          }, 50);
                        });
                      });
                      // END OPTIMIZED CODE
                    }
                  }
                }}
                popoverProps={{
                  shouldFlip: true,
                  placement: 'top',
                }}
                className="w-20 min-w-unit-16"
                classNames={{
                  trigger: 'h-8',
                  value: 'text-small',
                  popoverContent: 'z-50',
                }}
                isDisabled={!onPageSizeChange || effectiveIsLoading}
              >
                {pageSizes.map((size) => (
                  <SelectItem key={size}>{size}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Pagination - centered, full width on mobile */}
            <div className="flex-grow flex justify-center w-full xs:w-auto order-first xs:order-none">
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
                  wrapper: 'flex justify-center w-full overflow-x-auto px-0',
                }}
                siblings={isXsScreen ? 0 : 1}
                boundaries={isXsScreen ? 0 : 1}
                showControls={true}
                isCompact={isMobile}
                showShadow={!isXsScreen}
                dotsJump={1}
                color="primary"
                page={currentPage}
                total={displayTotalPages}
                onChange={onPageChange}
                size={isMobile ? 'sm' : 'md'}
                aria-label="Table pagination"
              />
            </div>

            {/* Item count - right aligned, full width on mobile */}
            <div className="w-full xs:w-1/3 text-center xs:text-right text-xs sm:text-sm">
              <span className="text-gray-600">
                {startItem}-{endItem} of {allFilteredData.length}
              </span>
            </div>
          </div>
        </div>
      );
    }, [
      currentPage,
      totalPages,
      onPageChange,
      windowWidth,
      allFilteredData,
      pageSize,
      onPageSizeChange,
      effectiveIsLoading,
      data, // Add data as dependency to refresh when filtered data changes
    ]);

    // Use the actual data if available, or the previous data if we're in the middle of a reload
    const displayData = useMemo(() => {
      // If we're loading, try to use cached data first for better perceived performance
      if (effectiveIsLoading) {
        const cacheKey = `${pageSize}-${currentPage}`;
        const cachedData = dataCache.current[cacheKey];

        // Use cached data if available
        if (cachedData && cachedData.length > 0) {
          return cachedData;
        }

        // Fall back to previous data if available
        if (prevDataRef.current.length > 0) {
          return prevDataRef.current;
        }
      }

      // Otherwise use current data
      return data;
    }, [data, effectiveIsLoading, pageSize, currentPage]);

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
              setSelectedKeys={handleSelectionChange}
              allFilteredData={allFilteredData}
            />
          </FadeIn>

          {/* Only show empty state message if we have an empty state reason and no data */}
          {!effectiveIsLoading && displayData.length === 0 && allFilteredData.length === 0 && (
            <div className="flex justify-center items-center p-10 text-gray-500">
              <div className="text-center">
                <p className="text-lg font-semibold">{emptyStateReason || 'No companies found'}</p>
                <p className="text-sm mt-2">
                  {emptyStateReason?.includes('distance') ? (
                    <>
                      Try increasing the distance range or select a different location.
                      <button
                        type="button"
                        onClick={() => useCompanyStore.getState().setDistanceLimit(null)}
                        className="text-primary-500 ml-1 underline hover:text-primary-700"
                      >
                        Reset distance filter
                      </button>
                    </>
                  ) : emptyStateReason?.includes('industry') ? (
                    <>
                      Try selecting different industries or clear your filters.
                      <button
                        type="button"
                        onClick={() => useCompanyStore.getState().setSelectedIndustries([])}
                        className="text-primary-500 ml-1 underline hover:text-primary-700"
                      >
                        Reset industry filters
                      </button>
                    </>
                  ) : (
                    'Try adjusting your filters or search criteria.'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Only render the table if we have data or we're loading and have previous data */}
          {(displayData.length > 0 || (effectiveIsLoading && prevDataRef.current.length > 0)) && (
            <Suspense fallback={<TableSkeleton />}>
              <VirtualizedTable
                data={displayData}
                visibleColumns={transformedColumns.filter((col) => col.visible)}
                selectedKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
                height={600}
                width={windowWidth - 96} // Adjust for padding and margins
                sortDescriptor={sortDescriptor}
                onSortChange={handleSortChange}
                isLoading={effectiveIsLoading && prevDataRef.current.length === 0} // Only show loading if we have no previous data
              />
            </Suspense>
          )}

          {/* Show skeleton only when first loading with no previous data */}
          {effectiveIsLoading &&
            displayData.length === 0 &&
            prevDataRef.current.length === 0 &&
            !emptyStateReason && <TableSkeleton />}

          {/* Always show pagination, regardless of loading state */}
          {bottomContent}
        </Card>
      </ScaleIn>
    );
  },
  arePropsEqual,
);

export default TableView;
