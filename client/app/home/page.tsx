'use client';

import { useFetchCompanies } from '@/components/hooks/useFetchData';
import TableView from '@/components/table/TableView';
import type { TableColumnConfig } from '@/components/table/tableConfig';
import { columns as allColumns } from '@/components/table/tableConfig';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { Business } from '@/types/business';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getVisibleColumns = (columns: TableColumnConfig[]): TableColumnConfig[] => {
  return columns.filter((column) => column.visible);
};

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedCity, setSelectedCity } = useCompanyStore();

  // ✅ Get city from URL and decode safely
  const query = decodeURIComponent(searchParams.get('city') || '');

  // ✅ Fetch businesses using React Query
  const { data, error, isFetching } = useFetchCompanies(selectedCity);

  // ✅ Fetch available cities using SWR
  const { data: cities = [] } = useSWR<string[]>(`${BASE_URL}/api/v1/cities`, fetcher, {
    dedupingInterval: 1000 * 60 * 10,
    revalidateOnFocus: false,
  });

  // ✅ Sync state with URL changes
  useEffect(() => {
    if (query && query !== selectedCity) {
      setSelectedCity(query);
    }
  }, [query, selectedCity, setSelectedCity]);

  // ✅ Remove duplicate businesses (efficient `Map` implementation)
  const uniqueBusinesses = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, Business>();
    for (const business of data) {
      map.set(business.business_id, business);
    }
    return Array.from(map.values());
  }, [data]);

  // ✅ Pagination State
  const [page, setPage] = useState(1);
  const rowsPerPage = 25;

  // ✅ Paginate Data Efficiently
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return uniqueBusinesses.slice(start, start + rowsPerPage);
  }, [uniqueBusinesses, page]);

  // ✅ Compute Total Pages
  const totalPages = Math.ceil(uniqueBusinesses.length / rowsPerPage) || 1;

  // ✅ Search Query State
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Generate Columns Dynamically
  const visibleColumns = useMemo(() => getVisibleColumns(allColumns), []);

  return (
    <div className="p-2">
      {/* ✅ Search Input */}
      <Autocomplete
        className="max-w-xs"
        items={(cities as string[])
          .filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((city) => ({ name: city }))}
        label="Search by city"
        variant="underlined"
        selectedKey={selectedCity || undefined}
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

      {/* ✅ Error Handling */}
      {error && <p className="text-red-500">❌ Error fetching data: {error.message}</p>}

      {/* ✅ Table View with Improved Selection Handling */}
      <TableView
        data={paginatedData}
        columns={visibleColumns}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </div>
  );
}
