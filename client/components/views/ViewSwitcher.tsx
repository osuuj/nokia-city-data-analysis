'use client';

import { MapView } from '@/components/map/MapView';
import { TableView } from '@/components/table/TableView';
import type { Business } from '@/types/business';
import type { TableViewProps } from '@/types/table';
import type { ViewMode } from '@/types/view';

interface ViewSwitcherProps extends Omit<TableViewProps, 'data'> {
  data: Business[];
  allFilteredData: Business[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

/**
 * ViewSwitcher
 * Controls display of TableView, MapView, or both in split layout.
 */
export function ViewSwitcher({
  data,
  allFilteredData,
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

      {viewMode === 'map' && (
        <div className="h-[80vh] w-full">
          <MapView businesses={data} />
        </div>
      )}

      {viewMode === 'split' && (
        <div className="flex flex-col md:flex-row gap-4 w-full h-full">
          <div className="md:w-1/2 w-full">
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
          <div className="md:w-1/2 w-full h-[80vh]">
            <MapView businesses={data} />
          </div>
        </div>
      )}
    </div>
  );
}
