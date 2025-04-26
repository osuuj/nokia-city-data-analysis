# API Feature

This feature provides a robust API client implementation for making HTTP requests in the application.

## Directory Structure

```
api/
├── client/
│   ├── ApiClient.ts     # Main API client implementation
│   └── index.ts         # Exports
├── types/
│   ├── ApiTypes.ts      # Type definitions for API requests and responses
│   └── index.ts         # Type exports
├── utils/
│   ├── ApiUtils.ts      # Utility functions for API operations
│   └── index.ts         # Utility exports
└── README.md            # This file
```

## Features

- Strongly typed API client with TypeScript
- Support for all major HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Request state management
- Caching mechanism
- Rate limiting handling
- Request cancellation
- Error handling
- Retry mechanism
- Request timeout handling

## Usage

```typescript
import { ApiClientImpl } from '@features/api';

const apiClient = new ApiClientImpl({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  retryCount: 3,
  retryDelay: 1000
});

// Making a GET request
const response = await apiClient.get<ResponseType>('/endpoint', {
  params: { key: 'value' },
  cache: 'force-cache'
});

// Making a POST request
const response = await apiClient.post<ResponseType>('/endpoint', {
  body: { data: 'value' }
});

// Canceling requests
apiClient.cancelRequests();

// Clearing cache
apiClient.clearCache();
```

## Configuration

The API client can be configured with the following options:

- `baseUrl`: Base URL for all API requests
- `headers`: Default headers to include in all requests
- `timeout`: Request timeout in milliseconds
- `retryCount`: Number of retry attempts for failed requests
- `retryDelay`: Delay between retry attempts in milliseconds
- `cache`: Default caching strategy

## Error Handling

The API client includes comprehensive error handling:

- Network errors
- Timeout errors
- Rate limit errors
- Server errors (4xx, 5xx)
- Request cancellation

## Best Practices

1. Always type your request and response data
2. Use appropriate caching strategies
3. Handle errors gracefully
4. Cancel pending requests when components unmount
5. Monitor rate limits
6. Use request states for loading indicators
7. Implement retry strategies for critical requests 