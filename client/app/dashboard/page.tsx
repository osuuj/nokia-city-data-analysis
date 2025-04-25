'use client';

import { DashboardContent } from '@/features/dashboard/components/DashboardContent';
import { DashboardHeader } from '@/features/dashboard/components/controls/DashboardHeader';
import { SectionLoader } from '@/features/dashboard/components/loading/SectionLoader';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { useDashboardLoading } from '@/features/dashboard/hooks/useDashboardLoading';
import { useCompanyStore } from '@/features/dashboard/store';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { useDebounce } from '@/shared/hooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function DashboardPage() {
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
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  // Handle industry selection
  const handleIndustryChange = useCallback(
    (industries: string[]) => {
      startSectionLoading('table', 'Filtering by industries...');
      // Implementation details...
    },
    [startSectionLoading],
  );

  // Handle search
  const handleSearch = useCallback(
    (term: string) => {
      startSectionLoading('table', 'Searching...');
      setSearchTerm(term);
    },
    [startSectionLoading],
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header section with loading state */}
      <div className="relative">
        <SectionLoader section="header" isLoading={sectionStates.header} />
        <DashboardHeader
          cities={cities || []}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          cityLoading={cityLoading}
        />
      </div>

      {/* Map section with loading state */}
      <div className="relative">
        <SectionLoader section="map" isLoading={sectionStates.map} />
        {/* Map component would go here */}
      </div>

      {/* Table section with loading state */}
      <div className="relative">
        <SectionLoader section="table" isLoading={sectionStates.table} />
        <DashboardContent
          data={tableRows || []}
          allFilteredData={tableRows || []}
          selectedBusinesses={[]}
          geojson={geojsonData || defaultGeoJSON}
          viewMode={viewMode}
          setViewMode={setViewMode}
          columns={visibleColumns || []}
          currentPage={page}
          totalPages={Math.ceil((tableRows?.length || 0) / 10)} // Assuming 10 items per page
          onPageChange={setPage}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortDescriptor={sortDescriptor}
          setSortDescriptor={setSortDescriptor}
        />
      </div>
    </div>
  );
}
