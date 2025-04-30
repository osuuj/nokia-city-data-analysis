import type {
  CompanyProperties,
  SortDescriptor,
  TableColumnConfig,
  ViewMode,
} from '@/features/dashboard/types';
import type { FeatureCollection, Point } from 'geojson';
import type { Dispatch, SetStateAction } from 'react';
import { Suspense, lazy, useMemo } from 'react';
import { TableView } from './table/TableView';

export interface ViewSwitcherProps {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
  selectedBusinesses: CompanyProperties[];
  geojson: FeatureCollection<Point, CompanyProperties>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  columns: TableColumnConfig[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  emptyStateReason?: {
    noResults: boolean;
    reason: 'distance' | 'industry' | 'search' | 'none';
    message: string;
  };
}

/**
 * ViewSwitcher component handles switching between different dashboard views
 * (table, map, analytics) while maintaining consistent state across all views.
 */
export function ViewSwitcher({
  data,
  allFilteredData,
  selectedBusinesses,
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
  pageSize,
  onPageSizeChange,
  emptyStateReason,
}: ViewSwitcherProps) {
  // Format empty state message for display
  const emptyStateMessage = useMemo(() => {
    if (!emptyStateReason || !emptyStateReason.noResults) return 'No data available';
    return emptyStateReason.message || 'No companies found';
  }, [emptyStateReason]);

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
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          emptyStateReason={emptyStateMessage}
        />
      )}
      {/* Other view modes go here */}
    </div>
  );
}
