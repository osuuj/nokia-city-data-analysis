# API Client and Utilities

This directory contains the API client implementation and related utilities for making HTTP requests.

## Directory Structure

```
api/
├── client/           # API client implementation
│   ├── ApiClient.ts
│   └── index.ts
├── types/           # API type definitions
│   ├── ApiTypes.ts
│   └── index.ts
├── endpoints/       # API endpoint configurations
│   ├── ApiEndpoints.ts
│   └── index.ts
├── errors/         # API error handling
│   ├── ApiErrors.ts
│   └── index.ts
└── index.ts        # Main export file
```

## API Client

The API client provides a type-safe way to make HTTP requests with proper error handling and retry logic.

```typescript
import apiClient from '@shared/api';

// GET request
const response = await apiClient.get('/users');

// POST request
const response = await apiClient.post('/users', { name: 'John' });

// PUT request
const response = await apiClient.put('/users/1', { name: 'John' });

// DELETE request
const response = await apiClient.delete('/users/1');
```

## Type Definitions

### Request Configuration

```typescript
interface ApiRequestConfig {
  params?: Record<string, string>;
  headers?: Record<string, string>;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}
```

### Response Type

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

## Error Handling

The API client includes built-in error handling with custom error classes:

```typescript
import { ApiError, NetworkError, ValidationError } from '@shared/api';

try {
  await apiClient.get('/users');
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network errors
  } else if (error instanceof ValidationError) {
    // Handle validation errors
  } else {
    // Handle other errors
  }
}
```

## Endpoint Configuration

API endpoints are configured with constants for base URL, timeouts, and retry settings:

```typescript
import { API_BASE_URL, API_TIMEOUT, API_RETRY_COUNT } from '@shared/api';

// Available constants
API_BASE_URL    // Base URL for API requests
API_TIMEOUT     // Request timeout in milliseconds
API_RETRY_COUNT // Number of retry attempts
API_RETRY_DELAY // Delay between retries in milliseconds
```

## Best Practices

1. **Error Handling**
   - Always use try/catch blocks with API calls
   - Handle specific error types appropriately
   - Provide meaningful error messages to users

2. **Type Safety**
   - Define proper types for request and response data
   - Use TypeScript generics for type-safe API calls
   - Avoid using `any` type

3. **Configuration**
   - Use environment variables for API configuration
   - Set appropriate timeouts and retry counts
   - Configure proper error handling strategies

4. **Performance**
   - Implement proper caching strategies
   - Use appropriate HTTP methods
   - Handle request cancellation

## Contributing

When adding new API functionality:
1. Place files in the appropriate subdirectory
2. Update the index.ts file to export new functionality
3. Add proper TypeScript types
4. Include JSDoc documentation
5. Add usage examples to this README 