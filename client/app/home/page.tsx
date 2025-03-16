'use client';

import { useCompanyStore } from '@/app/state/useCompanyStore';
import { useFetchCities, useFetchCompanies } from '@/components/hooks/useFetchData';
import TableView from '@/components/table/TableView';
import type { Business } from '@/types/business';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // ✅ Zustand state for selected city
  const { selectedCity, setSelectedCity } = useCompanyStore();
  
  // ✅ Fetch businesses using React Query
  const { data: businesses = [], error, isLoading } = useFetchCompanies(selectedCity);
  
  // ✅ Fetch cities for search dropdown
  const { data: cities = [] } = useFetchCities();

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

 const uniqueBusinesses = useMemo(() => {
  const unique = new Map<string, Business>();
  
  for (const business of businesses) {
    unique.set(business.business_id, business);
  }

    return Array.from(unique.values());
  }, [businesses]);

  // ✅ Paginate businesses
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return uniqueBusinesses.slice(startIndex, endIndex);
  }, [uniqueBusinesses, page]);

  return (
    <div className="p-4">
      {/* ✅ Search Bar */}
      <Autocomplete
        className="max-w-xs mb-8"
        items={cities.map((city) => ({ name: city }))}
        label="Search by city"
        variant="underlined"
        selectedKey={selectedCity || undefined}
        onSelectionChange={(selected) => {
          if (typeof selected === 'string') {
            console.log('✅ City selected:', selected);
            setSelectedCity(selected);
            router.replace(`/home?city=${encodeURIComponent(selected)}`);
          }
        }}
      >
        {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
      </Autocomplete>

      {/* ✅ Show error if fetching fails */}
      {error && <p className="text-red-500">❌ Error fetching data: {error.message}</p>}

      {/* ✅ Table View */}
     <TableView
        data={paginatedData} 
        columns={[ // ✅ Use correct prop name if needed
          { key: "company_name", label: "Name" },
          { key: "business_id", label: "Business ID" },
          { key: "industry_description", label: "Industry" },
          { key: "latitude_wgs84", label: "Latitude" },
          { key: "longitude_wgs84", label: "Longitude" },
        ]}
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(uniqueBusinesses.length / rowsPerPage))}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
