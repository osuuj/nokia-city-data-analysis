import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDashboardLoadingProps {
  isDataLoading: boolean;
  cityLoading: boolean;
  tableRows: Record<string, unknown>[] | null | undefined;
  errors: Record<string, unknown>;
}

interface LoadingResult {
  isAnySectionLoading: boolean;
  startSectionLoading: () => void;
  stopSectionLoading: () => void;
}

/**
 * Custom hook for managing dashboard loading state
 * Extracts loading state logic from DashboardPage.tsx
 */
export function useDashboardLoading({
  isDataLoading,
  cityLoading,
  tableRows,
  errors,
}: UseDashboardLoadingProps): LoadingResult {
  const [isAnySectionLoading, setIsAnySectionLoading] = useState(false);

  // Add refs to track previous loading states to prevent loading loops
  const prevDataLoadingRef = useRef(false);
  const prevCityLoadingRef = useRef(false);
  const dataLoadedOnceRef = useRef(false);
  const stableDataStateRef = useRef(false);

  // Loading state management
  const startSectionLoading = useCallback(() => {
    setIsAnySectionLoading(true);
  }, []);

  const stopSectionLoading = useCallback(() => {
    setIsAnySectionLoading(false);
  }, []);

  // Update loading state based on data fetching, but prevent unnecessary loading cycles
  useEffect(() => {
    // Prevent recursive updates by using refs to track state
    const isCurrentlyLoading = isDataLoading || cityLoading;
    const wasLoading = prevDataLoadingRef.current || prevCityLoadingRef.current;
    const hasData = Boolean(tableRows && tableRows.length > 0);
    const hasError = Boolean(errors.geojson || errors.cities);

    // Case 1: Started loading - show loading indicator
    if (isCurrentlyLoading && !wasLoading) {
      startSectionLoading();
    }
    // Case 2: Finished loading with data or error - stop loading
    else if (!isCurrentlyLoading && wasLoading && (hasData || hasError)) {
      stopSectionLoading();
      dataLoadedOnceRef.current = true;
      stableDataStateRef.current = hasData;
    }

    // Update refs for next render
    prevDataLoadingRef.current = isDataLoading;
    prevCityLoadingRef.current = cityLoading;
  }, [isDataLoading, cityLoading, tableRows, errors, startSectionLoading, stopSectionLoading]);

  return {
    isAnySectionLoading,
    startSectionLoading,
    stopSectionLoading,
  };
}
