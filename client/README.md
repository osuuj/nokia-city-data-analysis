# Nokia City Data Analysis - Client Application

This directory contains the client application for the Nokia City Data Analysis project.

## Documentation

Comprehensive documentation is available in the following locations:

- [Main Documentation](./docs/README.md) - Project overview and documentation index
- [Feature Documentation](./docs/features/README.md) - Documentation for each specific feature
- [Shared Components Documentation](./docs/shared/README.md) - Documentation for shared components, hooks, and utilities

## Directory Structure

```
client/
├── app/              # Next.js App Router entry points
├── features/         # Feature-specific code
│   ├── about/        # About page feature
│   ├── contact/      # Contact page feature
│   ├── dashboard/    # Dashboard feature
│   ├── landing/      # Landing page feature
│   ├── project/      # Project feature
│   └── resources/    # Resources feature
├── shared/           # Shared resources (components, hooks, utilities)
│   ├── components/   # Shared UI components
│   ├── hooks/        # Shared hooks
│   ├── utils/        # Shared utilities
│   └── types/        # Shared type definitions
├── docs/             # Comprehensive documentation
│   ├── features/     # Feature-specific documentation
│   └── shared/       # Shared component documentation
├── public/           # Static assets
├── scripts/          # Build and development scripts
└── README.md         # This file
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Logging

The application uses a centralized logger utility (`shared/utils/logger.ts`) that automatically disables debug and info logs in production.

- In development: All logs are displayed
- In production: Only warnings and errors are shown

### Enabling Debug Logs in Production

To enable debug logs in production for troubleshooting, add the following to your `.env` file:

```
NEXT_PUBLIC_DEBUG_MODE=true
```

### Usage

Replace direct console logs with the logger utility:

```typescript
import { logger } from '@/shared/utils/logger';

// Different log levels
logger.debug('Detailed information for debugging');
logger.info('Informational messages');
logger.warn('Warning messages');
logger.error('Error messages', errorObject);
```

## Key Technologies

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form

## Best Practices

For detailed best practices, please refer to the [Documentation Guidelines](./docs/GUIDELINES.md).

## Environment Setup

### Local Development

1. Create a `.env.local` file in the client directory with the following variables:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_ENVIRONMENT=development
```

2. Start the client application:

```bash
npm run dev
```

### Production Environment (Vercel)

In your Vercel project settings, configure the following environment variables:

```
NEXT_PUBLIC_BACKEND_URL=https://your-aws-api-gateway-url.amazonaws.com
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_ENVIRONMENT=production
```

### Testing the Integration

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
   NEXT_PUBLIC_BACKEND_URL=https://your-aws-api-gateway-url.amazonaws.com npm run dev
   ```

### CORS Configuration

The server has been configured to accept CORS requests from both:
- http://localhost:3000 (local development)
- Your production Vercel domain

If you need to add additional domains, update the `BACKEND_CORS_ORIGINS` environment variable on the server side.
