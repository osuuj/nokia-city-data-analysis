'use client';

import { useFetchCompanies } from '@/components/hooks/useCompaniesQuery';
import { useDebounce } from '@/components/hooks/useDebounce';
import { useFilteredBusinesses } from '@/components/hooks/useFilteredBusinesses';
import { usePagination } from '@/components/hooks/usePagination';
import { ViewModeToggle, ViewSwitcher } from '@/components/views';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { SortDescriptor } from '@/types/table';
import { columns as allColumns } from '@/types/table';
import type { ViewMode } from '@/types/view';
import { getVisibleColumns } from '@/utils/table';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { selectedCity, setSelectedCity } = useCompanyStore();
  const selectedIndustries = useCompanyStore((s) => s.selectedIndustries);
  const selectedKeys = useCompanyStore((s) => s.selectedKeys);
  const userLocation = useCompanyStore((s) => s.userLocation);
  const distanceLimit = useCompanyStore((s) => s.distanceLimit);

  const query = decodeURIComponent(searchParams.get('city') || '');

  const { data, error, isFetching } = useFetchCompanies(selectedCity);
  const { data: cities = [] } = useSWR<string[]>(`${BASE_URL}/api/v1/cities`, fetcher);

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

  const uniqueBusinesses = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, (typeof data)[0]>();
    for (const business of data) {
      map.set(business.business_id, business);
    }
    return Array.from(map.values());
  }, [data]);

  const filteredAndSortedBusinesses = useFilteredBusinesses({
    data: uniqueBusinesses,
    searchTerm: debouncedSearchTerm,
    selectedIndustries,
    userLocation,
    distanceLimit,
    sortDescriptor,
    isFetching,
  });

  const selectedBusinesses = useMemo(
    () => filteredAndSortedBusinesses.filter((b) => selectedKeys.has(b.business_id)),
    [filteredAndSortedBusinesses, selectedKeys],
  );

  const { paginated, totalPages } = usePagination(filteredAndSortedBusinesses, page, rowsPerPage);

  const visibleColumns = useMemo(() => getVisibleColumns(allColumns), []);

  return (
    <div className="md:p-2 p-1 flex flex-col gap-4">
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode !== 'map' && (
        <>
          {cities.length > 0 && (
            <Autocomplete
              classNames={{ base: 'md:max-w-xs max-w-[30vw] min-w-[200px]' }}
              popoverProps={{ classNames: { content: 'max-w-[40vw] md:max-w-xs' } }}
              items={cities
                .filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((city) => ({ name: city }))}
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

          {error && (
            <p className="text-red-500 text-sm mt-2">❌ Error fetching data: {error.message}</p>
          )}
          {isFetching && <p className="text-default-500 text-sm mt-2">⏳ Loading city data...</p>}
          {!isFetching && filteredAndSortedBusinesses.length === 0 && (
            <p className="text-default-500 text-sm mt-2">⚠️ No matching companies found.</p>
          )}
        </>
      )}

      <ViewSwitcher
        data={viewMode === 'map' || viewMode === 'split' ? selectedBusinesses : paginated}
        allFilteredData={filteredAndSortedBusinesses}
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
