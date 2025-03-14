'use client';
import { useQuery } from '@tanstack/react-query';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchCompanies = async (city: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/businesses_by_city?city=${city}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useCompanies = (city: string) => {
  return useQuery({
    queryKey: ['companies', city],
    queryFn: () => fetchCompanies(city),
    enabled: !!city,
  });
};
