'use client';
import TableView from '@/components/table/TableView'; // ✅ Import TableView
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';

const BASE_URL = 'http://localhost:8000/api/v1';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Read city from URL (ensure it's safe)
  const query = decodeURIComponent(searchParams.get('city') || '');

  // ✅ Keep selected city state controlled
  const [selectedCity, setSelectedCity] = useState<string>(query);

  // ✅ Construct API URL dynamically
  const businessesApiUrl = selectedCity
    ? `${BASE_URL}/businesses_by_city?city=${encodeURIComponent(selectedCity)}`
    : null;

  console.log('🚀 Fetching data from:', businessesApiUrl);

  // ✅ Fetch businesses based on selectedCity
  const { data, error, isValidating } = useSWR<Business[]>(businessesApiUrl, fetcher);

  // ✅ Fetch list of cities
  const { data: cities = [] } = useSWR<string[]>(`${BASE_URL}/cities`, fetcher);

  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  // ✅ Ensure state updates when URL changes
  useEffect(() => {
    if (query !== selectedCity) {
      console.log('🔄 URL changed, updating selectedCity:', query);
      setSelectedCity(query);
      mutate(businessesApiUrl); // ✅ Revalidate SWR on city change
    }
  }, [query, selectedCity]);

  // ✅ Remove duplicate businesses (Ensures unique values)
  const removeDuplicates = useCallback((businesses: Business[]): Business[] => {
    const uniqueBusinesses = new Map<string, Business>();
    for (const business of businesses) {
      uniqueBusinesses.set(business.business_id, business);
    }
    return Array.from(uniqueBusinesses.values());
  }, []);

  // ✅ Memoized business list
  const uniqueData = useMemo(() => (data ? removeDuplicates(data) : []), [data, removeDuplicates]);

  // ✅ Paginate Data
  const paginatedData: Business[] = useMemo(() => {
    if (!uniqueData) return [];
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return uniqueData.slice(startIndex, endIndex);
  }, [uniqueData, page]);

  // ✅ Calculate total pages correctly
  const totalPages = useMemo(
    () => (uniqueData.length > 0 ? Math.ceil(uniqueData.length / rowsPerPage) : 0),
    [uniqueData],
  );

  return (
    <div className="p-4">
      {/* ✅ Search Bar (fully controlled) */}
      <Autocomplete
        className="max-w-xs mb-8"
        defaultItems={cities.map((city) => ({ name: city }))}
        label="Search by city"
        variant="underlined"
        selectedKey={selectedCity || undefined}
        onSelectionChange={(selected) => {
          if (selected && typeof selected === 'string') {
            console.log('✅ City selected:', selected);
            setSelectedCity(selected);

            // ✅ Update URL & Fetch data
            router.replace(`/home?city=${encodeURIComponent(selected)}`);
            mutate(`${BASE_URL}/businesses_by_city?city=${encodeURIComponent(selected)}`);
          }
        }}
      >
        {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
      </Autocomplete>

      {/* ✅ Handle Errors */}
      {error && <p className="text-red-500">❌ Error fetching data: {error.message}</p>}

      {/* ✅ Use TableView (no inline table) */}
      <TableView
        data={paginatedData}
        columns={[
          { key: 'company_name', label: 'Name' },
          { key: 'business_id', label: 'Business ID' },
          { key: 'industry_description', label: 'Industry Description' },
          { key: 'latitude_wgs84', label: 'Latitude' },
          { key: 'longitude_wgs84', label: 'Longitude' },
        ]} // ✅ Ensure columns is provided
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isValidating}
      />
    </div>
  );
}
