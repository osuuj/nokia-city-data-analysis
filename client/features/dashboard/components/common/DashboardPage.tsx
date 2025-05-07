'use client';

import { DashboardSkeleton } from '@/features/dashboard/components/common/loading/Skeletons';
import { DashboardHeader } from '@/features/dashboard/components/controls/DashboardHeader';
import { ViewSwitcher } from '@/features/dashboard/components/controls/Toggles/ViewSwitcher';
import { columns as allColumns } from '@/features/dashboard/config/columns';
import { useFetchCities, useFetchCompanies } from '@/features/dashboard/hooks/useCompaniesQuery';
import { useDashboardLoading } from '@/features/dashboard/hooks/useDashboardLoading';
import { useDashboardPagination } from '@/features/dashboard/hooks/useDashboardPagination';
import { useFilteredBusinesses } from '@/features/dashboard/hooks/useFilteredBusinesses';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { ErrorDisplay, FeatureErrorBoundary } from '@/shared/components/error';
import { LoadingOverlay } from '@/shared/components/loading/LoadingOverlay';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

// Default rows per page
const DEFAULT_PAGE_SIZE = 20;
// Maximum allowed page size
const MAX_PAGE_SIZE = 50;

/**
 * Main dashboard page component
 * Displays city data with various visualization options
 */
export function DashboardPage() {
  const router = useRouter();
  // Fix the searchParams handling
  const searchParamsData = useSearchParams();
  // Only use React.use() if the object is not null
  const searchParams = searchParamsData ? searchParamsData : null;

  // Get the query param safely
  const query = searchParams ? decodeURIComponent(searchParams.get('city') || '') : '';

  const {
    selectedCity,
    setSelectedCity,
    selectedIndustries,
    selectedKeys,
    selectedRows,
    userLocation,
    distanceLimit,
  } = useCompanyStore();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name',
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Debounce search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoize handlers to prevent recreation on every render
  const handleCityChange = useCallback(
    (city: string) => {
      setSelectedCity(city);
      router.replace(`/dashboard?city=${encodeURIComponent(city)}`);
    },
    [setSelectedCity, router],
  );

  // Handle page size change with useCallback
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      // Enforce maximum page size limit
      const safeSize = Math.min(newSize, MAX_PAGE_SIZE);

      // Calculate new page to keep approximately the same records visible
      const firstItemIndex = (page - 1) * pageSize;
      const newPage = Math.floor(firstItemIndex / safeSize) + 1;

      setPageSize(safeSize);
      setPage(newPage);
    },
    [page, pageSize],
  );

  // Memoize the page change handler
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Update selectedCity when query param changes
  useEffect(() => {
    if (query && query !== selectedCity) {
      setSelectedCity(query);
      setSearchTerm('');
      setPage(1);
    }
  }, [query, selectedCity, setSelectedCity]);

  // Fetch cities and companies using React Query
  const { data: cities = [], isLoading: cityLoading, error: cityError } = useFetchCities();
  const {
    data: companies = [],
    isLoading: isFetching,
    error: companyError,
  } = useFetchCompanies(selectedCity);

  // Use loading hook to centralize loading states
  const { isAnySectionLoading, hasSectionErrors } = useDashboardLoading({
    isDataLoading: isFetching,
    cityLoading,
    tableRows: companies,
    errors: cityError || companyError ? { city: cityError, companies: companyError } : null,
  });

  // Log errors if any
  useEffect(() => {
    if (cityError) {
      console.error('Error fetching cities:', cityError);
    }
    if (companyError) {
      console.error('Error fetching companies:', companyError);
    }
  }, [cityError, companyError]);

  // Remove duplicates and filter out companies with invalid addresses
  const validCompanies = useMemo(() => {
    const seen = new Set<string>();
    return companies.filter((row: CompanyProperties) => {
      // Check for duplicate business IDs
      if (seen.has(row.business_id)) return false;
      seen.add(row.business_id);

      // No longer validate coordinates - return all unique companies
      return true;
    });
  }, [companies]);

  // Filtered companies
  const filteredCompanies = useFilteredBusinesses({
    data: validCompanies,
    searchTerm: debouncedSearchTerm,
    selectedIndustries,
    userLocation,
    distanceLimit,
    sortDescriptor,
    isFetching,
  });

  // Pagination using the new hook
  const { paginated, totalPages } = useDashboardPagination({
    tableRows: filteredCompanies,
    currentPage: page,
    pageSize: pageSize,
    setCurrentPage: setPage,
  });

  // Get filtered cities for autocomplete
  const filteredCities = useMemo(() => {
    return cities
      .filter((city: string) => city.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((city: string) => ({ name: city }));
  }, [cities, searchQuery]);

  // Create GeoJSON with proper transformation
  const geojsonData = useMemo(() => {
    return transformCompanyGeoJSON({
      type: 'FeatureCollection',
      features: filteredCompanies.map((item: CompanyProperties) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            item.addresses?.['Visiting address']?.longitude || 0,
            item.addresses?.['Visiting address']?.latitude || 0,
          ],
        },
        properties: item,
      })),
    });
  }, [filteredCompanies]);

  // Get selected businesses using the original method
  const selectedBusinesses = useMemo(() => {
    return Array.from(selectedKeys)
      .map((id) => selectedRows[id])
      .filter(Boolean);
  }, [selectedKeys, selectedRows]);

  // Show loading overlay only during initial data fetch
  const isInitialLoading = cityLoading && cities.length === 0;

  // Check if we have data loading errors
  const hasDataErrors = !!cityError || !!companyError;

  // Default city if no cities loaded
  useEffect(() => {
    if ((!cities || cities.length === 0) && !cityLoading && !selectedCity) {
      // Set Helsinki as default
      setSelectedCity('Helsinki');
      router.replace('/dashboard?city=Helsinki');
    }
  }, [cities, cityLoading, router, selectedCity, setSelectedCity]);

  // Memoize header component to prevent re-renders
  const dashboardHeader = useMemo(
    () => (
      <DashboardHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        cities={filteredCities}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        cityLoading={cityLoading}
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
      />
    ),
    [viewMode, filteredCities, selectedCity, handleCityChange, cityLoading, searchQuery],
  );

  // Memoize view switcher component to prevent re-renders
  const viewSwitcherComponent = useMemo(
    () => (
      <ViewSwitcher
        data={paginated}
        allFilteredData={filteredCompanies}
        selectedBusinesses={selectedBusinesses}
        geojson={geojsonData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={allColumns}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isAnySectionLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    ),
    [
      paginated,
      filteredCompanies,
      selectedBusinesses,
      geojsonData,
      viewMode,
      page,
      totalPages,
      handlePageChange,
      isAnySectionLoading,
      searchTerm,
      sortDescriptor,
      pageSize,
      handlePageSizeChange,
    ],
  );

  return (
    <FeatureErrorBoundary
      featureName="Dashboard"
      fallback={
        <ErrorDisplay message="There was an error loading the dashboard. Please try again later." />
      }
    >
      <div className="flex flex-col w-full h-full min-h-screen pb-8">
        {/* Show loading overlay only during initial data loading */}
        {isInitialLoading && <LoadingOverlay message="Loading dashboard data..." />}

        {/* Show error message if data couldn't be loaded */}
        {isAnySectionLoading ? (
          <DashboardSkeleton />
        ) : hasDataErrors ? (
          <ErrorDisplay
            message="There was an error fetching data. Please try again later."
            error={cityError || companyError}
          />
        ) : (
          <div className="md:p-2 p-1 flex flex-col gap-2 sm:gap-3 md:gap-4">
            {/* Dashboard Header with controls */}
            {dashboardHeader}

            <FeatureErrorBoundary
              featureName="ViewSwitcher"
              fallback={
                <ErrorDisplay
                  message="The dashboard encountered an unexpected error"
                  showDetails={process.env.NODE_ENV === 'development'}
                />
              }
            >
              <Suspense fallback={<DashboardSkeleton />}>
                {/* Always render content if a city is selected or we have data */}
                {(filteredCompanies.length > 0 || isAnySectionLoading || selectedCity) &&
                  viewSwitcherComponent}
              </Suspense>
            </FeatureErrorBoundary>
          </div>
        )}
      </div>
    </FeatureErrorBoundary>
  );
}
