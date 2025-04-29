import { ViewSwitcher } from '@/features/dashboard/components/ViewSwitcher';
import { useFilteredBusinesses } from '@/features/dashboard/hooks';
import type {
  CompanyProperties,
  SortDescriptor,
  TableColumnConfig,
  ViewMode,
} from '@/features/dashboard/types';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { usePagination } from '@/shared/hooks';
import type { FeatureCollection, Point } from 'geojson';
import { useCallback, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { PaginationControls } from './controls/PaginationControls';
import { DashboardSkeleton } from './loading/DashboardSkeleton';
import { DashboardErrorBoundary } from './shared/DashboardErrorBoundary';
import { ErrorDisplay } from './shared/error/ErrorDisplay';

/**
 * Props for the DashboardContent component
 */
interface DashboardContentProps {
  /** Current page data to display */
  data: CompanyProperties[];

  /** Complete filtered dataset for context operations */
  allFilteredData: CompanyProperties[];

  /** Currently selected businesses */
  selectedBusinesses: CompanyProperties[];

  /** GeoJSON data for map visualization */
  geojson: FeatureCollection<Point, CompanyProperties>;

  /** Current view mode (table, map, split, analytics) */
  viewMode: ViewMode;

  /** Callback to change the view mode */
  setViewMode: (mode: ViewMode) => void;

  /** Configuration for table columns */
  columns: TableColumnConfig[];

  /** Current page number (1-based) */
  currentPage: number;

  /** Total number of pages */
  totalPages: number;

  /** Callback to handle page changes */
  onPageChange: (page: number) => void;

  /** Loading state indicator */
  isLoading: boolean;

  /** Current search term */
  searchTerm: string;

  /** Callback to update search term */
  setSearchTerm: (term: string) => void;

  /** Current sort configuration */
  sortDescriptor: SortDescriptor;

  /** Callback to update sort configuration */
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;

  /** Error state */
  error: Error | null;
}

/**
 * DashboardContent component
 *
 * Renders the main content of the dashboard, including the view switcher
 * and pagination controls. Handles data filtering and loading states.
 *
 * @param props - Component props
 * @returns The rendered dashboard content
 */
export function DashboardContent({
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
  error,
}: DashboardContentProps) {
  // State for page size
  const [pageSize, setPageSize] = useState(10);

  // Call useFilteredBusinesses at the top level (not inside useMemo)
  const filteredData = useFilteredBusinesses({
    data: allFilteredData,
    searchTerm,
    selectedIndustries: [], // TODO: Add industry filtering
    userLocation: null, // TODO: Add location filtering
    distanceLimit: null,
    sortDescriptor,
    isFetching: isLoading,
  });

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      // Reset to first page when changing page size
      onPageChange(1);
    },
    [onPageChange],
  );

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        message="Failed to load dashboard data"
        showDetails={process.env.NODE_ENV === 'development'}
      />
    );
  }

  // Only show skeleton if we're loading AND don't have any data
  if (isLoading && (!data || data.length === 0)) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col h-full">
      <ViewSwitcher
        data={filteredData}
        allFilteredData={allFilteredData}
        selectedBusinesses={selectedBusinesses}
        geojson={geojson}
        viewMode={viewMode}
        setViewMode={setViewMode}
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

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalItems={allFilteredData.length}
      />
    </div>
  );
}
