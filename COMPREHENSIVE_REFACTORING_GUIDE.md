# Comprehensive Refactoring and Optimization Guide

## 1. App Folder Structure Optimization

### 1.1. Root Layout (`client/app/layout.tsx`)

**Current Issues:**
- Duplicate Providers wrapper in both root layout and dashboard layout
- Inefficient font loading strategy
- No error boundary at the root level

**Recommendations:**
- Remove the duplicate Providers wrapper from the dashboard layout
- Implement a more efficient font loading strategy using `next/font`
- Add a root-level error boundary for better error handling
- Implement a more robust theme loading strategy

```typescript
// Example implementation for root layout
import { fontSans, siteConfig } from '@shared/config';
import { ConditionalLayout } from '@shared/layout/components/conditional/ConditionalLayout';
import { Providers } from '@shared/providers';
import { ErrorBoundary } from '@/shared/components/error';
import '@/shared/styles/globals.css';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type React from 'react';

// ... existing metadata and viewport ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Theme loader script to prevent flicker */}
        <Script id="theme-loader" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();
          `}
        </Script>
      </head>
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
          <Providers themeProps={{ attribute: 'data-theme', defaultTheme: 'dark' }}>
            <ConditionalLayout>{children}</ConditionalLayout>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### 1.2. Dashboard Layout (`client/app/dashboard/layout.tsx`)

**Current Issues:**
- Duplicate Providers wrapper
- No error boundary at the dashboard level
- Inefficient layout structure

**Recommendations:**
- Remove the duplicate Providers wrapper
- Add a dashboard-level error boundary
- Implement a more efficient layout structure with better responsive design
- Add loading states for better user experience

```typescript
// Example implementation for dashboard layout
'use client';

import { DashboardFooter } from '@/features/layout/components/footer/DashboardFooter';
import { SidebarWrapper } from '@/features/layout/components/sidebar/SidebarWrapper';
import { ErrorBoundary } from '@/shared/components/error';
import { Suspense } from 'react';
import { LoadingOverlay } from '@/shared/components/ui/loading';

/**
 * Layout for the `/dashboard` route.
 * Clean layout with sidebar handled internally.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-row w-full">
      <SidebarWrapper />
      <div className="flex-1 flex-grow min-w-0 h-full flex flex-col overflow-y-auto">
        <ErrorBoundary fallback={<div>Something went wrong in the dashboard. Please refresh the page.</div>}>
          <Suspense fallback={<LoadingOverlay message="Loading dashboard..." />}>
            <main className="flex-1 w-full overflow-y-auto overflow-x-auto p-2 sm:p-3 md:p-4">
              {children}
            </main>
          </Suspense>
        </ErrorBoundary>
        <DashboardFooter />
      </div>
    </div>
  );
}
```

### 1.3. Dashboard Page (`client/app/dashboard/page.tsx`)

**Current Issues:**
- Large component with multiple responsibilities
- Inefficient data fetching strategy
- Redundant state management
- Complex UI logic mixed with data fetching

**Recommendations:**
- Split the component into smaller, more focused components
- Implement a more efficient data fetching strategy with better caching
- Move state management to a dedicated store
- Separate UI logic from data fetching
- Implement better error handling

```typescript
// Example implementation for dashboard page
'use client';

import { ViewModeToggle } from '@/features/dashboard/components/controls/ViewModeToggle/ViewModeToggle';
import { ViewSwitcher } from '@/features/dashboard/components/views/ViewSwitcher';
import { useFilteredBusinesses } from '@/features/dashboard/hooks';
import { useCompanyStore } from '@features/dashboard/store';
import { CitySearch } from '@/features/dashboard/components/controls/CitySearch';
import { LoadingOverlay } from '@/shared/components/ui/loading';
import { useDebounce, usePagination } from '@/shared/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'map' | 'split' | 'analytics'>('table');
  
  const {
    selectedCity,
    setSelectedCity,
    selectedIndustries,
    selectedKeys,
    selectedRows,
    userLocation,
    distanceLimit,
  } = useCompanyStore();

  const query = decodeURIComponent(searchParams.get('city') || '');
  
  // Use a custom hook to handle data fetching
  const {
    geojsonData,
    cities,
    isLoading: isFetching,
    cityLoading,
    tableRows,
    filteredAndSortedRows,
    filteredGeoJSON,
    visibleColumns,
    handleCityChange,
  } = useDashboardData({
    selectedCity,
    selectedIndustries,
    userLocation,
    distanceLimit,
    query,
  });

  // Set initial loading to false after a very short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Update selected city when query changes
  useEffect(() => {
    if (query && query !== selectedCity) {
      setSelectedCity(query);
      handleCityChange(query);
    }
  }, [query, selectedCity, setSelectedCity, handleCityChange]);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'company_name',
    direction: 'asc',
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const rowsPerPage = 25;

  const { paginated, totalPages } = usePagination(filteredAndSortedRows, page, rowsPerPage);

  return (
    <div className="md:p-2 p-1 flex flex-col gap-2 sm:gap-3 md:gap-4">
      {isInitialLoading && <LoadingOverlay message="Loading data..." delay={300} />}

      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode !== 'map' && viewMode !== 'analytics' && (
        <CitySearch
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          isLoading={cityLoading}
        />
      )}

      <ViewSwitcher
        data={paginated}
        allFilteredData={filteredAndSortedRows}
        selectedBusinesses={Array.from(selectedKeys)
          .map((id) => selectedRows[id])
          .filter(Boolean)}
        geojson={filteredGeoJSON}
        viewMode={viewMode}
        setViewMode={setViewMode}
        columns={visibleColumns}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isFetching || cityLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
      />
    </div>
  );
}
```

### 1.4. Error Page (`client/app/error.tsx`)

**Current Issues:**
- Basic error handling
- No detailed error information
- No error reporting

**Recommendations:**
- Implement a more robust error handling strategy
- Add detailed error information
- Implement error reporting to a service like Sentry
- Add better UI for error states

```typescript
// Example implementation for error page
'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

interface CustomErrorProps {
  error: Error;
  reset: () => void;
}

/**
 * Displays a fallback UI when an error occurs in the app.
 *
 * @component
 * @param {CustomErrorProps} props - The error object and reset function
 */
export default function CustomError({ error, reset }: CustomErrorProps) {
  useEffect(() => {
    // Log error to console or send to error reporting service
    console.error(error);
    
    // Example: Send to error reporting service
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong!</h2>
        <p className="text-default-600 mb-4">{error.message}</p>
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => reset()}
            color="primary"
            variant="solid"
            className="w-full"
          >
            Try again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            color="default"
            variant="bordered"
            className="w-full"
          >
            Go to homepage
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

## 2. Features Directory Structure Optimization

### 2.1. Dashboard Feature Structure

**Current Issues:**
- Inconsistent file organization
- Duplicate type definitions
- Inefficient data fetching
- Complex component structure

**Recommendations:**
- Reorganize the dashboard feature structure for better maintainability
- Consolidate type definitions
- Implement a more efficient data fetching strategy
- Simplify component structure

```
client/features/dashboard/
├── components/
│   ├── analytics/
│   │   ├── cards/
│   │   ├── charts/
│   │   ├── selection/
│   │   ├── utils/
│   │   ├── AnalyticsView.tsx
│   │   ├── index.ts
│   │   └── types.ts
│   ├── map/
│   │   ├── MapView.tsx
│   │   └── index.ts
│   ├── table/
│   │   ├── TableView.tsx
│   │   └── index.ts
│   ├── controls/
│   │   ├── ViewModeToggle/
│   │   ├── CitySearch/
│   │   └── index.ts
│   └── ViewSwitcher/
│       ├── ViewSwitcher.tsx
│       └── index.ts
├── hooks/
│   ├── analytics/
│   │   ├── useAnalytics.ts
│   │   └── index.ts
│   ├── data/
│   │   ├── useDashboardData.ts
│   │   └── index.ts
│   └── index.ts
├── store/
│   ├── companyStore.ts
│   └── index.ts
├── types/
│   ├── analytics.ts
│   ├── business.ts
│   ├── filters.ts
│   ├── table.ts
│   ├── view.ts
│   └── index.ts
├── utils/
│   ├── geo.ts
│   ├── table.ts
│   └── index.ts
└── index.ts
```

### 2.2. Analytics View Optimization

**Current Issues:**
- Type conflicts between local and imported types
- Inefficient data transformation
- Complex component structure
- Redundant code

**Recommendations:**
- Consolidate type definitions to avoid conflicts
- Implement more efficient data transformation
- Simplify component structure
- Remove redundant code

```typescript
// Example implementation for AnalyticsView types
// client/features/dashboard/components/analytics/types.ts

import type { Error } from '@/shared/types';

/**
 * Raw data structure for distribution items
 */
export interface DistributionItemRaw {
  name: string;
  value: number;
  others_breakdown?: Array<{ name: string; value: number }>;
}

/**
 * Transformed distribution data
 */
export interface TransformedDistribution {
  name: string;
  value: number;
  percentage: number;
}

/**
 * Transformed industries by city data
 */
export interface TransformedIndustriesByCity {
  city: string;
  industries: {
    industry: string;
    count: number;
  }[];
}

/**
 * Transformed city comparison data
 */
export interface TransformedCityComparison {
  industry: string;
  cities: {
    city: string;
    count: number;
  }[];
}

/**
 * Top city data structure
 */
export interface TopCityData {
  city: string;
  count: number;
  companyCount: number;
  industryCount: number;
  averageCompaniesPerIndustry: number;
}

/**
 * Props for IndustryDistributionCard
 */
export interface IndustryDistributionCardProps {
  data: TransformedDistribution[];
  currentTheme: 'light' | 'dark' | undefined;
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  potentialOthers: string[];
  industryNameMap: Map<string, string>;
  isLoading: boolean;
  error: Error | null;
  selectedIndustryDisplayNames: Set<string>;
  getThemedIndustryColor: (industry: string) => string;
  selectedCities: string[];
  pieChartFocusCity: string | null;
  onPieFocusChange: (city: string | null) => void;
}

/**
 * Props for IndustriesByCityCard
 */
export interface IndustriesByCityCardProps {
  data: TransformedIndustriesByCity[];
  currentTheme: 'light' | 'dark' | undefined;
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  potentialOthers: string[];
  getThemedIndustryColor: (industry: string) => string;
  isLoading: boolean;
  error: Error | null;
  selectedIndustryDisplayNames: Set<string>;
  canFetchMultiCity: boolean;
}

/**
 * Props for CityComparisonCard
 */
export interface CityComparisonCardProps {
  data: TransformedCityComparison[];
  currentTheme: 'light' | 'dark' | undefined;
  selectedIndustryDisplayNames: Set<string>;
  canFetchMultiCity: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Props for TopCitiesCard
 */
export interface TopCitiesCardProps {
  data: TopCityData[];
  currentTheme: 'light' | 'dark' | undefined;
  isLoading: boolean;
  error: Error | null;
}
```

### 2.3. Hooks Optimization

**Current Issues:**
- Inconsistent hook naming
- Duplicate type definitions
- Inefficient data fetching
- Lack of error handling

**Recommendations:**
- Standardize hook naming
- Consolidate type definitions
- Implement more efficient data fetching
- Add better error handling

```typescript
// Example implementation for useAnalytics hook
// client/features/dashboard/hooks/analytics/useAnalytics.ts

import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { createQueryKey, useApiQuery } from '@/shared/hooks/useApi';
import type { 
  DistributionDataRaw, 
  TopCityData 
} from '@/features/dashboard/components/analytics/types';

/**
 * Hook for fetching top cities data
 * @param limit - Maximum number of cities to fetch
 * @returns Query result with top cities data
 */
export const useTopCities = (limit = 10) => {
  return useApiQuery<TopCityData[]>(
    createQueryKey('top-cities', { limit }),
    `${API_ENDPOINTS.ANALYTICS.TOP_CITIES}?limit=${limit}`,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

/**
 * Hook for fetching industry distribution data
 * @param cities - List of cities to filter by
 * @returns Query result with industry distribution data
 */
export const useIndustryDistribution = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<DistributionDataRaw>(
    createQueryKey('industry-distribution', { cities }),
    `${API_ENDPOINTS.ANALYTICS.INDUSTRY_DISTRIBUTION}?cities=${encodeURIComponent(citiesParam)}`,
    {
      enabled: cities.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

/**
 * Hook for fetching industries by city data
 * @param cities - List of cities to filter by
 * @returns Query result with industries by city data
 */
export const useIndustriesByCity = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<DistributionDataRaw>(
    createQueryKey('industries-by-city', { cities }),
    `${API_ENDPOINTS.ANALYTICS.INDUSTRIES_BY_CITY}?cities=${encodeURIComponent(citiesParam)}`,
    {
      enabled: cities.length > 0 && cities.length <= 5,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

/**
 * Hook for fetching city comparison data
 * @param cities - List of cities to filter by
 * @returns Query result with city comparison data
 */
export const useCityComparison = (cities: string[]) => {
  const citiesParam = cities.join(',');
  return useApiQuery<DistributionDataRaw>(
    createQueryKey('city-comparison', { cities }),
    `${API_ENDPOINTS.ANALYTICS.CITY_COMPARISON}?cities=${encodeURIComponent(citiesParam)}`,
    {
      enabled: cities.length > 0 && cities.length <= 5,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};
```

## 3. Data Fetching and State Management Optimization

### 3.1. API Query Optimization

**Current Issues:**
- Inefficient caching strategy
- Lack of error handling
- No retry mechanism
- No prefetching

**Recommendations:**
- Implement a more efficient caching strategy
- Add better error handling
- Implement a retry mechanism
- Add prefetching for better user experience

```typescript
// Example implementation for useApiQuery hook
// client/shared/hooks/useApi.ts

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

/**
 * Creates a query key for caching
 * @param key - Base key for the query
 * @param params - Parameters to include in the key
 * @returns Query key for caching
 */
export const createQueryKey = (key: string, params?: Record<string, any>) => {
  return params ? [key, params] : [key];
};

/**
 * Custom hook for API queries with better caching and error handling
 * @param queryKey - Query key for caching
 * @param url - API URL
 * @param options - Query options
 * @returns Query result
 */
export const useApiQuery = <T>(
  queryKey: string | any[],
  url: string,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
```

### 3.2. State Management Optimization

**Current Issues:**
- Inconsistent state management
- Redundant state
- Complex state updates
- No persistence

**Recommendations:**
- Implement a more consistent state management strategy
- Remove redundant state
- Simplify state updates
- Add persistence for better user experience

```typescript
// Example implementation for company store
// client/features/dashboard/store/companyStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompanyProperties } from '@/features/dashboard/types/business';

interface CompanyState {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedIndustries: string[];
  setSelectedIndustries: (industries: string[]) => void;
  selectedKeys: Set<string>;
  setSelectedKeys: (keys: Set<string>) => void;
  selectedRows: Record<string, CompanyProperties>;
  setSelectedRows: (rows: Record<string, CompanyProperties>) => void;
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  distanceLimit: number;
  setDistanceLimit: (limit: number) => void;
  reset: () => void;
}

const initialState = {
  selectedCity: '',
  selectedIndustries: [],
  selectedKeys: new Set<string>(),
  selectedRows: {},
  userLocation: null,
  distanceLimit: 10,
};

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedCity: (city) => set({ selectedCity: city }),
      setSelectedIndustries: (industries) => set({ selectedIndustries: industries }),
      setSelectedKeys: (keys) => set({ selectedKeys: keys }),
      setSelectedRows: (rows) => set({ selectedRows: rows }),
      setUserLocation: (location) => set({ userLocation: location }),
      setDistanceLimit: (limit) => set({ distanceLimit: limit }),
      reset: () => set(initialState),
    }),
    {
      name: 'company-storage',
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        selectedIndustries: state.selectedIndustries,
        distanceLimit: state.distanceLimit,
      }),
    }
  )
);
```

## 4. Performance Optimization

### 4.1. Component Rendering Optimization

**Current Issues:**
- Unnecessary re-renders
- Large component trees
- Inefficient memoization
- No code splitting

**Recommendations:**
- Implement React.memo for components that don't need to re-render
- Split large component trees into smaller components
- Use useMemo and useCallback more effectively
- Implement code splitting for better performance

```typescript
// Example implementation for optimized component
// client/features/dashboard/components/analytics/cards/IndustryDistributionCard.tsx

import React, { useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';
import { IndustryDistributionChart } from '../charts/IndustryDistributionChart';
import type { IndustryDistributionCardProps } from '../types';

export const IndustryDistributionCard: React.FC<IndustryDistributionCardProps> = React.memo(
  ({
    data,
    currentTheme,
    getIndustryKeyFromName,
    potentialOthers,
    industryNameMap,
    isLoading,
    error,
    selectedIndustryDisplayNames,
    getThemedIndustryColor,
    selectedCities,
    pieChartFocusCity,
    onPieFocusChange,
  }) => {
    // Memoize chart data to prevent unnecessary re-renders
    const chartData = useMemo(() => {
      return data.map((item) => ({
        name: item.name,
        value: item.value,
        percentage: item.percentage,
        color: getThemedIndustryColor(item.name),
      }));
    }, [data, getThemedIndustryColor]);

    if (isLoading) {
      return (
        <Card className="w-full h-full">
          <CardBody className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="w-full h-full">
          <CardBody className="flex items-center justify-center h-64 text-red-500">
            <p>Error loading data: {error.message}</p>
          </CardBody>
        </Card>
      );
    }

    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Industry Distribution</h3>
          <p className="text-sm text-default-500">
            {selectedCities.length > 0
              ? `Showing data for ${selectedCities.length} selected cities`
              : 'Showing data for all cities'}
          </p>
        </CardHeader>
        <CardBody>
          <IndustryDistributionChart
            data={chartData}
            currentTheme={currentTheme}
            selectedIndustryDisplayNames={selectedIndustryDisplayNames}
            pieChartFocusCity={pieChartFocusCity}
            onPieFocusChange={onPieFocusChange}
          />
        </CardBody>
      </Card>
    );
  }
);

IndustryDistributionCard.displayName = 'IndustryDistributionCard';
```

### 4.2. Data Processing Optimization

**Current Issues:**
- Inefficient data transformation
- Redundant calculations
- No memoization
- Large data sets

**Recommendations:**
- Implement more efficient data transformation
- Remove redundant calculations
- Use memoization for expensive calculations
- Implement pagination or virtualization for large data sets

```typescript
// Example implementation for optimized data processing
// client/features/dashboard/utils/data.ts

import { useMemo } from 'react';
import type { DistributionItemRaw } from '@/features/dashboard/components/analytics/types';

/**
 * Transforms raw distribution data into a format suitable for charts
 * @param data - Raw distribution data
 * @param total - Total count for percentage calculation
 * @returns Transformed distribution data
 */
export const transformDistributionData = (
  data: DistributionItemRaw[],
  total: number
) => {
  return data.map((item) => ({
    name: item.name,
    value: item.value,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }));
};

/**
 * Hook for transforming distribution data with memoization
 * @param data - Raw distribution data
 * @returns Transformed distribution data
 */
export const useTransformedDistributionData = (data: DistributionItemRaw[] | undefined) => {
  return useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return transformDistributionData(data, total);
  }, [data]);
};
```

## 5. Testing and Quality Assurance

### 5.1. Unit Testing

**Current Issues:**
- Lack of unit tests
- No test coverage
- No test automation
- No continuous integration

**Recommendations:**
- Implement unit tests for components and utilities
- Add test coverage reporting
- Set up test automation
- Implement continuous integration

```typescript
// Example implementation for unit test
// client/features/dashboard/components/analytics/__tests__/utils.test.ts

import { transformDistributionData } from '../../utils/data';
import type { DistributionItemRaw } from '../../types';

describe('transformDistributionData', () => {
  it('should transform distribution data correctly', () => {
    const mockData: DistributionItemRaw[] = [
      { name: 'Industry A', value: 100 },
      { name: 'Industry B', value: 200 },
      { name: 'Industry C', value: 300 },
    ];
    
    const result = transformDistributionData(mockData, 600);
    
    expect(result).toEqual([
      { name: 'Industry A', value: 100, percentage: 16.666666666666664 },
      { name: 'Industry B', value: 200, percentage: 33.33333333333333 },
      { name: 'Industry C', value: 300, percentage: 50 },
    ]);
  });
  
  it('should handle empty data', () => {
    const result = transformDistributionData([], 0);
    expect(result).toEqual([]);
  });
  
  it('should handle zero total', () => {
    const mockData: DistributionItemRaw[] = [
      { name: 'Industry A', value: 100 },
      { name: 'Industry B', value: 200 },
    ];
    
    const result = transformDistributionData(mockData, 0);
    
    expect(result).toEqual([
      { name: 'Industry A', value: 100, percentage: 0 },
      { name: 'Industry B', value: 200, percentage: 0 },
    ]);
  });
});
```

### 5.2. Integration Testing

**Current Issues:**
- Lack of integration tests
- No end-to-end testing
- No performance testing
- No accessibility testing

**Recommendations:**
- Implement integration tests for components
- Add end-to-end testing
- Implement performance testing
- Add accessibility testing

```typescript
// Example implementation for integration test
// client/features/dashboard/components/analytics/__tests__/AnalyticsView.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnalyticsView } from '../AnalyticsView';
import { useTopCities, useIndustryDistribution, useIndustriesByCity, useCityComparison } from '@/features/dashboard/hooks/analytics';

// Mock hooks
jest.mock('@/features/dashboard/hooks/analytics', () => ({
  useTopCities: jest.fn(),
  useIndustryDistribution: jest.fn(),
  useIndustriesByCity: jest.fn(),
  useCityComparison: jest.fn(),
}));

describe('AnalyticsView', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock hook implementations
    (useTopCities as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });
    
    (useIndustryDistribution as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });
    
    (useIndustriesByCity as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });
    
    (useCityComparison as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });
  });
  
  it('should render without crashing', () => {
    render(<AnalyticsView />);
    expect(screen.getByText('Industry Distribution')).toBeInTheDocument();
  });
  
  it('should show loading state', () => {
    (useIndustryDistribution as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    
    render(<AnalyticsView />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('should show error state', () => {
    (useIndustryDistribution as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load data'),
    });
    
    render(<AnalyticsView />);
    expect(screen.getByText('Error Loading Industry Distribution')).toBeInTheDocument();
  });
});
```

## 6. Documentation and Code Quality

### 6.1. Code Documentation

**Current Issues:**
- Inconsistent documentation
- Missing JSDoc comments
- No API documentation
- No component documentation

**Recommendations:**
- Implement consistent documentation
- Add JSDoc comments to all functions and components
- Create API documentation
- Add component documentation

```typescript
// Example implementation for documented component
// client/features/dashboard/components/analytics/AnalyticsView.tsx

/**
 * AnalyticsView Component
 * 
 * Displays analytics data for selected cities and industries.
 * 
 * @component
 * @example
 * ```tsx
 * <AnalyticsView />
 * ```
 */
export const AnalyticsView: React.FC = () => {
  // Component implementation
};
```

### 6.2. Code Quality

**Current Issues:**
- Inconsistent code style
- No linting
- No type checking
- No code formatting

**Recommendations:**
- Implement consistent code style
- Add linting with ESLint
- Add type checking with TypeScript
- Add code formatting with Prettier

```json
// Example implementation for ESLint configuration
// .eslintrc.json

{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

```json
// Example implementation for Prettier configuration
// .prettierrc

{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## 7. Accessibility and User Experience

### 7.1. Accessibility

**Current Issues:**
- Lack of accessibility features
- No keyboard navigation
- No screen reader support
- No color contrast

**Recommendations:**
- Implement accessibility features
- Add keyboard navigation
- Add screen reader support
- Improve color contrast

```typescript
// Example implementation for accessible component
// client/features/dashboard/components/analytics/cards/IndustryDistributionCard.tsx

import React, { useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';
import { IndustryDistributionChart } from '../charts/IndustryDistributionChart';
import type { IndustryDistributionCardProps } from '../types';

export const IndustryDistributionCard: React.FC<IndustryDistributionCardProps> = React.memo(
  ({
    data,
    currentTheme,
    getIndustryKeyFromName,
    potentialOthers,
    industryNameMap,
    isLoading,
    error,
    selectedIndustryDisplayNames,
    getThemedIndustryColor,
    selectedCities,
    pieChartFocusCity,
    onPieFocusChange,
  }) => {
    // Memoize chart data to prevent unnecessary re-renders
    const chartData = useMemo(() => {
      return data.map((item) => ({
        name: item.name,
        value: item.value,
        percentage: item.percentage,
        color: getThemedIndustryColor(item.name),
      }));
    }, [data, getThemedIndustryColor]);

    if (isLoading) {
      return (
        <Card className="w-full h-full">
          <CardBody className="flex items-center justify-center h-64">
            <Spinner size="lg" aria-label="Loading industry distribution data" />
          </CardBody>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="w-full h-full">
          <CardBody className="flex items-center justify-center h-64 text-red-500">
            <p role="alert">Error loading data: {error.message}</p>
          </CardBody>
        </Card>
      );
    }

    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Industry Distribution</h3>
          <p className="text-sm text-default-500">
            {selectedCities.length > 0
              ? `Showing data for ${selectedCities.length} selected cities`
              : 'Showing data for all cities'}
          </p>
        </CardHeader>
        <CardBody>
          <IndustryDistributionChart
            data={chartData}
            currentTheme={currentTheme}
            selectedIndustryDisplayNames={selectedIndustryDisplayNames}
            pieChartFocusCity={pieChartFocusCity}
            onPieFocusChange={onPieFocusChange}
            aria-label="Industry distribution chart"
          />
        </CardBody>
      </Card>
    );
  }
);

IndustryDistributionCard.displayName = 'IndustryDistributionCard';
```

### 7.2. User Experience

**Current Issues:**
- Inconsistent UI
- No loading states
- No error states
- No feedback

**Recommendations:**
- Implement consistent UI
- Add loading states
- Add error states
- Add user feedback

```typescript
// Example implementation for user feedback
// client/features/dashboard/components/controls/CitySearch.tsx

import React, { useState } from 'react';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Toast } from '@/shared/components/ui/Toast';

interface CitySearchProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  isLoading: boolean;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  cities,
  selectedCity,
  onCityChange,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredCities = cities
    .filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((city) => ({ name: city }));

  const handleCityChange = (city: string) => {
    onCityChange(city);
    setToastMessage(`Selected city: ${city}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="relative">
      <Autocomplete
        classNames={{ base: 'md:max-w-xs max-w-[30vw] min-w-[200px]' }}
        popoverProps={{ classNames: { content: 'max-w-[40vw] md:max-w-xs' } }}
        items={filteredCities}
        label="Search by city"
        variant="underlined"
        selectedKey={selectedCity}
        onInputChange={setSearchQuery}
        onSelectionChange={(selected) => {
          if (typeof selected === 'string') {
            handleCityChange(selected);
          }
        }}
        isLoading={isLoading}
        endContent={isLoading ? <Spinner size="sm" /> : null}
      >
        {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
      </Autocomplete>

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
          className="absolute bottom-0 right-0"
        />
      )}
    </div>
  );
};
```

## 8. Deployment and CI/CD

### 8.1. Build Optimization

**Current Issues:**
- Large bundle size
- Slow build times
- No code splitting
- No tree shaking

**Recommendations:**
- Implement code splitting
- Add tree shaking
- Optimize build times
- Reduce bundle size

```javascript
// Example implementation for Next.js configuration
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### 8.2. CI/CD Pipeline

**Current Issues:**
- No continuous integration
- No continuous deployment
- No automated testing
- No quality checks

**Recommendations:**
- Implement continuous integration
- Add continuous deployment
- Add automated testing
- Add quality checks

```yaml
# Example implementation for GitHub Actions workflow
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Test
      run: npm run test
    
    - name: Build
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build
        path: .next
```

## 9. Conclusion

This comprehensive refactoring and optimization guide provides a roadmap for improving the codebase, enhancing performance, and ensuring better maintainability. By following these recommendations, the application will be more robust, performant, and user-friendly.

The guide covers:
1. App folder structure optimization
2. Features directory structure optimization
3. Data fetching and state management optimization
4. Performance optimization
5. Testing and quality assurance
6. Documentation and code quality
7. Accessibility and user experience
8. Deployment and CI/CD

Implementing these changes will result in a more maintainable, performant, and user-friendly application. 