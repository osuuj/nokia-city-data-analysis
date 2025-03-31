'use client';

import { MapView } from '@/components/features/map/MapView';
import { TableView } from '@/components/features/table';
import type { ViewSwitcherProps } from '@/types';

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
    <div className="w-full h-full">
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
        <div className="h-[80vh] w-full">
          <MapView geojson={geojson} />
        </div>
      )}

      {viewMode === 'split' && (
        <div className="grid md:grid-cols-2 gap-4">
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
          {geojson && <MapView geojson={geojson} selectedBusinesses={selectedBusinesses} />}
        </div>
      )}
    </div>
  );
}
