'use client';
import { useDebounce } from '@/components/hooks/useDebounce';
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
  const selectedIndustries = useCompanyStore((s) => s.selectedIndustries);

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
      setSearchTerm(''); // ✅ Clear search
      setPage(1); // ✅ Reset to page 1
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

  // ✅ useState
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof Business;
    direction: 'asc' | 'desc';
  }>({
    column: 'company_name',
    direction: 'asc',
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const rowsPerPage = 25;

  const filteredAndSortedBusinesses = useMemo(() => {
    if (!uniqueBusinesses || isFetching) return [];

    let filtered = uniqueBusinesses;

    // 🔍 Filter by search
    if (debouncedSearchTerm) {
      filtered = filtered.filter((item) =>
        item.company_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      );
    }

    // 🔍 Filter by industry
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((item) => selectedIndustries.includes(item.industry || ''));
    }

    // ✅ Sort
    return [...filtered].sort((a, b) => {
      const col = sortDescriptor.column;
      const valA = a[col] ?? '';
      const valB = b[col] ?? '';
      const result = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDescriptor.direction === 'desc' ? -result : result;
    });
  }, [uniqueBusinesses, debouncedSearchTerm, selectedIndustries, sortDescriptor, isFetching]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredAndSortedBusinesses.slice(start, start + rowsPerPage);
  }, [filteredAndSortedBusinesses, page]);

  const totalPages = Math.ceil(filteredAndSortedBusinesses.length / rowsPerPage) || 1;

  // ✅ Search Query State
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Generate Columns Dynamically
  const visibleColumns = useMemo(() => getVisibleColumns(allColumns), []);

  return (
    <div className="md:p-2 p-1">
      {/* ✅ Search Input */}
      <Autocomplete
        classNames={{
          base: 'md:max-w-xs max-w-[30vw] min-w-[200px]',
        }}
        popoverProps={{
          classNames: {
            content: 'max-w-[40vw] md:max-w-xs',
          },
        }}
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

      {/* ✅ Feedback Messages */}
      {error && (
        <p className="text-red-500 text-sm mt-2">❌ Error fetching data: {error.message}</p>
      )}

      {isFetching && <p className="text-default-500 text-sm mt-2">⏳ Loading city data...</p>}

      {!isFetching && filteredAndSortedBusinesses.length === 0 && (
        <p className="text-default-500 text-sm mt-2">⚠️ No matching companies found.</p>
      )}

      {/* ✅ Table View with Improved Selection Handling */}
      <TableView
        data={paginatedData}
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
