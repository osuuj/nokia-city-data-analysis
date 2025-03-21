import { useQuery } from '@tanstack/react-query';
import type { Business } from '@/types/business';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


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

// ✅ Function to fetch cities (React Query only, no Zustand)
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

// ✅ React Query Hook to Fetch Cities (NO Zustand)
export function useFetchCities() {
  return useQuery<string[], Error>({
    queryKey: ['cities'],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 10, // ✅ Cache cities for 10 minutes
  });
}

// ✅ Hook to fetch businesses using React Query
export function useFetchCompanies(city: string) {
  return useQuery<Business[], Error>({
    queryKey: ['companies', city],
    queryFn: () => fetchCompanies(city),
    enabled: !!city, // ✅ Only fetch if a city is selected
  });
}