"use client";
import { useCompanyStore } from "@/app/state/useCompanyStore";
import { useFetchCompanies } from "@/components/hooks/useFetchData";
import TableView from "@/components/table/TableView";
import type { Business } from "@/types/business";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedCity, setSelectedCity } = useCompanyStore();

  // ✅ Read city from URL (ensure it's safe)
  const query = decodeURIComponent(searchParams.get("city") || "");

  // ✅ Fetch businesses using React Query
  const { data, error, isFetching } = useFetchCompanies(selectedCity);

  // ✅ Fetch cities using SWR
  const { data: cities = [] } = useSWR<string[]>(`${BASE_URL}/api/v1/cities`, fetcher, {
    dedupingInterval: 1000 * 60 * 10,
    revalidateOnFocus: false,
  });

  const [page, setPage] = useState(1);
  const rowsPerPage = 25;

  // ✅ Ensure state updates when URL changes
  useEffect(() => {
    if (query !== selectedCity) {
      console.log("🔄 URL changed, updating selectedCity:", query);
      setSelectedCity(query);
    }
  }, [query, selectedCity, setSelectedCity]);

  // ✅ Remove duplicate businesses (Use `for...of`)
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
  const paginatedData = useMemo(() => {
    if (!uniqueData) return [];
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return uniqueData.slice(startIndex, endIndex);
  }, [uniqueData, page]);

  // ✅ Calculate total pages correctly
  const totalPages = useMemo(() => (uniqueData.length > 0 ? Math.ceil(uniqueData.length / rowsPerPage) : 0), [uniqueData]);

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-4">
      {/* ✅ Search Bar */}
      <Autocomplete
        className="max-w-xs mb-8"
        items={(cities as string[])
          .filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((city) => ({ name: city }))} // ✅ Ensure the object has a `name` property
        label="Search by city"
        variant="underlined"
        selectedKey={selectedCity || undefined}
        onInputChange={(input) => {
          setSearchQuery(input);
        }}
        onSelectionChange={(selected) => {
          if (selected && typeof selected === "string") {
            setSelectedCity(selected);
            router.replace(`/home?city=${encodeURIComponent(selected)}`);
          }
        }}
      >
        {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
      </Autocomplete>

      {/* ✅ Handle Errors */}
      {error && <p className="text-red-500">❌ Error fetching data: {error.message}</p>}

      {/* ✅ Table View */}
      <TableView
        data={paginatedData}
        columns={[
          { key: "company_name", label: "Name" },
          { key: "business_id", label: "Business ID" },
          { key: "industry_description", label: "Industry Description" },
          { key: "latitude_wgs84", label: "Latitude" },
          { key: "longitude_wgs84", label: "Longitude" },
        ]}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </div>
  );
}