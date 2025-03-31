'use client';

import { ViewModeToggle, ViewSwitcher } from '@/components/ui/Toggles';
import { columns as allColumns } from '@/config';
import { useDebounce, useFilteredBusinesses, usePagination } from '@/hooks';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { CompanyProperties, SortDescriptor, ViewMode } from '@/types';
import { getVisibleColumns } from '@/utils';
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
    addressFilterMode,
  } = useCompanyStore();

  const query = decodeURIComponent(searchParams.get('city') || '');

  const { data: geojsonData, isLoading: isFetching } = useSWR<
    FeatureCollection<Point, CompanyProperties>
  >(
    selectedCity
      ? `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(selectedCity)}`
      : null,
    fetcher,
  );

  const { data: cities = [], isLoading: cityLoading } = useSWR<string[]>(
    `${BASE_URL}/api/v1/cities`,
    fetcher,
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'company_name',
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');

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

          // ✅ Handle filter mode logic
          const hasValidAddress =
            addressFilterMode === 'VisitingOnly' ? !!visiting : !!visiting || !!postal;

          if (!hasValidAddress) return false;

          if (seen.has(row.business_id)) return false;
          seen.add(row.business_id);
          return true;
        }) ?? []
    );
  }, [geojsonData, addressFilterMode]);

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

  const filteredGeoJSON = useMemo<FeatureCollection<Point, CompanyProperties>>(() => {
    if (!geojsonData) return { type: 'FeatureCollection', features: [] };

    const hasSelection = selectedKeys.size > 0;

    const selectedSet = new Set(
      hasSelection ? Array.from(selectedKeys) : filteredAndSortedRows.map((r) => r.business_id),
    );

    return {
      type: 'FeatureCollection',
      features: geojsonData.features.filter((f) => selectedSet.has(f.properties.business_id)),
    };
  }, [geojsonData, filteredAndSortedRows, selectedKeys]);

  const visibleColumns = useMemo(() => getVisibleColumns(allColumns), []);

  const filteredCities = useMemo(() => {
    return cities
      .filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((city) => ({ name: city }));
  }, [cities, searchQuery]);

  return (
    <div className="md:p-2 p-1 flex flex-col gap-4">
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode !== 'map' && (
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
        isLoading={isFetching}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
      />
    </div>
  );
}
