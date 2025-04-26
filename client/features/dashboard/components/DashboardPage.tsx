'use client';

import { DashboardHeader } from '@/features/dashboard/components/controls/DashboardHeader';
import { DashboardSkeleton } from '@/features/dashboard/components/loading/DashboardSkeleton';
import { DashboardErrorBoundary } from '@/features/dashboard/components/shared/DashboardErrorBoundary';
import { useDashboardData } from '@/features/dashboard/hooks/data/useDashboardData';
import { useDashboardLoading } from '@/features/dashboard/hooks/data/useDashboardLoading';
import { useCompanyStore } from '@/features/dashboard/store';
import type { CompanyTableKey, SortDescriptor } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { usePagination } from '@/shared/hooks';
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';

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

  // Update loading state based on data fetching
  useEffect(() => {
    if (isDataLoading || cityLoading) {
      startSectionLoading('all', 'Loading dashboard data...');
    } else {
      stopSectionLoading('all');
    }
  }, [isDataLoading, cityLoading, startSectionLoading, stopSectionLoading]);

  // Handle city selection
  const onCityChange = useCallback(
    (city: string) => {
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
  const prefetchViewData = useCallback(async (view: ViewMode) => {
    // Implement your prefetch logic here
    // This could involve fetching data for the new view mode
    // before the user actually switches to it
    console.log(`Prefetching data for view: ${view}`);
    return Promise.resolve();
  }, []);

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

      <DashboardErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
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
        </Suspense>
      </DashboardErrorBoundary>
    </div>
  );
}
