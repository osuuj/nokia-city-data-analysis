'use client';

import { DashboardHeader } from '@/features/dashboard/components/controls/DashboardHeader';
import { DashboardSkeleton } from '@/features/dashboard/components/loading/DashboardSkeleton';
import { DashboardErrorBoundary } from '@/features/dashboard/components/shared/DashboardErrorBoundary';
import { ErrorDisplay } from '@/features/dashboard/components/shared/error/ErrorDisplay';
import { useDashboardData } from '@/features/dashboard/hooks/data/useDashboardData';
import { useDashboardLoading } from '@/features/dashboard/hooks/data/useDashboardLoading';
import { useCompanyStore } from '@/features/dashboard/store';
import type { CompanyTableKey, SortDescriptor } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { usePagination } from '@/shared/hooks';
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Lazy load DashboardContent for code splitting
const LazyDashboardContent = lazy(() =>
  import('@/features/dashboard/components/DashboardContent').then((module) => ({
    default: module.DashboardContent,
  })),
);

const ROWS_PER_PAGE = 10;

/**
 * DashboardPage
 * Main entry point for the dashboard feature.
 * Manages overall state and coordinates data fetching and user interactions.
 */
export function DashboardPage() {
  // Global state from Zustand store
  const { selectedCity, selectedIndustries, userLocation, distanceLimit, selectedRows } =
    useCompanyStore();

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
  const {
    geojsonData,
    cities,
    isLoading: isDataLoading,
    cityLoading,
    tableRows,
    visibleColumns,
    handleCityChange,
    errors,
    refetch,
    emptyStateReason,
  } = useDashboardData({
    selectedCity,
    selectedIndustries,
    userLocation,
    distanceLimit,
    query: companySearchTerm,
  });

  // Track loading state
  const { startSectionLoading, stopSectionLoading, isAnySectionLoading } = useDashboardLoading();

  // Setup pagination with edge case handling
  const { paginated, totalPages } = useMemo(() => {
    // Make sure we have data
    if (!tableRows || tableRows.length === 0) {
      // Don't log unless it's a development environment
      if (process.env.NODE_ENV === 'development') {
        // Check if it's an empty state due to filtering or just no data yet
        if (emptyStateReason?.noResults) {
          // We already know the reason, no need to log
        } else {
          // Only log if we truly have no data
          console.debug('No tableRows data, setting empty pagination');
        }
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
  }, [tableRows, pageSize, currentPage, emptyStateReason]);

  // Force update pagination when industry filter changes
  useEffect(() => {
    // When industry filter changes, reset to page 1
    if (selectedIndustries.length > 0) {
      console.log('Industry filters changed, resetting to page 1');
      // Use a small delay to let the data update first
      setTimeout(() => {
        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          // Force a refresh by creating a new array if already on page 1
          if (tableRows && tableRows.length > 0) {
            prevRowsCountRef.current = tableRows.length;
          }
        }
      }, 50);
    }
  }, [selectedIndustries, currentPage, tableRows]);

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      // Don't reset to first page for better UX when increasing page size
      const needsPageReset = newSize < pageSize;

      // Start loading to give user feedback
      startSectionLoading('table', 'Adjusting page size...');

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
          stopSectionLoading('table');
        }, 50);
      }, 0);
    },
    [pageSize, startSectionLoading, stopSectionLoading],
  );

  // Update prev rows count ref when tableRows changes
  useEffect(() => {
    if (tableRows) {
      prevRowsCountRef.current = tableRows.length;
    }
  }, [tableRows]);

  // Update loading state based on data fetching, but prevent unnecessary loading cycles
  useEffect(() => {
    // Prevent recursive updates by using refs to track state
    const isCurrentlyLoading = isDataLoading || cityLoading;
    const wasLoading = prevDataLoadingRef.current || prevCityLoadingRef.current;
    const hasData = tableRows?.length > 0;
    const hasError = errors.geojson || errors.cities;

    // Case 1: Started loading - show loading indicator
    if (isCurrentlyLoading && !wasLoading) {
      startSectionLoading('all', 'Loading dashboard data...');
    }
    // Case 2: Finished loading with data or error - stop loading
    else if (!isCurrentlyLoading && wasLoading && (hasData || hasError)) {
      stopSectionLoading('all');
      dataLoadedOnceRef.current = true;
      stableDataStateRef.current = hasData;
    }

    // Update refs for next render
    prevDataLoadingRef.current = isDataLoading;
    prevCityLoadingRef.current = cityLoading;
  }, [isDataLoading, cityLoading, startSectionLoading, stopSectionLoading, tableRows, errors]);

  // Create prefetch function that returns a Promise
  const prefetchViewData = useCallback(
    async (view: ViewMode): Promise<void> => {
      try {
        // Implement proper prefetching logic for each view type
        switch (view) {
          case 'table':
            // Prefetch data needed for table view
            if (selectedCity) {
              await refetch.geojson();
            }
            break;

          case 'map':
            // Prefetch data needed for map view
            if (selectedCity) {
              await refetch.geojson();
            }
            break;

          case 'split':
            // Prefetch data needed for split view
            if (selectedCity) {
              await refetch.geojson();
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
    },
    [selectedCity, refetch],
  );

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
  const onCityChange = useCallback(
    (city: string) => {
      // Reset data loaded flag when changing city
      dataLoadedOnceRef.current = false;
      stableDataStateRef.current = false;
      startSectionLoading('map', 'Loading city data...');
      handleCityChange(city);
      setCurrentPage(1); // Reset to first page when city changes
    },
    [startSectionLoading, handleCityChange],
  );

  // Handle company search term changes - COMPLETELY SEPARATE from city search
  const onCompanySearchChange = useCallback(
    (value: string) => {
      // Only update if value has changed
      if (companySearchTerm !== value) {
        // Show loading indicator
        startSectionLoading('table', 'Filtering...');

        // Clear previous timeout if it exists
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = null;
        }

        // Set company search term
        setCompanySearchTerm(value);

        // Also update the main search term variable
        setSearchTerm(value);

        // Reset to first page when search changes
        setCurrentPage(1);

        // Debounce search to avoid too many rapid API calls
        searchTimeoutRef.current = setTimeout(() => {
          // Trigger a search refresh if the search term is non-empty
          if (value.trim() !== '') {
            console.log('Triggering search refresh for:', value);
            refetch.search().catch((err) => console.error('Search refresh error:', err));
          }

          // Stop loading after query is applied
          stopSectionLoading('table');
        }, 300);

        // Log for debugging
        console.log('Search term updated:', value);
      }
    },
    [companySearchTerm, startSectionLoading, stopSectionLoading, refetch],
  );

  // Handle city search term changes - COMPLETELY SEPARATE from company search
  const onCitySearchChange = useCallback((value: string) => {
    // Only update city search state, not company search
    setCitySearchTerm(value);
  }, []);

  // Get selected businesses from the store
  const selectedBusinesses = Object.values(selectedRows);

  // Get the first error if any
  const error = useMemo(() => {
    if (errors.geojson) return errors.geojson;
    if (errors.cities) return errors.cities;
    return null;
  }, [errors]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <DashboardHeader
        cities={cities || []}
        selectedCity={selectedCity}
        onCityChange={onCityChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        cityLoading={cityLoading}
        searchTerm={citySearchTerm}
        onSearchChange={onCitySearchChange}
        fetchViewData={prefetchViewData}
        onViewModeChange={onViewModeChange}
      />

      <DashboardErrorBoundary
        componentName="DashboardContent"
        fallback={
          <ErrorDisplay
            message="The dashboard encountered an unexpected error"
            showDetails={process.env.NODE_ENV === 'development'}
          />
        }
      >
        <Suspense fallback={<DashboardSkeleton />}>
          {/* Always render content if a city is selected or we have data */}
          {(tableRows?.length > 0 || isDataLoading || cityLoading || selectedCity) && (
            <LazyDashboardContent
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
              setSearchTerm={onCompanySearchChange}
              sortDescriptor={sortDescriptor}
              setSortDescriptor={setSortDescriptor}
              error={error}
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
