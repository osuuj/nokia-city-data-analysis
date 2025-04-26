import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderOptions, render } from '@testing-library/react';
import type React from 'react';

// Create a custom renderer that includes providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock data generators
export const generateMockCity = (id = '1', name = 'Test City') => ({
  id,
  name,
  country: 'Test Country',
  latitude: 40.7128,
  longitude: -74.006,
  population: 1000000,
  timezone: 'America/New_York',
});

export const generateMockIndustry = (id = '1', name = 'Test Industry') => ({
  id,
  name,
  title: name,
  value: id,
});

export const generateMockCompany = (id = '1', name = 'Test Company') => ({
  id,
  name,
  city: 'Test City',
  industry: 'Test Industry',
  size: 'Medium',
  founded: 2000,
  website: 'https://example.com',
  description: 'A test company',
});

export const generateMockTopCityData = (city = 'Test City', count = 100) => ({
  city,
  count,
  percentage: 10,
  industries: {
    '1': 50,
    '2': 30,
    '3': 20,
  },
});

export const generateMockDistributionItem = (name = 'Test Industry', value = 100) => ({
  name,
  value,
});

export const generateMockPivotedData = () => ({
  cities: ['City 1', 'City 2', 'City 3'],
  industries: ['Industry 1', 'Industry 2', 'Industry 3'],
  data: {
    'City 1': {
      'Industry 1': 10,
      'Industry 2': 20,
      'Industry 3': 30,
    },
    'City 2': {
      'Industry 1': 40,
      'Industry 2': 50,
      'Industry 3': 60,
    },
    'City 3': {
      'Industry 1': 70,
      'Industry 2': 80,
      'Industry 3': 90,
    },
  },
});

// Mock API responses
export const mockApiResponse = <T,>(data: T, status = 200, message = 'Success') => ({
  data,
  status,
  message,
});

// Mock error responses
export const mockApiError = (message = 'Error', status = 500, code = 'ERROR') => ({
  name: 'ApiError',
  message,
  status,
  code,
});
