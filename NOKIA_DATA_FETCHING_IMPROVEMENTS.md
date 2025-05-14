# Nokia Data Fetching Improvement Plan

This document outlines the step-by-step improvements we'll make to Nokia's data fetching implementation while preserving its memory efficiency.

## Overview

Nokia's implementation is already memory-efficient but lacks some standardization. We'll make targeted improvements without adding unnecessary complexity or abstractions that could impact performance.

## Files Involved in Data Fetching

The following files are involved in data fetching and will be modified:

1. **Main Data Fetching Hooks:**
   - `client/features/dashboard/hooks/useCompaniesQuery.ts` - Core hook for fetching company data
   - `client/features/dashboard/hooks/useCitySearch.ts` - Hook for city search functionality

2. **Components Using Data Fetching:**
   - `client/features/dashboard/components/common/DashboardPage.tsx` - Dashboard page using the data
   - `client/shared/components/layout/Header.tsx` - Header component with data fetching

3. **Shared Utilities:**
   - `client/shared/utils/api.ts` - If present, may contain API utilities
   - `client/shared/hooks/useApi.ts` - If present, may have API hooks

4. **Other Data Fetching Hooks:**
   - `client/features/dashboard/hooks/useFilteredBusinesses.ts` - Handles filtered business data
   - `client/features/dashboard/hooks/useDashboardPagination.ts` - Handles pagination

## Step 1: Create API Endpoint Configuration

**Action:** Create a centralized API endpoint configuration file.

**File:** `client/shared/config/api-endpoints.ts`

```typescript
/**
 * API Endpoints Configuration
 * Centralizes all API endpoints as constants for consistency
 */
export const API_ENDPOINTS = {
  COMPANIES: '/companies.geojson',
  CITIES: '/cities',
  BUSINESSES_BY_CITY: '/companies/businesses_by_city',
  BUSINESSES_BY_INDUSTRY: '/companies/businesses_by_industry',
  INDUSTRIES: '/companies/industries'
};

export default API_ENDPOINTS;
```

**Benefits:**
- Prevents typos in endpoints
- Makes it easier to update endpoints in one place
- Improves code readability

## Step 2: Add API Error Types

**Action:** Create standardized API error types.

**File:** `client/shared/types/api-error.ts`

```typescript
/**
 * API Error Types
 * Standardizes error handling across the application
 */
export enum ApiErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

export interface ApiError {
  type: ApiErrorType;
  status?: number;
  message: string;
  data?: Record<string, unknown>;
}
```

**Benefits:**
- Consistent error handling across the application
- Better developer experience when working with errors
- More informative error messages for users

## Step 3: Enhance useCompaniesQuery.ts

**Action:** Update Nokia's company query hook to use the new constants and improve error handling.

**File:** `client/features/dashboard/hooks/useCompaniesQuery.ts`

```typescript
// Add at top of file
import { API_ENDPOINTS } from '@/shared/config/api-endpoints';
import { ApiError, ApiErrorType } from '@/shared/types/api-error';
```

```typescript
// Update in fetchCompanies function
const apiUrl = `${BASE_URL}${API_ENDPOINTS.COMPANIES}?city=${encodeURIComponent(city)}`;

// Update in fetchCities function
const apiUrl = `${BASE_URL}${API_ENDPOINTS.CITIES}`;
```

```typescript
// Update error handling in catch blocks
if (!response.ok) {
  const errorType = response.status >= 500 ? ApiErrorType.SERVER : 
                   response.status === 404 ? ApiErrorType.NOT_FOUND :
                   response.status === 401 ? ApiErrorType.UNAUTHORIZED :
                   response.status === 422 ? ApiErrorType.VALIDATION :
                   ApiErrorType.UNKNOWN;
                   
  throw {
    type: errorType,
    status: response.status,
    message: `Failed to fetch: ${response.statusText}`
  } as ApiError;
}
```

**Current implementation:**
The file has two main fetching functions:
- `fetchCompanies` for retrieving company data by city
- `fetchCities` for retrieving available cities
- Custom error handling with direct string messages
- Basic React Query configuration

**Changes needed:**
1. Update imports to use new centralized APIs and error types
2. Replace hardcoded endpoints with API_ENDPOINTS constants
3. Implement structured error handling with ApiErrorType
4. Add TypeScript return type annotations

**Benefits:**
- More consistent and readable API calls
- Better error handling with specific error types
- No impact on memory efficiency

## Step 4: Add Query Cleanup

**Action:** Add explicit cleanup for large dataset queries in components.

**File:** `client/features/dashboard/components/common/DashboardPage.tsx`

```typescript
// Add at top with other imports
import { useQueryClient } from '@tanstack/react-query';

// Add inside component
const queryClient = useQueryClient();

// Add to useEffect cleanup
useEffect(() => {
  // Existing effect code...
  
  return () => {
    // Existing cleanup code...
    
    // Add this for query cleanup
    if (selectedCity) {
      queryClient.removeQueries(['companies', selectedCity]);
    }
  };
}, [queryClient, selectedCity]);
```

**Current implementation:**
- Component uses data from useCompaniesQuery
- No explicit cleanup of query cache
- Potential memory leaks with large datasets

**Changes needed:**
1. Import useQueryClient
2. Add query cleanup in component unmount effects
3. Target specific queries to avoid clearing unrelated cache

**Additional files that need similar updates:**
- `client/features/dashboard/components/views/MapView.tsx` (if exists)
- `client/features/dashboard/components/views/TableView.tsx` (if exists)

**Benefits:**
- Prevents memory leaks from cached large datasets
- Ensures proper cleanup when components unmount
- Helps manage memory footprint

## Step 5: Implement Pagination Parameters

**Action:** Update fetch functions to support pagination and filtering.

**File:** `client/features/dashboard/hooks/useCompaniesQuery.ts`

```typescript
// Update fetchCompanies function signature
const fetchCompanies = async (
  city: string, 
  page = 1, 
  limit = 100
): Promise<CompanyProperties[]> => {
  if (!city) {
    logger.warn('City is empty, skipping fetch.');
    return [];
  }

  // Add pagination parameters to URL
  const apiUrl = `${BASE_URL}${API_ENDPOINTS.COMPANIES}?city=${encodeURIComponent(city)}&page=${page}&limit=${limit}`;
  
  // Rest of the function remains the same
}

// Update useFetchCompanies to support pagination
export function useFetchCompanies(
  city: string,
  page = 1,
  limit = 100
) {
  return useQuery<CompanyProperties[], Error>({
    queryKey: ['companies', city, page, limit],
    queryFn: () => fetchCompanies(city, page, limit),
    enabled: !!city,
    // Keep existing configuration
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    // ...
  });
}
```

**Current implementation:**
- Fetches all companies for a city in one request
- No pagination support, potentially large data loads
- Simple query keys without pagination parameters

**Changes needed:**
1. Add pagination parameters to function signatures
2. Update query keys to include pagination values
3. Add pagination parameters to API URLs
4. Update components using these hooks to handle pagination

**Related files to update:**
- `client/features/dashboard/hooks/useDashboardPagination.ts` - To work with paginated API calls
- `client/features/dashboard/components/views/TableView.tsx` (if exists) - To use pagination parameters

**Benefits:**
- Reduces memory usage by limiting data size
- Improves performance with large datasets
- Enables more efficient data loading

## Step 6: Improve Type Definitions

**Action:** Add better type annotations to Nokia's implementation.

**File:** `client/features/dashboard/types/business.ts`

```typescript
// Keep existing types, ensure they are complete and well-documented

// Add explicit return types to functions in useCompaniesQuery.ts
export function useFetchCompanies(
  city: string,
  page?: number,
  limit?: number
): UseQueryResult<CompanyProperties[], ApiError> {
  // Implementation remains the same
}
```

**Current implementation:**
- Basic types for company data
- Incomplete return type annotations
- Lack of explicit error types in query results

**Changes needed:**
1. Update business type definitions to be more comprehensive
2. Add explicit return types to all query hooks
3. Update error type references to use new ApiError type
4. Ensure all function parameters have proper typing

**Files to update:**
- `client/features/dashboard/types/business.ts` - Main type definitions
- `client/features/dashboard/hooks/useCompaniesQuery.ts` - For function return types
- Any other files importing and using these types

**Benefits:**
- Better IDE support and auto-completion
- Catches type errors at compile time
- Improves code documentation

## Step 7: Add JSDoc Comments

**Action:** Add better documentation to key functions.

**File:** Various files including `useCompaniesQuery.ts`

```typescript
/**
 * Fetches company data for the specified city
 * 
 * @param city - The city name to filter companies by
 * @param page - Page number for pagination (1-based)
 * @param limit - Number of records per page
 * @returns Promise resolving to an array of company properties
 */
const fetchCompanies = async (
  city: string,
  page = 1,
  limit = 100
): Promise<CompanyProperties[]> => {
  // Implementation
}
```

**Current implementation:**
- Limited or inconsistent function documentation
- Missing parameter and return type documentation
- Insufficient explanation of function behavior

**Files that need JSDoc comments:**
- `client/features/dashboard/hooks/useCompaniesQuery.ts` - Core data fetching functions
- `client/features/dashboard/hooks/useCitySearch.ts` - City search related functions
- `client/shared/hooks/useApi.ts` (if exists) - Shared API functions
- Any other files with data fetching logic

**Benefits:**
- Better documentation for developers
- Improved IDE tooltips and hints
- Easier onboarding for new team members

## Success Criteria

- No increase in memory usage compared to Nokia's implementation
- Successful fetching of company and city data
- Proper error handling for various failure scenarios
- Clean memory usage when components unmount
- Improved code readability and maintainability 