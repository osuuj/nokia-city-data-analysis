'use client';

import { columns as allColumns } from '@/config';
import { ViewModeToggle } from '@/features/dashboard/components/controls/ViewModeToggle/ViewModeToggle';
import { ViewSwitcher } from '@/features/dashboard/components/views/ViewSwitcher';
import { useDebounce, useFilteredBusinesses, usePagination } from '@/hooks';
import { LoadingOverlay } from '@/shared/components/ui/loading';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { CompanyProperties, SortDescriptor, ViewMode } from '@/types';
import { getVisibleColumns } from '@/utils';
import { transformCompanyGeoJSON } from '@/utils/geo';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import type { FeatureCollection, Point } from 'geojson';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    selectedCity,
    setSelectedCity,
    selectedIndustries,
    selectedKeys,
    selectedRows,
    userLocation,
    distanceLimit,
  } = useCompanyStore();

  const query = decodeURIComponent(searchParams.get('city') || '');

  // Optimize initial data fetching with better caching
  const { data: geojsonData, isLoading: isFetching } = useSWR<
    FeatureCollection<Point, CompanyProperties>
  >(
    selectedCity
      ? `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(selectedCity)}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
      suspense: false, // Don't use React Suspense
      keepPreviousData: true, // Keep previous data while fetching new data
      fallbackData: { type: 'FeatureCollection', features: [] }, // Provide fallback data
    },
  );

  const { data: cities = [], isLoading: cityLoading } = useSWR<string[]>(
    `${BASE_URL}/api/v1/cities`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      suspense: false, // Don't use React Suspense
      keepPreviousData: true, // Keep previous data while fetching new data
      fallbackData: [], // Provide fallback data
    },
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name',
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Add a loading state for initial page load
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Set initial loading to false after a very short delay
  useEffect(() => {
    // Start loading data immediately
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 50); // Reduced from 100ms to 50ms for faster response
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (query && query !== selectedCity) {
      setSelectedCity(query);
      setSearchTerm('');
      setPage(1);
    }
  }, [query, selectedCity, setSelectedCity]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const rowsPerPage = 25;

  const tableRows = useMemo(() => {
    const seen = new Set<string>();

    return (
      geojsonData?.features
        ?.map((f) => f.properties)
        .filter((row) => {
          const visiting = row.addresses?.['Visiting address'];
          const postal = row.addresses?.['Postal address'];
          const hasValidAddress =
            (visiting?.latitude && visiting?.longitude) || (postal?.latitude && postal?.longitude);

          if (!hasValidAddress) return false;

          if (seen.has(row.business_id)) return false;
          seen.add(row.business_id);
          return true;
        }) ?? []
    );
  }, [geojsonData]);

  const filteredAndSortedRows = useFilteredBusinesses({
    data: tableRows,
    searchTerm: debouncedSearchTerm,
    selectedIndustries,
    userLocation,
    distanceLimit,
    sortDescriptor,
    isFetching,
  });

  const { paginated, totalPages } = usePagination(filteredAndSortedRows, page, rowsPerPage);

  const filteredGeoJSON = useMemo(() => {
    if (!geojsonData) return { type: 'FeatureCollection' as const, features: [] };

    const selectedSet = new Set(
      selectedKeys.size > 0
        ? Array.from(selectedKeys)
        : filteredAndSortedRows.map((r) => r.business_id),
    );

    const hasValidGeometry = geojsonData.features.filter(
      (f) => f.geometry && selectedSet.has(f.properties.business_id),
    );

    const transformed = transformCompanyGeoJSON({
      type: 'FeatureCollection',
      features: geojsonData.features.filter(
        (f) => !f.geometry && selectedSet.has(f.properties.business_id),
      ),
    });

    return {
      type: 'FeatureCollection' as const,
      features: [...hasValidGeometry, ...transformed.features],
    } as FeatureCollection<
      Point,
      CompanyProperties & { addressType?: 'Visiting address' | 'Postal address' }
    >;
  }, [geojsonData, filteredAndSortedRows, selectedKeys]);

  const visibleColumns = useMemo(() => getVisibleColumns(allColumns), []);

  const filteredCities = useMemo(() => {
    return cities
      .filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((city) => ({ name: city }));
  }, [cities, searchQuery]);

  return (
    <div className="md:p-2 p-1 flex flex-col gap-2 sm:gap-3 md:gap-4">
      {isInitialLoading && <LoadingOverlay message="Loading data..." delay={300} />}

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
          onSelectionChange={(selected) => {
            if (typeof selected === 'string') {
              setSelectedCity(selected);
              router.replace(`/home?city=${encodeURIComponent(selected)}`);
            }
          }}
          isLoading={cityLoading}
        >
          {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
        </Autocomplete>
      )}

      <ViewSwitcher
        data={paginated}
        allFilteredData={filteredAndSortedRows}
        selectedBusinesses={Array.from(selectedKeys)
          .map((id) => selectedRows[id])
          .filter(Boolean)}
        geojson={filteredGeoJSON}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={visibleColumns}
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
