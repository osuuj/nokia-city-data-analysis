import { CitySearch } from '@/features/dashboard/components/controls/CitySearch';
import { ViewModeToggle } from '@/features/dashboard/components/controls/ViewModeToggle/ViewModeToggle';
import type { ViewMode } from '@/features/dashboard/types';

interface DashboardHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  cityLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * DashboardHeader component for the top controls of the dashboard
 * Extracted from the dashboard page for better separation of concerns
 */
export function DashboardHeader({
  viewMode,
  setViewMode,
  cities,
  selectedCity,
  onCityChange,
  cityLoading,
  searchTerm,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-start sm:items-center">
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode !== 'map' && viewMode !== 'analytics' && (
        <CitySearch
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={onCityChange}
          isLoading={cityLoading}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      )}
    </div>
  );
}
