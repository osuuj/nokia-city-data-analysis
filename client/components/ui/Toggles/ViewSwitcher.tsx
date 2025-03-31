'use client';

import { MapView } from '@/components/features/map/MapView';
import { TableView } from '@/components/features/table';
import type { CompanyProperties, ViewSwitcherProps } from '@/types';

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
  allFilteredData, // Add this prop
}: ViewSwitcherProps & { allFilteredData: CompanyProperties[] }) {
  return (
    <div className="w-full h-full">
      {viewMode === 'table' && (
        <TableView
          data={data}
          allFilteredData={allFilteredData} // Ensure all filtered data is passed
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
        <div className="h-[80vh] w-full">
          <MapView geojson={geojson} />
        </div>
      )}

      {viewMode === 'split' && geojson && (
        <div className="flex flex-col md:flex-row gap-4 w-full h-full">
          <div className="md:w-1/2 w-full">
            <TableView
              data={data}
              allFilteredData={allFilteredData} // Ensure all filtered data is passed
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
          <div className="md:w-1/2 w-full h-[80vh]">
            <MapView geojson={geojson} />
          </div>
        </div>
      )}
    </div>
  );
}
