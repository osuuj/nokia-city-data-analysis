'use client';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Pagination } from '@heroui/pagination';
import { Spinner } from '@heroui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@heroui/table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('city');
  const { data, isLoading } = useSWR<Business[]>(
    query ? `${BASE_URL}/api/v1/businesses_by_city?city=${query}` : null,
    fetcher,
  );
  const { data: cities } = useSWR<string[]>(`${BASE_URL}/api/v1/cities`, fetcher);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const rowsPerPage = 25;

  const removeDuplicates = useCallback((businesses: Business[]): Business[] => {
    const uniqueBusinesses = new Map<string, Business>();
    for (const business of businesses) {
      uniqueBusinesses.set(business.business_id, business);
    }
    return Array.from(uniqueBusinesses.values());
  }, []);

  const uniqueData = useMemo(() => {
    return data ? removeDuplicates(data) : [];
  }, [data, removeDuplicates]);

  const paginatedData: Business[] = useMemo(() => {
    if (!uniqueData) return [];
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return uniqueData.slice(startIndex, endIndex);
  }, [uniqueData, page]);

  const pages = useMemo(() => {
    return data ? Math.ceil(uniqueData.length / rowsPerPage) : 0;
  }, [data, uniqueData.length]);

  return (
    <>
      <Autocomplete
        className="max-w-xs mb-8"
        defaultItems={(cities || []).map((city) => ({ name: city }))}
        label="Search by city"
        variant="underlined"
        onSelectionChange={(selected) => {
          if (selected) {
            router.push(`/search?city=${selected}`);
          }
        }}
      >
        {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
      </Autocomplete>
      <Table
        aria-label="Example table with client async pagination"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn key="company_name">Name</TableColumn>
          <TableColumn key="business_id">Business ID</TableColumn>
          <TableColumn key="industry_description">Industry Description</TableColumn>
          <TableColumn key="latitude_wgs84">Latitude</TableColumn>
          <TableColumn key="longitude_wgs84">Longitude</TableColumn>
        </TableHeader>
        <TableBody
          items={paginatedData}
          emptyContent="No results found"
          loadingContent={<Spinner />}
          loadingState={isLoading ? 'loading' : 'idle'}
        >
          {(item) => (
            <TableRow key={item?.business_id}>
              {(columnKey) => (
                <TableCell className={columnKey === 'business_id' ? 'text-nowrap' : ''}>
                  {getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
