import type { CompanyProperties } from '@/features/dashboard/types/business';
import type {
  CompanyTableKey,
  SortDescriptor,
  TableColumnConfig,
} from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Default values for dashboard configuration
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DESCRIPTOR: SortDescriptor = {
  column: 'company_name' as CompanyTableKey,
  direction: 'asc',
};

// GeoJSON type definition (simplified for this hook)
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
 * Props for the useConsolidatedDashboard hook
 */
interface UseConsolidatedDashboardProps {
  /** Initial data rows */
  initialData?: CompanyProperties[];
  /** Initial page size */
  initialPageSize?: number;
  /** Initial sort descriptor */
  initialSortDescriptor?: SortDescriptor;
  /** Initial view mode */
  initialViewMode?: ViewMode;
  /** Whether to persist state to URL */
  persistToUrl?: boolean;
  /** Initial search term */
  initialSearchTerm?: string;
}

/**
 * Unified Dashboard hook that consolidates state management, loading states,
 * and pagination into a single hook.
 */
export function useConsolidatedDashboard({
  initialData = [],
  initialPageSize = DEFAULT_PAGE_SIZE,
  initialSortDescriptor = DEFAULT_SORT_DESCRIPTOR,
  initialViewMode = 'table',
  persistToUrl = true,
  initialSearchTerm = '',
}: UseConsolidatedDashboardProps = {}) {
  // ========== State Management ==========
  // UI State
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(initialSortDescriptor);

  // Data State
  const [tableRows, setTableRows] = useState<CompanyProperties[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [emptyStateReason, setEmptyStateReason] = useState<string | undefined>(undefined);
  const [visibleColumns, setVisibleColumns] = useState<TableColumnConfig[]>([]);
  const [geojsonData, setGeojsonData] = useState<GeoJSON>({
    type: 'FeatureCollection',
    features: [],
  });

  // Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, unknown>>({});

  // ========== Refs for Tracking State ==========
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevDataLoadingRef = useRef(false);
  const prevCityLoadingRef = useRef(false);
  const dataLoadedOnceRef = useRef(false);
  const stableDataStateRef = useRef(false);
  const prevRowsCountRef = useRef(0);

  // ========== Loading Management ==========
  // Start loading indicator
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  // Stop loading indicator
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Track loading state changes
  useEffect(() => {
    // Prevent recursive updates by tracking state
    const isCurrentlyLoading = isDataLoading || cityLoading;
    const wasLoading = prevDataLoadingRef.current || prevCityLoadingRef.current;
    const hasData = Boolean(tableRows && tableRows.length > 0);
    const hasError = Boolean(errors.geojson || errors.cities);

    // Case 1: Started loading - show loading indicator
    if (isCurrentlyLoading && !wasLoading) {
      startLoading();
    }
    // Case 2: Finished loading with data or error - stop loading
    else if (!isCurrentlyLoading && wasLoading && (hasData || hasError)) {
      stopLoading();
      dataLoadedOnceRef.current = true;
      stableDataStateRef.current = hasData;
    }

    // Update refs for next render
    prevDataLoadingRef.current = isDataLoading;
    prevCityLoadingRef.current = cityLoading;
  }, [isDataLoading, cityLoading, tableRows, errors, startLoading, stopLoading]);

  // ========== Pagination ==========
  // Calculate total pages based on data and page size
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(tableRows.length / pageSize));
  }, [tableRows.length, pageSize]);

  // Handle page size change with better UX
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      // Don't reset to first page for better UX when increasing page size
      const needsPageReset = newSize < pageSize;

      // Start loading to give user feedback
      startLoading();

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
          stopLoading();
        }, 50);
      }, 0);
    },
    [pageSize, startLoading, stopLoading],
  );

  // Get paginated data for current page
  const paginatedData = useMemo(() => {
    if (!tableRows || tableRows.length === 0) {
      return [];
    }

    // Calculate valid current page (in case total pages changed)
    const validCurrentPage = Math.min(currentPage, totalPages);

    // If current page needs to be adjusted
    if (validCurrentPage !== currentPage) {
      setTimeout(() => setCurrentPage(validCurrentPage), 0);
    }

    // Calculate start and end indices
    const startIndex = (validCurrentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, tableRows.length);

    // Return the current page slice
    return tableRows.slice(startIndex, endIndex);
  }, [tableRows, pageSize, currentPage, totalPages]);

  // ========== View Mode Management ==========
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

  // Handle view mode changes with prefetching
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

  // ========== Search and Filtering ==========
  // Handle search term changes
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    // Reset to first page when search changes
    setCurrentPage(1);
  }, []);

  // Select all rows
  const selectAllRows = useCallback(() => {
    const allIds = tableRows
      .map((row) => row.business_id)
      .filter((id): id is string => Boolean(id));
    setSelectedRows(new Set(allIds));
  }, [tableRows]);

  // Clear row selection
  const clearRowSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  // Toggle row selection
  const toggleRowSelection = useCallback((rowId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  // ========== URL Persistence ==========
  // Read initial state from URL if enabled
  useEffect(() => {
    if (!persistToUrl) return;

    try {
      const url = new URL(window.location.href);

      // Get page from URL
      const pageParam = url.searchParams.get('page');
      if (pageParam && !Number.isNaN(Number(pageParam))) {
        setCurrentPage(Number(pageParam));
      }

      // Get page size from URL
      const pageSizeParam = url.searchParams.get('pageSize');
      if (pageSizeParam && !Number.isNaN(Number(pageSizeParam))) {
        setPageSize(Number(pageSizeParam));
      }

      // Get search term from URL
      const searchParam = url.searchParams.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
      }

      // Get sort from URL
      const sortColumn = url.searchParams.get('sortColumn');
      const sortDirection = url.searchParams.get('sortDirection');
      if (sortColumn && (sortDirection === 'asc' || sortDirection === 'desc')) {
        setSortDescriptor({
          column: sortColumn as CompanyTableKey,
          direction: sortDirection,
        });
      }

      // Get view mode from URL
      const viewModeParam = url.searchParams.get('viewMode');
      if (viewModeParam && ['table', 'map', 'split', 'analytics'].includes(viewModeParam)) {
        setViewMode(viewModeParam as ViewMode);
      }
    } catch (err) {
      console.error('Error parsing URL parameters:', err);
    }
  }, [persistToUrl]);

  // Update URL when parameters change
  useEffect(() => {
    if (!persistToUrl) return;

    try {
      const url = new URL(window.location.href);

      // Update page in URL
      url.searchParams.set('page', currentPage.toString());

      // Update page size in URL
      url.searchParams.set('pageSize', pageSize.toString());

      // Update search term in URL
      if (searchTerm) {
        url.searchParams.set('search', searchTerm);
      } else {
        url.searchParams.delete('search');
      }

      // Update sort in URL
      if (sortDescriptor.column) {
        url.searchParams.set('sortColumn', sortDescriptor.column);
        url.searchParams.set('sortDirection', sortDescriptor.direction);
      }

      // Update view mode in URL
      url.searchParams.set('viewMode', viewMode);

      // Update URL without page reload
      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      console.error('Error updating URL parameters:', err);
    }
  }, [currentPage, pageSize, searchTerm, sortDescriptor, viewMode, persistToUrl]);

  // First error from errors object
  const error = useMemo(() => {
    if (errors.geojson) return errors.geojson;
    if (errors.cities) return errors.cities;
    return null;
  }, [errors]);

  // Return everything needed by dashboard components
  return {
    // State
    searchTerm,
    currentPage,
    pageSize,
    sortDescriptor,
    viewMode,
    tableRows,
    paginatedData,
    selectedRows,
    totalPages,
    isLoading,
    isDataLoading,
    errors,
    emptyStateReason,
    error,
    visibleColumns,
    geojsonData,

    // Actions
    setSearchTerm: handleSearchChange,
    setCurrentPage,
    setPageSize: handlePageSizeChange,
    setSortDescriptor,
    setViewMode: onViewModeChange,
    setTableRows,
    startLoading,
    stopLoading,
    setGeojsonData,
    toggleRowSelection,
    selectAllRows,
    clearRowSelection,
    prefetchViewData,
  };
}
