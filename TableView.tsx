"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import {
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

interface TableViewProps {
  data: Business[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function TableView() {
  const [city, setCity] = useQueryState("city", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const companiesApi = `${BASE_URL}/companies?city=${city}&page=${page}`;

  console.log("🚀 Fetching data from:", companiesApi);

  // ✅ Fetch list of cities
  const { data: cities = [] } = useSWR<string[]>(`${BASE_URL}/cities`, fetcher);

  // ✅ Fetch businesses based on selectedCity
  const { data, error, isValidating } = useSWR(companiesApi, fetcher);

  console.log(data);

  const companies: Business[] = data?.data || [];

  const rowsPerPage = 25;

  const totalPages = useMemo(
    () => (data?.total > 0 ? Math.ceil(data.total / rowsPerPage) : 0),
    [data, rowsPerPage]
  );

  return (
    <div className="p-4">
      <Autocomplete
        className="max-w-xs mb-8"
        defaultItems={cities.map((city) => ({ name: city }))}
        label="Select city"
        variant="underlined"
        onSelectionChange={(selected) => {
          if (selected && typeof selected === "string") {
            setCity(selected);
          }
        }}
        // selectedKey={selectedCity || undefined}
        // onSelectionChange={(selected) => {
        //   if (selected && typeof selected === "string") {
        //     console.log("✅ City selected:", selected);
        //     setSelectedCity(selected);

        //     // ✅ Update URL & Fetch data
        //     router.replace(`/home?city=${encodeURIComponent(selected)}`);
        //     mutate(`${BASE_URL}/businesses_by_city?city=${encodeURIComponent(selected)}`);
        //   }
        // }}
      >
        {(item) => (
          <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>
      {/* ✅ Search Input */}
      <Input
        className="mb-4"
        placeholder="Search by company name..."
        startContent={<SearchIcon width={16} />}
        // value={searchTerm}
        // onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table aria-label="Table of Businesses">
        <TableHeader>
          <TableColumn
            key="company_name"
            // onClick={() => setSortKey("company_name")}
          >
            Name
          </TableColumn>
          <TableColumn
            key="business_id"
            // onClick={() => setSortKey("business_id")}
          >
            Business ID
          </TableColumn>
          <TableColumn
            key="industry_description"
            // onClick={() => setSortKey("industry_description")}
          >
            Industry
          </TableColumn>
          <TableColumn
            key="latitude_wgs84"
            // onClick={() => setSortKey("latitude_wgs84")}
          >
            Latitude
          </TableColumn>
          <TableColumn
            key="longitude_wgs84"
            // onClick={() => setSortKey("longitude_wgs84")}
          >
            Longitude
          </TableColumn>
        </TableHeader>
        <TableBody
          items={data}
          emptyContent="No results found"
          loadingContent={<Spinner />}
          loadingState={isValidating ? "loading" : "idle"}
        >
          {(item: Business) => (
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
      <div className="flex justify-center mt-4">
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
