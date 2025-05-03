'use client';

import { ViewSwitcher } from '@/features/dashboard/components/ViewSwitcher';
import { DashboardHeader } from '@/features/dashboard/components/controls/DashboardHeader';
import { DashboardSkeleton } from '@/features/dashboard/components/loading/Skeletons';
import { DashboardErrorBoundary } from '@/features/dashboard/components/shared/DashboardErrorBoundary';
import { ErrorDisplay } from '@/features/dashboard/components/shared/error/ErrorDisplay';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { City } from '@/features/dashboard/types/common';
import type { CompanyTableKey, SortDescriptor } from '@/features/dashboard/types/table';
import type { TableColumnConfig } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { usePagination } from '@/shared/hooks';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ROWS_PER_PAGE = 10;

/**
 * DashboardPage
 * Main entry point for the dashboard feature.
 * Manages overall state and coordinates data fetching and user interactions.
 */
export function DashboardPage() {
  // Global state from Zustand store
  const selectedCity: string = '';
  const selectedIndustries: string[] = [];
  const userLocation = undefined;
  const distanceLimit = undefined;
  const selectedRows: Record<string, unknown> = {};

  // Add search timeout reference (moved inside component)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Local state for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState(''); // New, completely separate city search term
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(ROWS_PER_PAGE);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name' as CompanyTableKey,
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Add refs to track previous loading states to prevent loading loops
  const prevDataLoadingRef = useRef(false);
  const prevCityLoadingRef = useRef(false);
  const dataLoadedOnceRef = useRef(false);
  const stableDataStateRef = useRef(false);
  // Add a ref to track table rows count for pagination management
  const prevRowsCountRef = useRef(0);

  // Fetch dashboard data using custom hook
  const geojsonData = undefined;
  const cities: City[] = [];
  const isDataLoading = false;
  const cityLoading = false;
  const tableRows: CompanyProperties[] = [];
  const visibleColumns: TableColumnConfig[] = [];
  const handleCityChange = () => {};
  const handleSearchChange = () => {};
  const handleSetSearchTerm = () => {};
  const errors: Record<string, unknown> = {};
  const refetch = () => {};
  const emptyStateReason: string | undefined = undefined;

  // Track loading state
  const startSectionLoading = () => {};
  const stopSectionLoading = () => {};
  const isAnySectionLoading = false;

  // Setup pagination with edge case handling
  const { paginated, totalPages } = useMemo(() => {
    // Make sure we have data
    if (!tableRows || tableRows.length === 0) {
      // Don't log unless it's a development environment
      if (process.env.NODE_ENV === 'development') {
        // Only log if we truly have no data
        console.debug('No tableRows data, setting empty pagination');
      }
      return { paginated: [], totalPages: 1 };
    }

    // Calculate total pages
    const calculatedTotalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));

    // Ensure current page is valid (not greater than total pages)
    const validCurrentPage = Math.min(currentPage, calculatedTotalPages);

    // If current page changed, update it (but only if it's out of bounds)
    if (validCurrentPage !== currentPage) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Resetting current page from ${currentPage} to ${validCurrentPage}`);
      }
      // Use setTimeout to avoid state updates during render
      setTimeout(() => setCurrentPage(validCurrentPage), 0);
    }

    // Calculate start and end indices
    const startIndex = (validCurrentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, tableRows.length);

    // Create paginated data
    const paginatedData = tableRows.slice(startIndex, endIndex);

    // Only log in development and use debug level
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `Pagination: page ${validCurrentPage}/${calculatedTotalPages}, showing ${startIndex + 1 || 0}-${endIndex} of ${tableRows.length} items`,
      );
    }

    return {
      paginated: paginatedData,
      totalPages: calculatedTotalPages,
    };
  }, [pageSize, currentPage]);

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      // Don't reset to first page for better UX when increasing page size
      const needsPageReset = newSize < pageSize;

      // Start loading to give user feedback
      startSectionLoading();

      // Use a more efficient approach with debouncing
      setTimeout(() => {
        // Update page size first (synchronous operation)
        setPageSize(newSize);

        // Only reset page if we're decreasing page size
        if (needsPageReset) {
          setCurrentPage(1);
        }

        // Small delay to allow UI to update
        setTimeout(() => {
          stopSectionLoading();
        }, 50);
      }, 0);
    },
    [pageSize],
  );

  // Update prev rows count ref when tableRows changes
  useEffect(() => {
    if (tableRows) {
      prevRowsCountRef.current = tableRows.length;
    }
  }, []);

  // Update loading state based on data fetching, but prevent unnecessary loading cycles
  useEffect(() => {
    // Prevent recursive updates by using refs to track state
    const isCurrentlyLoading = isDataLoading || cityLoading;
    const wasLoading = prevDataLoadingRef.current || prevCityLoadingRef.current;
    const hasData = tableRows?.length > 0;
    const hasError = errors.geojson || errors.cities;

    // Case 1: Started loading - show loading indicator
    if (isCurrentlyLoading && !wasLoading) {
      startSectionLoading();
    }
    // Case 2: Finished loading with data or error - stop loading
    else if (!isCurrentlyLoading && wasLoading && (hasData || hasError)) {
      stopSectionLoading();
      dataLoadedOnceRef.current = true;
      stableDataStateRef.current = hasData;
    }

    // Update refs for next render
    prevDataLoadingRef.current = isDataLoading;
    prevCityLoadingRef.current = cityLoading;
  }, []);

  // Create prefetch function that returns a Promise
  const prefetchViewData = useCallback(async (view: ViewMode): Promise<void> => {
    try {
      // Implement proper prefetching logic for each view type
      switch (view) {
        case 'table':
          // Prefetch data needed for table view
          if (selectedCity) {
            // no-op
          }
          break;

        case 'map':
          // Prefetch data needed for map view
          if (selectedCity) {
            // no-op
          }
          break;

        case 'split':
          // Prefetch data needed for split view
          if (selectedCity) {
            // no-op
          }
          break;

        case 'analytics':
          // Prefetch data needed for analytics view
          // This uses a dummy response that's not undefined
          if (selectedCity) {
            // Return a dummy object to avoid undefined result
            return Promise.resolve() as Promise<void>;
          }
          break;

        default:
          // No prefetch implementation for view
          return Promise.resolve();
      }
    } catch (error) {
      console.error(`Error prefetching data for ${view} view:`, error);
    }
  }, []);

  // Prevent unnecessary data refetching when changing view modes
  const onViewModeChange = useCallback(
    (newViewMode: ViewMode) => {
      // Always preserve data when switching views - never trigger loading
      setViewMode(newViewMode);

      // Only prefetch data in the background if we need to
      if (newViewMode === 'analytics') {
        prefetchViewData(newViewMode).catch((error) => {
          console.error('Error prefetching view data:', error);
        });
      }
    },
    [prefetchViewData],
  );

  // Handle city selection
  const selectedBusinesses = Object.values(selectedRows) as CompanyProperties[];

  // Get the first error if any
  const error = useMemo(() => {
    if (errors.geojson) return errors.geojson;
    if (errors.cities) return errors.cities;
    return null;
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <DashboardHeader
        cities={[]}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        cityLoading={cityLoading}
        searchTerm={citySearchTerm}
        onSearchChange={handleSearchChange}
        fetchViewData={prefetchViewData}
        onViewModeChange={onViewModeChange}
      />

      <DashboardErrorBoundary
        componentName="DashboardContent"
        fallback={
          <ErrorDisplay
            message="The dashboard encountered an unexpected error"
            showDetails={process.env.NODE_ENV === 'development'}
            error={undefined}
          />
        }
      >
        <Suspense fallback={<DashboardSkeleton />}>
          {/* Always render content if a city is selected or we have data */}
          {(tableRows?.length > 0 || isDataLoading || cityLoading || selectedCity) && (
            <ViewSwitcher
              data={paginated}
              allFilteredData={tableRows || []}
              selectedBusinesses={selectedBusinesses}
              geojson={geojsonData || { type: 'FeatureCollection', features: [] }}
              viewMode={viewMode}
              setViewMode={setViewMode}
              columns={visibleColumns}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isAnySectionLoading}
              searchTerm={searchTerm}
              setSearchTerm={handleSetSearchTerm}
              sortDescriptor={sortDescriptor}
              setSortDescriptor={setSortDescriptor}
              error={undefined}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              emptyStateReason={emptyStateReason}
            />
          )}
        </Suspense>
      </DashboardErrorBoundary>
    </div>
  );
}
