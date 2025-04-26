'use client';

import { DashboardHeader } from '@/features/dashboard/components/controls/DashboardHeader';
import { DashboardSkeleton } from '@/features/dashboard/components/loading/DashboardSkeleton';
import { DashboardErrorBoundary } from '@/features/dashboard/components/shared/DashboardErrorBoundary';
import { useDashboardData } from '@/features/dashboard/hooks/data/useDashboardData';
import { useDashboardLoading } from '@/features/dashboard/hooks/data/useDashboardLoading';
import { useCompanyStore } from '@/features/dashboard/store';
import type { SortDescriptor } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { useDebounce } from '@/shared/hooks';
import { useSearchParams } from 'next/navigation';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';

// Lazy load the DashboardContent component for code splitting
const DashboardContent = lazy(() =>
  import('@/features/dashboard/components/DashboardContent').then((module) => ({
    default: module.DashboardContent,
  })),
);

/**
 * DashboardPage component
 * Displays an interactive dashboard for exploring city data analytics.
 *
 * @returns {JSX.Element} The rendered dashboard page component
 */
export function DashboardPage(): JSX.Element {
  // Get URL parameters
  const searchParams = useSearchParams();
  const cityParam = searchParams?.get('city') || '';

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name',
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Get global state from store
  const {
    selectedCity,
    setSelectedCity,
    selectedIndustries,
    selectedKeys,
    setSelectedKeys,
    userLocation,
    distanceLimit,
  } = useCompanyStore();

  // Debounce search term for better performance
  const { value: debouncedSearchTerm } = useDebounce(searchTerm, 300);

  // Use the dashboard loading hook
  const { sectionStates, startSectionLoading, stopSectionLoading } = useDashboardLoading();

  // Use the centralized data fetching hook
  const { geojsonData, cities, isLoading, cityLoading, tableRows, visibleColumns } =
    useDashboardData({
      selectedCity,
      selectedIndustries,
      userLocation,
      distanceLimit,
      query: debouncedSearchTerm,
    });

  // Create a default empty FeatureCollection for when geojsonData is undefined
  const defaultGeoJSON = {
    type: 'FeatureCollection' as const,
    features: [],
  };

  // Start loading sections when data is being fetched
  useEffect(() => {
    if (isLoading) {
      startSectionLoading('all', 'Loading dashboard data...');
    } else {
      stopSectionLoading('all');
    }
  }, [isLoading, startSectionLoading, stopSectionLoading]);

  // Handle city selection
  const handleCityChange = useCallback(
    (city: string) => {
      startSectionLoading('map', 'Loading city data...');
      setSelectedCity(city);
    },
    [setSelectedCity, startSectionLoading],
  );

  // Handle search
  const handleSearchChange = useCallback(
    (term: string) => {
      startSectionLoading('table', 'Searching...');
      setSearchTerm(term);
    },
    [startSectionLoading],
  );

  return (
    <DashboardErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader
          cities={cities || []}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          cityLoading={cityLoading}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent
            data={tableRows || []}
            allFilteredData={tableRows || []}
            selectedBusinesses={[]}
            geojson={geojsonData || defaultGeoJSON}
            viewMode={viewMode}
            setViewMode={setViewMode}
            columns={visibleColumns || []}
            currentPage={page}
            totalPages={1}
            onPageChange={setPage}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
          />
        </Suspense>
      </div>
    </DashboardErrorBoundary>
  );
}
