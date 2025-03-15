import { useCompanyStore } from '@/app/state/useCompanyStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
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
  const { fetchCompanies } = useCompanyStore(); // ✅ Use Zustand store instead of SWR
  const { data: cities } = useSWR<string[]>(`${BASE_URL}/api/v1/cities`, fetcher);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const rowsPerPage = 25;

  // ✅ Fetch companies when city is selected
  useMemo(() => {
    if (query) {
      fetchCompanies(query);
    }
  }, [query, fetchCompanies]);

  return {
    cities,
    page,
    setPage,
    router,
  };
}
