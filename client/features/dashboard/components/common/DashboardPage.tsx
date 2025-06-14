'use client';

import { DashboardHeader } from '@/features/dashboard/components/common/controls/DashboardHeader';
import { ViewSwitcher } from '@/features/dashboard/components/common/controls/Toggles/ViewSwitcher';
import { DashboardLoadingState } from '@/features/dashboard/components/common/loading/DashboardLoadingState';
import { columns as allColumns } from '@/features/dashboard/config/columns';
import { useFetchCities } from '@/features/dashboard/hooks/useCompaniesQuery';
import { useCompaniesByCity } from '@/features/dashboard/hooks/useCompaniesQueryPatches';
import { useDashboardLoading } from '@/features/dashboard/hooks/useDashboardLoading';
import { useDashboardPagination } from '@/features/dashboard/hooks/useDashboardPagination';
import { useFilteredBusinesses } from '@/features/dashboard/hooks/useFilteredBusinesses';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { ErrorDisplay, FeatureErrorBoundary } from '@/shared/components/error';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

// Default rows per page
const DEFAULT_PAGE_SIZE = 20;

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
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
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
    data: companyFeatures = [],
    isLoading: isFetching,
    error: companyError,
    fetchProgress,
  } = useCompaniesByCity(selectedCity);

  // Extract company properties from features
  const companies = useMemo(
    () => companyFeatures.map((feature) => feature.properties),
    [companyFeatures],
  );

  // Use loading hook to centralize loading states
  const { isAnySectionLoading } = useDashboardLoading({
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

  // Pagination using the enhanced hook
  const { paginated, totalPages } = useDashboardPagination({
    tableRows: filteredCompanies,
    currentPage: page,
    pageSize: pageSize,
    setCurrentPage: setPage,
  });

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

  // Show loading state for initial data fetch
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

  // Calculate loading progress
  const loadingProgress = useMemo(() => {
    if (!isAnySectionLoading) return 100;
    if (cityLoading) return 0;
    return fetchProgress;
  }, [isAnySectionLoading, cityLoading, fetchProgress]);

  // Memoize header component to prevent re-renders
  const dashboardHeader = useMemo(
    () => (
      <DashboardHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
      />
    ),
    [viewMode, selectedCity, handleCityChange],
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
        columns={allColumns}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isAnySectionLoading}
        progress={loadingProgress}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        pageSize={pageSize}
        totalItems={filteredCompanies.length}
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
      loadingProgress,
    ],
  );

  return (
    <div className="flex w-full flex-col h-full">
      {/* Show loading state for initial data fetch */}
      {isInitialLoading && <DashboardLoadingState />}

      {/* Error view when city or company data fails to load */}
      {hasDataErrors && !isInitialLoading ? (
        <FeatureErrorBoundary
          featureName="Dashboard"
          fallback={
            <ErrorDisplay
              message="There was an error loading the dashboard data."
              showDetails={true}
              error={cityError || companyError}
            />
          }
        >
          <div>Error handled by boundary</div>
        </FeatureErrorBoundary>
      ) : (
        // Main dashboard view
        <FeatureErrorBoundary featureName="Dashboard" fallback={<DashboardLoadingState />}>
          {dashboardHeader}

          <div className="flex-1 px-6 py-6 md:px-10">
            <Suspense fallback={<DashboardLoadingState />}>{viewSwitcherComponent}</Suspense>
          </div>
        </FeatureErrorBoundary>
      )}
    </div>
  );
}
