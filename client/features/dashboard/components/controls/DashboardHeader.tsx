'use client';

import { CitySearch } from '@/features/dashboard/components/common/CitySearch';
import { ViewModeToggle } from '@/features/dashboard/components/controls/Toggles/ViewModeToggle';
import type { ViewMode } from '@/features/dashboard/types/view';
import React, { useMemo } from 'react';

interface DashboardHeaderProps {
  /** Current view mode of the dashboard */
  viewMode: ViewMode;
  /** Function to set the view mode */
  setViewMode: (mode: ViewMode) => void;
  /** List of cities available for selection */
  cities: { name: string }[];
  /** Currently selected city */
  selectedCity: string;
  /** Function to handle city change */
  onCityChange: (city: string) => void;
  /** Whether city data is loading */
  cityLoading: boolean;
  /** Current search term for city filter */
  searchTerm: string;
  /** Function to handle search term change */
  onSearchChange: (term: string) => void;
  /** Additional class names */
  className?: string;
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
  className = '',
}: DashboardHeaderProps) {
  // Memoize the view mode toggle section
  const viewModeToggleSection = useMemo(
    () => <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />,
    [viewMode, setViewMode],
  );

  // Memoize the city search section - shown for all view modes except analytics
  const citySearchSection = useMemo(() => {
    // Hide for analytics view as it has its own search
    if (viewMode === 'analytics') {
      return null;
    }

    return (
      <CitySearch
        cities={cities}
        selectedCity={selectedCity}
        onCityChange={onCityChange}
        isLoading={cityLoading}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
    );
  }, [viewMode, cities, selectedCity, onCityChange, cityLoading, searchTerm, onSearchChange]);

  return (
    <div className={`flex flex-col gap-2 sm:gap-3 ${className}`}>
      {viewModeToggleSection}
      {citySearchSection}
    </div>
  );
});

DashboardHeader.displayName = 'DashboardHeader';
