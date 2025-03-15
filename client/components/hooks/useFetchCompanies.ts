import { useQuery } from '@tanstack/react-query';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Business {
  business_id: string;
  company_name: string;
  industry_description: string;
  latitude_wgs84: number;
  longitude_wgs84: number;
}

const fetchCompanies = async (city: string): Promise<Business[]> => {
  if (!city) {
    console.warn('⚠️ City is empty, skipping fetch.');
    return [];
  }

  const url = `${BASE_URL}/api/v1/businesses_by_city?city=${encodeURIComponent(city)}`;
  console.log('📡 Fetching companies from:', url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Request Failed: ${response.status} - ${response.statusText}`);
      return [];
    }

    console.log('✅ API Response:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    return [];
  }
};

export function useFetchCompanies(city: string) {
  console.log('🛠 useFetchCompanies Hook Called with city:', city);

  return useQuery({
    queryKey: ['companies', city],
    queryFn: () => fetchCompanies(city),
    enabled: !!city, // Only fetch if a city is selected
  });
}
