'use client';

import { useMemo } from 'react';

interface DashboardLoadingProps {
  /** Whether data is loading */
  isDataLoading?: boolean;
  /** Whether city data is loading */
  cityLoading?: boolean;
  /** Whether table rows are loading or undefined */
  tableRows?: Record<string, unknown>[] | null | undefined;
  /** Any errors in dashboard data */
  errors?: Record<string, unknown> | null;
}

/**
 * Hook to manage loading states across dashboard sections
 */
export function useDashboardLoading({
  isDataLoading = false,
  cityLoading = false,
  tableRows,
  errors,
}: DashboardLoadingProps = {}) {
  // Check if any section is loading
  const isAnySectionLoading = useMemo(() => {
    return isDataLoading || cityLoading || tableRows === undefined;
  }, [isDataLoading, cityLoading, tableRows]);

  // Check if map data is loading
  const isMapLoading = useMemo(() => {
    return isDataLoading || !tableRows;
  }, [isDataLoading, tableRows]);

  // Check if table data is loading
  const isTableLoading = useMemo(() => {
    return isDataLoading || !tableRows;
  }, [isDataLoading, tableRows]);

  // Check if analytics data is loading
  const isAnalyticsLoading = useMemo(() => {
    return isDataLoading || !tableRows;
  }, [isDataLoading, tableRows]);

  // Check if any sections have errors
  const hasSectionErrors = useMemo(() => {
    return errors && Object.keys(errors).length > 0;
  }, [errors]);

  return {
    isAnySectionLoading,
    isMapLoading,
    isTableLoading,
    isAnalyticsLoading,
    hasSectionErrors,
  };
}
