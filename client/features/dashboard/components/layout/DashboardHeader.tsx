import { CitySearchContainer } from '@/features/dashboard/components/common/CitySearch/CitySearchContainer';
import { ViewModeToggle } from '@/features/dashboard/components/controls/ViewModeToggle';
import type { ViewMode } from '@/features/dashboard/types/view';
import React, { useMemo } from 'react';

interface DashboardHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  fetchViewData?: (view: ViewMode) => Promise<void>;
  onViewModeChange?: (view: ViewMode) => void;
}

/**
 * DashboardHeader component for the top controls of the dashboard
 * Refactored to use CitySearchContainer which connects to our global state
 */
export const DashboardHeader = React.memo(function DashboardHeader({
  viewMode,
  setViewMode,
  fetchViewData,
  onViewModeChange,
}: DashboardHeaderProps) {
  // Memoize the view mode toggle section
  const viewModeToggleSection = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <ViewModeToggle
          viewMode={viewMode}
          setViewMode={onViewModeChange || setViewMode}
          fetchViewData={fetchViewData}
        />
      </div>
    ),
    [viewMode, setViewMode, onViewModeChange, fetchViewData],
  );

  // Memoize the city search section - now using the container component
  const citySearchSection = useMemo(() => {
    return (
      <div className="flex items-center mt-4 w-full max-w-xs">
        <CitySearchContainer />
      </div>
    );
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {viewModeToggleSection}
      {citySearchSection}
    </div>
  );
});
