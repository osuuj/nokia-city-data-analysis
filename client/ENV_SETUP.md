# Client Environment Setup

This document describes how to configure the Next.js client application to work with both local development and production AWS-hosted FastAPI backends.

## Environment Configuration Files

### Local Development

Create a `.env.local` file in the client directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_ENVIRONMENT=development
```

### Production (Vercel)

In your Vercel project settings, configure the following environment variables:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-aws-api-gateway-url.amazonaws.com
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_ENVIRONMENT=production
```

## API Client Implementation

The application uses an enhanced API client with proper error handling and retry logic. This implementation is located in `client/shared/utils/api.ts`.

Key features:
- Configuration from environment variables
- Typed error handling with categorized error types
- Automatic retry for network errors
- Consistent error format

```typescript
// Example usage in components
import { apiClient } from '@/shared/utils/api';

// Get data from API
const data = await apiClient.get<BusinessData[]>('/companies/businesses_by_city', {
  params: { city: 'Helsinki' }
});
```

## React Hooks for API Calls

We've implemented React hooks to simplify API usage with loading and error states. See `client/shared/hooks/useApi.ts`.

```typescript
// Example usage in a component
import { useApiRequest } from '@/shared/hooks/useApi';

function BusinessList({ city }) {
  const { data, loading, error, execute } = useApiRequest<BusinessData[]>(
    '/companies/businesses_by_city'
  );

  useEffect(() => {
    execute({ params: { city } });
  }, [city, execute]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ApiErrorDisplay error={error} onRetry={() => execute({ params: { city } })} />;
  
  return <Table data={data || []} />;
}
```

## Reusable Components

We've created reusable components for common patterns:

1. `ApiErrorDisplay` - Displays API errors with proper formatting based on error type
2. `DataFetcher` - A reusable component for fetching data with loading and error states

```typescript
// Example usage of DataFetcher
<DataFetcher
  endpoint="/companies/businesses_by_city"
  params={{ city: selectedCity }}
  renderData={(data) => <BusinessTable businesses={data} />}
  renderLoading={() => <CustomLoadingSpinner />}
  renderEmpty={() => <NoDataMessage />}
/>
```

## CORS Configuration

The server has been configured to accept CORS requests from both:
- Local development (http://localhost:3000)
- Production Vercel domain

The CORS configuration is controlled by the `BACKEND_CORS_ORIGINS` environment variable on the server side. In production, set this environment variable to include your Vercel domain:

```bash
BACKEND_CORS_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

## Testing the Integration

1. Test with local FastAPI server:
   ```bash
   # In one terminal
   cd server
   docker-compose up
   
   # In another terminal
   cd client
   npm run dev
   ```

2. Test with production API (using environment variables):
   ```bash
   # In the client directory
   NEXT_PUBLIC_API_BASE_URL=https://your-aws-api-gateway-url.amazonaws.com npm run dev
   ```

## Deployment Workflow

1. Deploy server to AWS using GitHub Actions
2. Update Vercel environment variables to point to the new API endpoint
3. Deploy client to Vercel
4. Verify end-to-end functionality 

## Troubleshooting

### Network Errors
- Ensure your API URL is correct
- Check if the server is running
- Verify your CORS configuration

### Authentication Errors
- Check if you need authentication tokens
- Verify token expiration

### Other Issues
- Check browser console for detailed error messages
- Verify environment variables are set correctly
- Make sure the API version matches between client and server 