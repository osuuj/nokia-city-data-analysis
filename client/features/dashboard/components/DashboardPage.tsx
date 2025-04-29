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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name' as CompanyTableKey,
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Add refs to track previous loading states to prevent loading loops
  const prevDataLoadingRef = useRef(false);
  const prevCityLoadingRef = useRef(false);
  const dataLoadedOnceRef = useRef(false);

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
    query: searchTerm,
  });

  // Track loading state
  const { startSectionLoading, stopSectionLoading, isAnySectionLoading } = useDashboardLoading();

  // Setup pagination
  const { paginated, totalPages } = usePagination(tableRows || [], currentPage, ROWS_PER_PAGE);

  // Update loading state based on data fetching, but prevent unnecessary loading cycles
  useEffect(() => {
    // Only show loading if we transitioned from not loading to loading
    if (
      (isDataLoading && !prevDataLoadingRef.current) ||
      (cityLoading && !prevCityLoadingRef.current)
    ) {
      startSectionLoading('all', 'Loading dashboard data...');
    }
    // Only stop loading if we have data and we're no longer loading
    else if (
      (!isDataLoading && prevDataLoadingRef.current) ||
      (!cityLoading && prevCityLoadingRef.current)
    ) {
      // Only stop loading if we actually have data, or if there's an error
      if (tableRows?.length > 0 || errors.geojson || errors.cities) {
        stopSectionLoading('all');
        dataLoadedOnceRef.current = true;
      }
    }

    // If we have data but loading was triggered again, stop the loading
    if (!isDataLoading && !cityLoading && dataLoadedOnceRef.current && isAnySectionLoading) {
      stopSectionLoading('all');
    }

    // Update refs for next render
    prevDataLoadingRef.current = isDataLoading;
    prevCityLoadingRef.current = cityLoading;
  }, [
    isDataLoading,
    cityLoading,
    startSectionLoading,
    stopSectionLoading,
    tableRows,
    errors,
    isAnySectionLoading,
  ]);

  // Handle city selection
  const onCityChange = useCallback(
    (city: string) => {
      // Reset data loaded flag when changing city
      dataLoadedOnceRef.current = false;
      startSectionLoading('map', 'Loading city data...');
      handleCityChange(city);
      setCurrentPage(1); // Reset to first page when city changes
    },
    [startSectionLoading, handleCityChange],
  );

  // Handle search term changes
  const onSearchChange = useCallback(
    (term: string) => {
      startSectionLoading('table', 'Searching...');
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page when search changes
    },
    [startSectionLoading],
  );

  // Get selected businesses from the store
  const selectedBusinesses = Object.values(selectedRows);

  // Get the first error if any
  const error = useMemo(() => {
    if (errors.geojson) return errors.geojson;
    if (errors.cities) return errors.cities;
    return null;
  }, [errors]);

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
        onSearchChange={onSearchChange}
        fetchViewData={prefetchViewData}
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
          {/* Only render content if we have data or we're intentionally loading */}
          {(tableRows?.length > 0 || isDataLoading || cityLoading) && (
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
              setSearchTerm={onSearchChange}
              sortDescriptor={sortDescriptor}
              setSortDescriptor={setSortDescriptor}
              error={error}
            />
          )}
        </Suspense>
      </DashboardErrorBoundary>
    </div>
  );
}
