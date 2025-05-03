import type { CompanyProperties } from '@/features/dashboard/types/business';
import type {
  CompanyTableKey,
  SortDescriptor,
  TableColumnConfig,
} from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ROWS_PER_PAGE = 10;

// GeoJSON type definition
interface GeoJSONFeature {
  type: string;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

/**
 * Custom hook for managing dashboard state
 * Extracts state management logic from DashboardPage.tsx
 */
export function useDashboardState() {
  // Global state from Zustand store (placeholders to be connected later)
  const selectedCity: string = '';
  const selectedIndustries: string[] = [];
  const userLocation = undefined;
  const distanceLimit = undefined;
  const selectedRows: Record<string, CompanyProperties> = {};

  // Add search timeout reference
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Local state for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(ROWS_PER_PAGE);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name' as CompanyTableKey,
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isAnySectionLoading, setIsAnySectionLoading] = useState(false);

  // Add refs to track loading states
  const prevDataLoadingRef = useRef(false);
  const prevCityLoadingRef = useRef(false);
  const dataLoadedOnceRef = useRef(false);
  const stableDataStateRef = useRef(false);
  const prevRowsCountRef = useRef(0);

  // Dummy data placeholders (to be connected with actual data fetching logic)
  const tableRows: CompanyProperties[] = [];
  const isDataLoading = false;
  const cityLoading = false;
  const errors: Record<string, unknown> = {};
  const emptyStateReason: string | undefined = undefined;
  const visibleColumns: TableColumnConfig[] = [];
  const geojsonData: GeoJSON = { type: 'FeatureCollection', features: [] };

  // Loading state management
  const startSectionLoading = useCallback(() => {
    setIsAnySectionLoading(true);
  }, []);

  const stopSectionLoading = useCallback(() => {
    setIsAnySectionLoading(false);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      // Don't reset to first page for better UX when increasing page size
      const needsPageReset = newSize < pageSize;

      // Start loading to give user feedback
      startSectionLoading();

      // Use a more efficient approach with debouncing
      setTimeout(() => {
        // Update page size first (synchronous operation)
        setPageSize(newSize);

        // Only reset page if we're decreasing page size
        if (needsPageReset) {
          setCurrentPage(1);
        }

        // Small delay to allow UI to update
        setTimeout(() => {
          stopSectionLoading();
        }, 50);
      }, 0);
    },
    [pageSize, startSectionLoading, stopSectionLoading],
  );

  // Create prefetch function that returns a Promise
  const prefetchViewData = useCallback(async (view: ViewMode): Promise<void> => {
    try {
      // Implement proper prefetching logic for each view type
      switch (view) {
        case 'table':
        case 'map':
        case 'split':
        case 'analytics':
          return Promise.resolve();
        default:
          return Promise.resolve();
      }
    } catch (error) {
      console.error(`Error prefetching data for ${view} view:`, error);
    }
  }, []);

  // Prevent unnecessary data refetching when changing view modes
  const onViewModeChange = useCallback(
    (newViewMode: ViewMode) => {
      // Always preserve data when switching views - never trigger loading
      setViewMode(newViewMode);

      // Only prefetch data in the background if we need to
      if (newViewMode === 'analytics') {
        prefetchViewData(newViewMode).catch((error) => {
          console.error('Error prefetching view data:', error);
        });
      }
    },
    [prefetchViewData],
  );

  // Handle search term changes
  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Handle city search term changes
  const handleCitySearchChange = useCallback((term: string) => {
    setCitySearchTerm(term);
  }, []);

  // Handle city selection
  const handleCityChange = useCallback((city: string) => {
    // This would typically update a global store
  }, []);

  // Get the first error if any
  const error = useMemo(() => {
    if (errors.geojson) return errors.geojson;
    if (errors.cities) return errors.cities;
    return null;
  }, []);

  return {
    // State
    searchTerm,
    companySearchTerm,
    citySearchTerm,
    currentPage,
    pageSize,
    sortDescriptor,
    viewMode,
    selectedCity,
    selectedIndustries,
    selectedRows,
    isAnySectionLoading,
    tableRows,
    isDataLoading,
    cityLoading,
    errors,
    emptyStateReason,
    error,
    visibleColumns,
    geojsonData,

    // Actions
    setSearchTerm,
    setCompanySearchTerm,
    setCitySearchTerm,
    setCurrentPage,
    setSortDescriptor,
    setViewMode,
    startSectionLoading,
    stopSectionLoading,
    handlePageSizeChange,
    handleSetSearchTerm,
    handleCitySearchChange,
    handleCityChange,
    prefetchViewData,
    onViewModeChange,
  };
}
