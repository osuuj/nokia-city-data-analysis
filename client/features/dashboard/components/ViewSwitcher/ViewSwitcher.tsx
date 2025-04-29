'use client';

import type { ViewSwitcherProps } from '@/features/dashboard/types';
import { Suspense, lazy } from 'react';
import { AnalyticsCardSkeleton } from '../analytics-skeletons';
import { TableSkeleton } from '../table/skeletons/TableSkeleton';

// Lazy load components for code splitting
const AnalyticsView = lazy(() =>
  import('@/features/dashboard/views/AnalyticsView').then((module) => ({
    default: module.AnalyticsView,
  })),
);
const MapView = lazy(() =>
  import('@/features/dashboard/components/map/MapView').then((module) => ({
    default: module.MapView,
  })),
);
const TableView = lazy(() =>
  import('@/features/dashboard/components/table/TableView').then((module) => ({
    default: module.TableView,
  })),
);

/**
 * ViewSwitcher
 * Controls display of TableView, MapView, or both in split layout.
 * Uses React.lazy for code splitting to improve initial load performance.
 */
export function ViewSwitcher({
  data,
  geojson,
  viewMode,
  setViewMode,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  searchTerm,
  setSearchTerm,
  sortDescriptor,
  setSortDescriptor,
  allFilteredData,
  selectedBusinesses,
}: ViewSwitcherProps) {
  return (
    <div className="w-full">
      {viewMode === 'table' && (
        <Suspense fallback={<TableSkeleton />}>
          <TableView
            data={data}
            allFilteredData={allFilteredData}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
          />
        </Suspense>
      )}

      {viewMode === 'map' && geojson && (
        <div className="h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] w-full">
          <Suspense
            fallback={
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
              </div>
            }
          >
            <MapView geojson={geojson} />
          </Suspense>
        </div>
      )}

      {viewMode === 'split' && (
        <div className="flex flex-col lg:flex-row lg:gap-4">
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
            <Suspense fallback={<TableSkeleton />}>
              <TableView
                data={data}
                allFilteredData={allFilteredData}
                columns={columns}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortDescriptor={sortDescriptor}
                setSortDescriptor={setSortDescriptor}
              />
            </Suspense>
          </div>
          {geojson && (
            <div className="w-full lg:w-1/2 h-[50vh] sm:h-[55vh] lg:h-auto lg:min-h-[70vh] border border-default-200 rounded-lg">
              <div className="h-full w-full">
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                    </div>
                  }
                >
                  <MapView geojson={geojson} selectedBusinesses={selectedBusinesses} />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="w-full">
          <Suspense fallback={<AnalyticsCardSkeleton type="distribution" />}>
            <AnalyticsView />
          </Suspense>
        </div>
      )}
    </div>
  );
}
