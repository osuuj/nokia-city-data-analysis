'use client';

import { DashboardContent } from '@/features/dashboard/components/DashboardContent';
import { DashboardHeader } from '@/features/dashboard/components/controls/DashboardHeader';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { useCompanyStore } from '@/features/dashboard/store';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { LoadingOverlay } from '@/shared/components/ui/loading';
import { useDebounce } from '@/shared/hooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function DashboardPage() {
  // Get URL parameters
  const searchParams = useSearchParams();
  const cityParam = searchParams?.get('city') || '';

  // State management
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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

  // Handle city selection from URL
  useEffect(() => {
    if (cityParam && cityParam !== selectedCity) {
      setSelectedCity(cityParam);
    }
  }, [cityParam, selectedCity, setSelectedCity]);

  // Set initial loading state
  useEffect(() => {
    if (tableRows.length > 0 || isLoading === false) {
      setIsInitialLoading(false);
    }
  }, [tableRows, isLoading]);

  // Handle page changes
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Calculate pagination
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableRows.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = tableRows.slice(startIndex, endIndex);

  // Get selected businesses
  const selectedBusinesses = Array.from(selectedKeys)
    .map((id) => tableRows.find((b) => b.business_id === id))
    .filter((b): b is CompanyProperties => b !== undefined);

  return (
    <div className="relative min-h-screen">
      {isInitialLoading && <LoadingOverlay />}

      <div className="flex flex-col gap-4 p-4">
        <DashboardHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          cityLoading={cityLoading}
        />

        <DashboardContent
          data={currentPageData}
          allFilteredData={tableRows}
          selectedBusinesses={selectedBusinesses}
          columns={visibleColumns}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortDescriptor={sortDescriptor}
          setSortDescriptor={setSortDescriptor}
          viewMode={viewMode}
          setViewMode={setViewMode}
          geojson={geojsonData || defaultGeoJSON}
        />
      </div>
    </div>
  );
}
