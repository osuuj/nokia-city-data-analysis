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
    <div className="flex flex-col gap-4">
      {/* Top row with view mode toggle */}
      <div className="flex items-center justify-between">
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Bottom row with city search */}
      {viewMode !== 'map' && viewMode !== 'analytics' && (
        <div className="flex items-center">
          <CitySearch
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={onCityChange}
            isLoading={cityLoading}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
        </div>
      )}
    </div>
  );
}
