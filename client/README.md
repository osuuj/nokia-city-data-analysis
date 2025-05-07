# Client Application

This directory contains the client application for the Nokia City Data Analysis project.

## Documentation

Comprehensive documentation is available in the following locations:

- [Shared Module Documentation](./shared/@docs/index.md) - Documentation for shared components, hooks, and utilities
- [Feature Documentation](./shared/@docs/features/) - Documentation for specific features
- [API Documentation](./shared/api/README.md) - API client and utilities

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
│   └── @docs/        # Centralized documentation
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

For detailed best practices, please refer to the [Shared Module Documentation](./shared/@docs/index.md).
