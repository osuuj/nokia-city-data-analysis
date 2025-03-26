"use client";

import useSWR from "swr";
import {
  useQueryState,
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsStringLiteral,
  createParser,
} from "nuqs";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  SortDescriptor,
} from "@heroui/react";
import useDebounce from "../hooks/useDebounce";
import { SearchIcon } from "@heroui/shared-icons";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const sortOrder = ["ascending", "descending"] as const;

const parseAsKey = createParser({
  parse(queryValue) {
    const numberValue = Number(queryValue);
    return isNaN(numberValue) ? queryValue : numberValue;
  },
  serialize(value) {
    return String(value);
  },
});

const direction = { ascending: "asc", descending: "desc" } as const;

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

function generateURL({
  city,
  page,
  sort_by,
  order,
  company_name,
}: {
  city: string;
  page: number;
  sort_by: string;
  order: string;
  company_name: string;
}) {
  const params = new URLSearchParams({
    city,
    page: String(page),
    sort_by,
    order,
    company_name,
  });

  return `${BASE_URL}/companies?${params.toString()}`;
}

export default function TableView() {
  const [city, setCity] = useQueryState("city", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [sorting, setSorting] = useQueryStates({
    column: parseAsKey.withDefault("company_name"),
    direction: parseAsStringLiteral(sortOrder).withDefault("ascending"),
  });
  const [companySearch, setCompanyName] = useQueryState(
    "companyName",
    parseAsString.withDefault("")
  );

  const debouncedCompanySearch = useDebounce(companySearch, 500, () =>
    setPage(1)
  );

  const URL = generateURL({
    city,
    page,
    sort_by: String(sorting.column),
    order: direction[sorting.direction],
    company_name: debouncedCompanySearch,
  });

  const { data: cities = [] } = useSWR<string[]>(`${BASE_URL}/cities`, fetcher);
  const { data, error, isValidating } = useSWR(URL, fetcher);
  const { totalPages } = data || {};

  // console.log("Page:", page);
  // console.log("Current Page:", currentPage);

  const companies: Business[] = data?.data || [];

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
            setPage(1);
          }
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>

      <Input
        className="mb-4"
        name="search"
        placeholder="Search by company name..."
        startContent={<SearchIcon width={16} />}
        value={companySearch}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <Table
        aria-label="Table of Businesses"
        classNames={{
          wrapper: "max-h-[800px]",
        }}
        sortDescriptor={sorting}
        onSortChange={(descriptor: SortDescriptor) => {
          setSorting(descriptor);
        }}
      >
        <TableHeader>
          <TableColumn key="company_name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="business_id" allowsSorting>
            Business ID
          </TableColumn>
          <TableColumn key="industry_description" allowsSorting>
            Industry
          </TableColumn>
          <TableColumn key="latitude_wgs84">Latitude</TableColumn>
          <TableColumn key="longitude_wgs84">Longitude</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="No results found"
          items={companies}
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

      <div className="flex justify-center mt-4">
        {totalPages && (
          <Pagination
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
