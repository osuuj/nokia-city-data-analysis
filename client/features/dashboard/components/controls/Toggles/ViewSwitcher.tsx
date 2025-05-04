'use client';

import { AnalyticsView } from '@/features/dashboard/components/views/AnalyticsView';
import { MapView } from '@/features/dashboard/components/views/MapView';
import { TableView } from '@/features/dashboard/components/views/TableView';
import type { ViewSwitcherProps } from '@/features/dashboard/types/view';

/**
 * ViewSwitcher
 * Controls display of TableView, MapView, or both in split layout.
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
      )}

      {viewMode === 'map' && geojson && (
        <div className="h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] w-full">
          <MapView geojson={geojson} selectedBusinesses={selectedBusinesses} />
        </div>
      )}

      {viewMode === 'split' && (
        <div className="flex flex-col lg:flex-row lg:gap-4">
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
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
          </div>
          {geojson && (
            <div className="w-full lg:w-1/2 h-[50vh] sm:h-[55vh] lg:h-auto lg:min-h-[70vh] border border-default-200 rounded-lg">
              <div className="h-full w-full">
                <MapView geojson={geojson} selectedBusinesses={selectedBusinesses} />
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="w-full">
          <AnalyticsView />
        </div>
      )}
    </div>
  );
}
