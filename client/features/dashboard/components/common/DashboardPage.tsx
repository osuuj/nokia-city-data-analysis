'use client';

import { ViewModeToggle } from '@/features/dashboard/components/controls/Toggles/ViewModeToggle';
import { ViewSwitcher } from '@/features/dashboard/components/controls/Toggles/ViewSwitcher';
import { columns as allColumns } from '@/features/dashboard/config/columns';
import { useFetchCities, useFetchCompanies } from '@/features/dashboard/hooks/useCompaniesQuery';
import { useFilteredBusinesses } from '@/features/dashboard/hooks/useFilteredBusinesses';
import { usePagination } from '@/features/dashboard/hooks/usePagination';
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import type { SortDescriptor } from '@/features/dashboard/types/table';
import type { ViewMode } from '@/features/dashboard/types/view';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { LoadingOverlay } from '@/shared/components/loading/LoadingOverlay';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Autocomplete, AutocompleteItem, type Selection } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const ROWS_PER_PAGE = 20;

/**
 * Main dashboard page component
 * Displays city data with various visualization options
 */
export function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the query param
  const query = decodeURIComponent(searchParams.get('city') || '');

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
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name',
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Debounce search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Set initial loading to false after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 50);
    return () => clearTimeout(timer);
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

      // Validate addresses
      const visiting = row.addresses?.['Visiting address'];
      const postal = row.addresses?.['Postal address'];
      const hasValidAddress =
        (visiting?.latitude && visiting?.longitude) || (postal?.latitude && postal?.longitude);

      return hasValidAddress;
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

  // Pagination
  const { paginated, totalPages } = usePagination(filteredCompanies, page, ROWS_PER_PAGE);

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

  return (
    <div className="md:p-2 p-1 flex flex-col gap-2 sm:gap-3 md:gap-4">
      {isInitialLoading && <LoadingOverlay message="Loading data..." />}

      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode !== 'map' && viewMode !== 'analytics' && (
        <Autocomplete
          classNames={{ base: 'md:max-w-xs max-w-[30vw] min-w-[200px]' }}
          popoverProps={{ classNames: { content: 'max-w-[40vw] md:max-w-xs' } }}
          items={filteredCities}
          label="Search by city"
          variant="underlined"
          selectedKey={selectedCity}
          onInputChange={setSearchQuery}
          onSelectionChange={(key: string | number | null) => {
            if (typeof key === 'string') {
              setSelectedCity(key);
              router.replace(`/dashboard?city=${encodeURIComponent(key)}`);
            }
          }}
          isLoading={cityLoading}
        >
          {(item: { name: string }) => (
            <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      )}

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
        onPageChange={setPage}
        isLoading={isFetching || cityLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
      />
    </div>
  );
}
