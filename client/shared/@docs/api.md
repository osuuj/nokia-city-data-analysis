# Shared API

This file provides documentation for the API utilities in the `client/shared/api` directory.

## Directory Structure

```
api/
├── client.ts       # API client setup 
├── endpoints.ts    # API endpoint constants
├── errors.ts       # Error handling utilities
├── types.ts        # TypeScript types for API
└── index.ts        # Main export file
```

## API Endpoints

The `endpoints.ts` file exports constants for all API endpoints used in the application:

```typescript
export const API_ENDPOINTS = {
  // Base endpoints
  BASE: '/api/v1',
  
  // Data endpoints
  CITIES: '/api/v1/cities',
  COMPANIES: '/api/v1/companies',
  INDUSTRIES: '/api/v1/industries',
  
  // Statistics endpoints
  STATS: '/api/v1/statistics',
}
```

## Making API Calls

The recommended way to make API calls is through the hooks provided in the `hooks/api` directory:

```typescript
import { useApiQuery, useApiMutation } from '@/shared/hooks';

// Query example
function CityList() {
  const { data, isLoading, error } = useApiQuery('cities', API_ENDPOINTS.CITIES);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <DataList data={data} />;
}

// Mutation example
function CreateCompany() {
  const { mutate, isLoading } = useApiMutation(API_ENDPOINTS.COMPANIES);
  
  const handleSubmit = (formData) => {
    mutate(formData, {
      onSuccess: () => {
        toast.success('Company created!');
      }
    });
  };
  
  return <CompanyForm onSubmit={handleSubmit} isSubmitting={isLoading} />;
}
```

## Response Types

The API types are defined in `types.ts`:

```typescript
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}
```

## Error Handling

The API utilities include error handling to standardize error responses:

```typescript
import { handleApiError } from '@/shared/api';

try {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw await handleApiError(response);
  }
  return await response.json();
} catch (error) {
  console.error('API Error:', error.message);
  throw error;
}
```

## Best Practices

1. **Use Typed Requests and Responses**
   - Always specify types for API requests and responses
   - Use the provided ApiResponse and ApiError types

2. **Centralize Endpoints**
   - Add all API endpoints to the API_ENDPOINTS object
   - Use the constants instead of hardcoding URLs

3. **Error Handling**
   - Use the provided error handling utilities
   - Display user-friendly error messages

4. **Caching**
   - Use the caching capabilities of React Query
   - Set appropriate stale times for different data types

5. **Authentication**
   - Handle authentication headers consistently
   - Use interceptors for adding auth tokens 