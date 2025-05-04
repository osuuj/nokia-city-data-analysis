import { CitySearch } from '@/features/dashboard/components/common/CitySearch';
import { ViewModeToggle } from '@/features/dashboard/components/controls/ViewModeToggle';
import type { ViewMode } from '@/features/dashboard/types/view';
import React, { useMemo } from 'react';

interface DashboardHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  cityLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  fetchViewData?: (view: ViewMode) => Promise<void>;
  onViewModeChange?: (view: ViewMode) => void;
}

/**
 * DashboardHeader component for the top controls of the dashboard
 * Extracted from the dashboard page for better separation of concerns
 */
export const DashboardHeader = React.memo(function DashboardHeader({
  viewMode,
  setViewMode,
  cities,
  selectedCity,
  onCityChange,
  cityLoading,
  searchTerm,
  onSearchChange,
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

  // Memoize the city search section - now always shows
  const citySearchSection = useMemo(() => {
    return (
      <div className="flex items-center mt-4 w-full max-w-xs">
        <CitySearch
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={onCityChange}
          isLoading={cityLoading}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>
    );
  }, [cities, selectedCity, onCityChange, cityLoading, searchTerm, onSearchChange]);

  return (
    <div className="flex flex-col gap-2">
      {viewModeToggleSection}
      {citySearchSection}
    </div>
  );
});
