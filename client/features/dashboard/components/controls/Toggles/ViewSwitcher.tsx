'use client';

import { FeatureErrorBoundary } from '@/shared/components/error';
import { ErrorDisplay } from '@/shared/components/error';
import { ChartSkeleton, MapSkeleton } from '@/shared/components/loading';
import type { FeatureCollection, Point } from 'geojson';
import { Suspense, lazy, memo, useCallback, useMemo } from 'react';
import type {
  CompanyProperties,
  SortDescriptor,
  TableColumnConfig,
  ViewMode,
} from '../../../types';

// Define the ViewSwitcherProps type with all required properties
export interface ViewSwitcherProps {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
  selectedBusinesses?: CompanyProperties[];
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
  setSortDescriptor: React.Dispatch<React.SetStateAction<SortDescriptor>>;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  emptyStateReason?: string;
  geojson?: FeatureCollection<Point, CompanyProperties>; // Optional prop for passing GeoJSON directly
  error?: Error | null; // Added error prop for direct error handling
}

// Lazy load components for code splitting - with dynamic import for better Next.js compatibility
const AnalyticsView = lazy(() =>
  import('@/features/dashboard/components/views/AnalyticsView/AnalyticsView').then((module) => ({
    default: module.AnalyticsView,
  })),
);

const MapView = lazy(() =>
  import('@/features/dashboard/components/views/MapView/MapView').then((module) => ({
    default: module.MapView,
  })),
);

const TableView = lazy(() =>
  import('@/features/dashboard/components/views/TableView/TableView').then((module) => ({
    default: module.TableView,
  })),
);

/**
 * ViewSwitcher
 * Controls display of TableView, MapView, or both in split layout.
 */
function ViewSwitcherBase({
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
  pageSize,
  onPageSizeChange,
}: ViewSwitcherProps) {
  // Memoize the table view rendering to prevent unnecessary re-renders
  const renderTableView = useCallback(
    () => (
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
      />
    ),
    [
      data,
      allFilteredData,
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
    ],
  );

  // Memoize the map view with better error handling
  const renderMapView = useCallback(() => {
    if (!geojson) return null;
    return (
      <FeatureErrorBoundary
        featureName="MapView"
        fallback={<ErrorDisplay message="Could not load Map View" showDetails={true} />}
      >
        <Suspense fallback={<MapSkeleton height="h-[400px]" showControls={true} />}>
          <MapView geojson={geojson} selectedBusinesses={selectedBusinesses} />
        </Suspense>
      </FeatureErrorBoundary>
    );
  }, [geojson, selectedBusinesses]);

  // Memoize the analytics view with better error handling
  const renderAnalyticsView = useCallback(
    () => (
      <FeatureErrorBoundary
        featureName="AnalyticsView"
        fallback={<ErrorDisplay message="Could not load Analytics View" showDetails={true} />}
      >
        <Suspense fallback={<ChartSkeleton chartType="distribution" height="h-[400px]" />}>
          <AnalyticsView />
        </Suspense>
      </FeatureErrorBoundary>
    ),
    [],
  );

  // Memoize the content based on the view mode
  const content = useMemo(() => {
    switch (viewMode) {
      case 'table':
        return <div className="w-full">{renderTableView()}</div>;
      case 'map':
        return geojson ? (
          <div className="h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] w-full">
            {renderMapView()}
          </div>
        ) : null;
      case 'split':
        return (
          <div className="flex flex-col lg:flex-row lg:gap-4">
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0">{renderTableView()}</div>
            {geojson && (
              <div className="w-full lg:w-1/2 h-[50vh] sm:h-[55vh] lg:h-auto lg:min-h-[70vh] border border-default-200 rounded-lg">
                <div className="h-full w-full">{renderMapView()}</div>
              </div>
            )}
          </div>
        );
      case 'analytics':
        return <div className="w-full">{renderAnalyticsView()}</div>;
      default:
        return null;
    }
  }, [viewMode, renderTableView, renderMapView, renderAnalyticsView, geojson]);

  return <div className="w-full">{content}</div>;
}

// Export a memoized version of the component to prevent unnecessary re-renders
export const ViewSwitcher = memo(ViewSwitcherBase);
