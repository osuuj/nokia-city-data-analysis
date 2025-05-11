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

## API Client Configuration

The application uses a central API client that respects these environment variables. Update your API client to use the environment-specific configuration:

```typescript
// client/shared/api/client.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/${endpoint}`);
    
    if (!response.ok) {
      // Implement error handling based on status codes
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  // Add other methods as needed (post, put, delete, etc.)
};
```

## CORS Configuration

Ensure that your FastAPI backend has the correct CORS configuration:

1. For local development, the backend should allow `http://localhost:3000`
2. For production, the backend should allow your Vercel domain (e.g., `https://your-app.vercel.app`)

## Error Handling

Implement appropriate error handling in your client application:

1. Add loading states for API calls
2. Implement error boundaries for API failures
3. Add retry logic for transient network issues

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