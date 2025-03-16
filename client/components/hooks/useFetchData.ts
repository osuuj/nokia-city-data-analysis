import { useCompanyStore } from '@/app/state/useCompanyStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ✅ Business type
export interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

// ✅ Function to fetch businesses for a selected city
const fetchCompanies = async (city: string): Promise<Business[]> => {
  if (!city) {
    console.warn('⚠️ City is empty, skipping fetch.');
    return [];
  }

  console.log('📡 Fetching companies from:', city);
  const response = await fetch(`${BASE_URL}/api/v1/businesses_by_city?city=${encodeURIComponent(city)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch businesses');
  }

  const data = await response.json();
  console.log('✅ Companies fetched:', data);

  return Array.isArray(data) ? data : [];
};

// ✅ Function to fetch cities
const fetchCities = async (): Promise<string[]> => {
  console.log('📡 Fetching cities...');
  const response = await fetch(`${BASE_URL}/api/v1/cities`);
  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }
  const cities = await response.json();
  console.log('✅ Cities fetched:', cities);
  return cities;
};

// ✅ React Query Hook to Fetch Cities
export function useFetchCities() {
  const { setAvailableCities } = useCompanyStore();
  
  const query = useQuery<string[], Error>({
    queryKey: ['cities'],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 10, // ✅ Cache cities for 10 minutes
  });

  // ✅ Store fetched cities in Zustand when available
  useEffect(() => {
    if (query.data) {
      console.log('✅ Storing cities in Zustand:', query.data);
      setAvailableCities(query.data);
    }
  }, [query.data, setAvailableCities]);

  return query;
}

// ✅ Hook to fetch businesses using React Query
export function useFetchCompanies(city: string) {
  return useQuery<Business[], Error>({
    queryKey: ['companies', city],
    queryFn: () => fetchCompanies(city),
    enabled: !!city, // ✅ Only fetch if a city is selected
  });
}
