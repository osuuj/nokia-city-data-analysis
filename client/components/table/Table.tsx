'use client';

import { useCompanies } from '@/app/api/companies/companies'; // Import query hook
import {
  Autocomplete,
  AutocompleteItem,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export default function TableComponent() {
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get('city') || '';

  // ✅ Fetch Companies with `react-query`
  const { data, isLoading } = useCompanies(selectedCity);
  const [page, setPage] = useState(1);
  const rowsPerPage = 25;

  // ✅ Remove Duplicate Businesses
  const removeDuplicates = useCallback((businesses) => {
    const uniqueBusinesses = new Map();
    businesses?.forEach((business) => {
      uniqueBusinesses.set(business.business_id, business);
    });
    return Array.from(uniqueBusinesses.values());
  }, []);

  const uniqueData = useMemo(() => {
    return data ? removeDuplicates(data) : [];
  }, [data, removeDuplicates]);

  // ✅ Paginate Data
  const paginatedData = useMemo(() => {
    if (!uniqueData) return [];
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return uniqueData.slice(startIndex, endIndex);
  }, [uniqueData, page]);

  const totalPages = useMemo(() => {
    return uniqueData.length > 0 ? Math.ceil(uniqueData.length / rowsPerPage) : 0;
  }, [uniqueData]);

  return (
    <div className="p-6">
      {/* ✅ Search Bar */}
      <Autocomplete
        className="max-w-xs mb-4"
        defaultItems={(data || []).map((business) => ({ name: business.city }))}
        label="Search by city"
        variant="underlined"
        onSelectionChange={(selected) => {
          if (selected) {
            window.history.replaceState(null, '', `?city=${selected}`);
          }
        }}
      >
        {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
      </Autocomplete>

      {/* ✅ Table */}
      <Table aria-label="Companies Table">
        <TableHeader>
          <TableColumn key="company_name">Company Name</TableColumn>
          <TableColumn key="business_id">Business ID</TableColumn>
          <TableColumn key="industry_description">Industry</TableColumn>
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
            <TableRow key={item.business_id}>
              <TableCell>{item.company_name}</TableCell>
              <TableCell>{item.business_id}</TableCell>
              <TableCell>{item.industry_description}</TableCell>
              <TableCell>{item.latitude_wgs84}</TableCell>
              <TableCell>{item.longitude_wgs84}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ✅ Pagination */}
      {totalPages > 0 && (
        <div className="flex w-full justify-center mt-4">
          <Pagination
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
}
