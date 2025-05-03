'use client';

import { ViewSwitcher } from '@/features/dashboard/components/ViewSwitcher';
import { DashboardHeader } from '@/features/dashboard/components/controls/DashboardHeader';
import { DashboardSkeleton } from '@/features/dashboard/components/loading/Skeletons';
import { DashboardErrorBoundary } from '@/features/dashboard/components/shared/DashboardErrorBoundary';
import { ErrorDisplay } from '@/features/dashboard/components/shared/error/ErrorDisplay';
import { useDashboardLoading } from '@/features/dashboard/hooks/useDashboardLoading';
import { useDashboardPagination } from '@/features/dashboard/hooks/useDashboardPagination';
import { useDashboardState } from '@/features/dashboard/hooks/useDashboardState';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import { Suspense, useMemo } from 'react';

/**
 * DashboardPage
 * Main entry point for the dashboard feature.
 * Uses custom hooks for state management and data fetching.
 */
export function DashboardPage() {
  // Use custom hooks for state management
  const {
    searchTerm,
    citySearchTerm,
    currentPage,
    pageSize,
    sortDescriptor,
    viewMode,
    selectedCity,
    selectedRows,
    tableRows,
    isDataLoading,
    cityLoading,
    visibleColumns,
    geojsonData,
    emptyStateReason,
    errors,

    setCurrentPage,
    setSortDescriptor,
    handleSetSearchTerm,
    handleCityChange,
    handleCitySearchChange,
    handlePageSizeChange,
    prefetchViewData,
    onViewModeChange,
  } = useDashboardState();

  // Use loading hook
  const { isAnySectionLoading } = useDashboardLoading({
    isDataLoading,
    cityLoading,
    tableRows,
    errors,
  });

  // Use pagination hook
  const { paginated, totalPages } = useDashboardPagination({
    tableRows,
    currentPage,
    pageSize,
    setCurrentPage,
  });

  // Handle selected businesses
  const selectedBusinesses = useMemo<CompanyProperties[]>(() => {
    return Object.values(selectedRows || {});
  }, [selectedRows]);

  // Get the first error if any
  const error = useMemo<Error | null>(() => {
    if (errors?.geojson) {
      return errors.geojson as Error;
    }
    if (errors?.cities) {
      return errors.cities as Error;
    }
    return null;
  }, [errors]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <DashboardHeader
        cities={[]}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        viewMode={viewMode}
        setViewMode={onViewModeChange}
        cityLoading={cityLoading}
        searchTerm={citySearchTerm}
        onSearchChange={handleCitySearchChange}
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
              setViewMode={onViewModeChange}
              columns={visibleColumns || []}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isAnySectionLoading}
              searchTerm={searchTerm}
              setSearchTerm={handleSetSearchTerm}
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
