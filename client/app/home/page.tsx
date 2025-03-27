'use client';

import { useDebounce } from '@/components/hooks/useDebounce';
import { usePagination } from '@/components/hooks/usePagination';
import { ViewModeToggle, ViewSwitcher } from '@/components/views';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { CompanyProperties } from '@/types';
import type { CompanyTableKey, SortDescriptor } from '@/types/table';
import { columns as allColumns } from '@/types/table';
import type { ViewMode } from '@/types/view';
import { filterByDistance } from '@/utils/geo';
import { getVisibleColumns } from '@/utils/table';
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
    userLocation,
    distanceLimit,
  } = useCompanyStore();

  const query = decodeURIComponent(searchParams.get('city') || '');

  const {
    data: geojsonData,
    error,
    isLoading: isFetching,
  } = useSWR<FeatureCollection<Point, CompanyProperties>>(
    selectedCity
      ? `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(selectedCity)}`
      : null,
    fetcher,
  );

  const {
    data: cities = [],
    error: cityError,
    isLoading: cityLoading,
  } = useSWR<string[]>(`${BASE_URL}/api/v1/cities`, fetcher);

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

  const features = useMemo(() => geojsonData?.features ?? [], [geojsonData]);

  const tableRows = useMemo(() => {
    const seen = new Set<string>();
    return features
      .map((f) => f.properties)
      .filter((row) => {
        const visiting = row.addresses?.['Visiting address'];
        if (!visiting) return false;
        if (seen.has(row.business_id)) return false;
        seen.add(row.business_id);
        return true;
      });
  }, [features]);

  const filteredAndSortedRows = useMemo(() => {
    let filtered = tableRows.filter((row) =>
      row.company_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );

    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((row) => selectedIndustries.includes(row.industry_letter ?? ''));
    }

    if (userLocation && distanceLimit != null) {
      filtered = filterByDistance(filtered, userLocation, distanceLimit);
    }

    const { column, direction } = sortDescriptor;

    const getSortableValue = (item: CompanyProperties, column: CompanyTableKey) => {
      const visiting = item.addresses?.['Visiting address'];
      switch (column) {
        case 'street':
          return visiting?.street ?? '';
        case 'building_number':
          return visiting?.building_number ?? '';
        case 'postal_code':
          return visiting?.postal_code ?? '';
        case 'city':
          return visiting?.city ?? '';
        case 'entrance':
          return visiting?.entrance ?? '';
        case 'address_type':
          return 'Visiting address';
        default:
          return item[column] ?? '';
      }
    };

    filtered.sort((a, b) => {
      const valA = getSortableValue(a, column);
      const valB = getSortableValue(b, column);
      const comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
      return direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [
    tableRows,
    debouncedSearchTerm,
    selectedIndustries,
    userLocation,
    distanceLimit,
    sortDescriptor,
  ]);

  const { paginated, totalPages } = usePagination(filteredAndSortedRows, page, rowsPerPage);

  const selectedBusinesses = useMemo(
    () => filteredAndSortedRows.filter((b) => selectedKeys.has(b.business_id)),
    [filteredAndSortedRows, selectedKeys],
  );

  const filteredGeoJSON = useMemo<FeatureCollection<Point, CompanyProperties>>(() => {
    const filteredSet = new Set(filteredAndSortedRows.map((r) => r.business_id));
    return {
      type: 'FeatureCollection',
      features:
        geojsonData?.features.filter((f) => filteredSet.has(f.properties.business_id)) ?? [],
    };
  }, [geojsonData, filteredAndSortedRows]);

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
        data={viewMode === 'map' || viewMode === 'split' ? selectedBusinesses : paginated}
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
        allFilteredData={filteredAndSortedRows}
      />
    </div>
  );
}
