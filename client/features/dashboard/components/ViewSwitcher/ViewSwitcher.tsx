'use client';

import type { FeatureCollection, Point } from 'geojson';
import { Suspense, lazy, useMemo } from 'react';
import type { CompanyProperties, SortDescriptor, TableColumnConfig, ViewMode } from '../../types';
import { transformCompanyGeoJSON } from '../../utils/geo';
import { AnalyticsSkeleton, DashboardSkeleton, SectionSkeleton } from '../loading/Skeletons';
import { ErrorDisplay } from '../shared/error/ErrorDisplay';

// Define the emptyStateReason type to handle both string and object formats
type EmptyStateReason =
  | string
  | {
      noResults: boolean;
      reason: 'distance' | 'industry' | 'search' | 'none';
      message: string;
    };

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
  isLoading?: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: React.Dispatch<React.SetStateAction<SortDescriptor>>;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  emptyStateReason?: EmptyStateReason;
  geojson?: FeatureCollection<Point, CompanyProperties>; // Optional prop for passing GeoJSON directly
  error?: Error | null; // Added error prop for direct error handling
}

// Lazy load components for code splitting
const AnalyticsView = lazy(() =>
  import('../../views/AnalyticsView').then((module) => ({
    default: module.AnalyticsView,
  })),
);

const MapView = lazy(() =>
  import('../map/MapView').then((module) => ({
    default: module.MapView,
  })),
);

const TableView = lazy(() =>
  import('../table/TableView').then((module) => ({
    default: module.TableView,
  })),
);

/**
 * ViewSwitcher
 * Controls display of TableView, MapView, or both in split layout.
 * Uses React.lazy for code splitting to improve initial load performance.
 * Now handles error states and loading directly.
 */
export function ViewSwitcher({
  data,
  allFilteredData,
  selectedBusinesses = [],
  geojson: externalGeoJSON,
  viewMode,
  setViewMode,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  isLoading: externalLoading = false,
  searchTerm,
  setSearchTerm,
  sortDescriptor,
  setSortDescriptor,
  pageSize,
  onPageSizeChange,
  emptyStateReason,
  error,
}: ViewSwitcherProps) {
  // Removed: useCompanyStore (no longer exists)
  const selectedCity = undefined;

  // Removed: useGeoJSONData hook (no longer exists)
  const geojsonData = undefined;
  const isGeoJsonLoading = false;

  // Track overall loading state
  const isLoading = externalLoading || isGeoJsonLoading;

  // Transform GeoJSON data for proper rendering - use external data if provided
  const transformedGeoJSON = useMemo(() => {
    const sourceData = externalGeoJSON || geojsonData;
    if (!sourceData) return { type: 'FeatureCollection' as const, features: [] };
    return transformCompanyGeoJSON(sourceData);
  }, [externalGeoJSON, geojsonData]);

  // Format empty state message depending on its type
  const formattedEmptyStateReason = useMemo(() => {
    if (!emptyStateReason) return 'No data available';
    if (typeof emptyStateReason === 'string') return emptyStateReason;
    return emptyStateReason.message || 'No data available';
  }, [emptyStateReason]);

  // Define shared table props to maintain consistent data between views
  const tableProps = {
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
    emptyStateReason: formattedEmptyStateReason,
  };

  // Handle error state - moved up from parent components
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        message="Failed to load dashboard data"
        showDetails={process.env.NODE_ENV === 'development'}
      />
    );
  }

  // Show skeleton during initial loading - moved up from parent components
  if (
    isLoading &&
    (!data || data.length === 0) &&
    (!emptyStateReason || (typeof emptyStateReason === 'object' && !emptyStateReason.noResults))
  ) {
    return <DashboardSkeleton />;
  }

  // Determine if we should show any view - at least one condition must be true:
  // 1. We have data to show
  // 2. We're in a loading state
  // 3. A city is selected (even if data is not yet loaded)
  const shouldShowView = data.length > 0 || isLoading || !!selectedCity;

  // Always render a view based on the currently selected viewMode
  // This ensures views render even when loading data
  return (
    <div className="w-full">
      {viewMode === 'table' && shouldShowView && (
        <Suspense fallback={<SectionSkeleton section="table" />}>
          <TableView {...tableProps} />
        </Suspense>
      )}

      {viewMode === 'map' && shouldShowView && (
        <div className="h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] w-full">
          <Suspense fallback={<SectionSkeleton section="map" />}>
            <MapView geojson={transformedGeoJSON} selectedBusinesses={selectedBusinesses} />
          </Suspense>
        </div>
      )}

      {viewMode === 'split' && shouldShowView && (
        <div className="flex flex-col lg:flex-row lg:gap-4">
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
            <Suspense fallback={<SectionSkeleton section="table" />}>
              <TableView {...tableProps} />
            </Suspense>
          </div>
          <div className="w-full lg:w-1/2 h-[50vh] sm:h-[55vh] lg:h-auto lg:min-h-[70vh] border border-default-200 rounded-lg">
            <div className="h-full w-full">
              <Suspense fallback={<SectionSkeleton section="map" />}>
                <MapView geojson={transformedGeoJSON} selectedBusinesses={selectedBusinesses} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'analytics' && shouldShowView && (
        <div className="w-full">
          <Suspense fallback={<AnalyticsSkeleton type="distribution" />}>
            <AnalyticsView />
          </Suspense>
        </div>
      )}

      {!shouldShowView && (
        <div className="flex items-center justify-center w-full h-[70vh] bg-default-50 rounded-lg border border-default-200">
          <div className="text-center p-8">
            <div className="text-4xl mb-4 text-default-300">🌎</div>
            <h3 className="text-xl font-medium mb-2">Please select a city</h3>
            <p className="text-default-500">Choose a city from the selection above to view data.</p>
          </div>
        </div>
      )}
    </div>
  );
}
