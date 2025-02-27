"use client"
import { useState, useMemo } from "react";
import { title } from "@/components/primitives";
import { Input } from "@heroui/input";
import { SearchIcon } from "@/components/icons";
import { Form } from "@heroui/form";
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";

const BASE_URL = 'http://localhost:8000/api/v1';

const fetcher = (url: string) => fetch(url).then(res => res.json());

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
  const { data, error, isLoading } = useSWR<Business[]>(query ? `${BASE_URL}/businesses_by_city?city=${query}` : null, fetcher);
  const [page, setPage] = useState(1);

  const rowsPerPage = 25;

  const removeDuplicates = (businesses: Business[]): Business[] => {
    const uniqueBusinesses = new Map<string, Business>();
    businesses.forEach((business) => {
      uniqueBusinesses.set(business.business_id, business);
    });
    return Array.from(uniqueBusinesses.values());
  };

  const uniqueData = useMemo(() => {
    return data ? removeDuplicates(data) : [];
  }, [data]);

  const paginatedData: Business[] = useMemo(() => {
    if (!uniqueData) return [];
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return uniqueData.slice(startIndex, endIndex);
  }, [uniqueData, page, rowsPerPage]);

  const pages = useMemo(() => {
    return data ? Math.ceil(uniqueData.length / rowsPerPage) : 0;
  }, [data, rowsPerPage]);

  const searchInput = (
    <Input
      aria-label="Search"
      name="city"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="Search by city..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
      autoCapitalize="on"
      autoComplete="off"
    />
  );

  return (
    <>
      <Form className="mb-4" action="/search">
        {searchInput}
      </Form>
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
          <TableColumn key="industry_description">Industry</TableColumn>
          <TableColumn key="latitude_wgs84">Latitude</TableColumn>
          <TableColumn key="longitude_wgs84">Longitude</TableColumn>
        </TableHeader>
        <TableBody
          items={paginatedData}
          emptyContent="No results found"
          loadingContent={<Spinner />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item?.business_id}>
              {(columnKey) => (
                <TableCell className={columnKey === "business_id" ? "text-nowrap" : ""}>
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
