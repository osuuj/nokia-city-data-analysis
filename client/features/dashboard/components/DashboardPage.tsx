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

  // Local state for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
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
  } = useDashboardData({
    selectedCity,
    selectedIndustries,
    userLocation,
    distanceLimit,
    query: companySearchTerm,
  });

  // Track loading state
  const { startSectionLoading, stopSectionLoading, isAnySectionLoading } = useDashboardLoading();

  // Setup pagination
  const { paginated, totalPages } = usePagination(tableRows || [], currentPage, pageSize);

  // Handle page size change
  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
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

  // Handle company search term changes
  const onCompanySearchChange = (value: string) => {
    setCompanySearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

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
        searchTerm={searchTerm}
        onSearchChange={onCompanySearchChange}
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
            />
          )}
        </Suspense>
      </DashboardErrorBoundary>
    </div>
  );
}
