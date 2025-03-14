import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

export function useSearch() {
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

  return {
    cities,
    paginatedData,
    isLoading,
    pages,
    page,
    setPage,
    router,
  };
}
