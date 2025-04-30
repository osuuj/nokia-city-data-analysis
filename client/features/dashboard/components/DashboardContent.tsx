import { ViewSwitcher } from '@/features/dashboard/components/ViewSwitcher';
import { useFilteredBusinesses } from '@/features/dashboard/hooks';
import type {
  CompanyProperties,
  SortDescriptor,
  TableColumnConfig,
  ViewMode,
} from '@/features/dashboard/types';
import type { FeatureCollection, Point } from 'geojson';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import { PaginationControls } from './controls/PaginationControls';
import { DashboardSkeleton } from './loading/DashboardSkeleton';
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

  /** Empty state reason if no results are found */
  emptyStateReason?: {
    noResults: boolean;
    reason: 'distance' | 'industry' | 'search' | 'none';
    message: string;
  };

  /** Number of rows to display per page */
  pageSize?: number;

  /** Callback to handle page size changes */
  onPageSizeChange?: (pageSize: number) => void;
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
  emptyStateReason,
  pageSize,
  onPageSizeChange,
}: DashboardContentProps) {
  // State for page size
  const [currentPageSize, setCurrentPageSize] = useState(pageSize || 10);

  // We're not using filteredBusinesses currently, so we can remove the hook call
  // or use _ to mark it as intentionally unused
  useFilteredBusinesses({
    data: allFilteredData,
    industries: [],
    searchQuery: searchTerm,
  });

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setCurrentPageSize(newPageSize);
      // Reset to first page when changing page size
      onPageChange(1);
      if (onPageSizeChange) {
        onPageSizeChange(newPageSize);
      }
    },
    [onPageChange, onPageSizeChange],
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
        data={data}
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
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        emptyStateReason={emptyStateReason}
      />
    </div>
  );
}
