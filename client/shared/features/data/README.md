# Data Feature

This feature contains components, hooks, and utilities for data visualization and management.

## Directory Structure

- `components/`: React components for data visualization and loading
- `hooks/`: Custom React hooks for data fetching and management
- `utils/`: Utility functions for data processing and transformation
- `types/`: TypeScript type definitions for data structures
- `context/`: React context providers for data state management

## Components

### DataLoader

A component that fetches data and shows a loading indicator until data is ready, then renders children.

```tsx
import { DataLoader } from '@/shared/features/data';

// Basic usage
<DataLoader>
  <YourComponent />
</DataLoader>

// With callback when data is ready
<DataLoader onDataReady={() => console.log('Data is ready!')}>
  <YourComponent />
</DataLoader>
```

### Preloader

A component that prefetches data for the home page when the landing page loads, helping to reduce perceived loading time.

```tsx
import { Preloader } from '@/shared/features/data';

// Basic usage
<Preloader />
```

## Dependencies

- `@tanstack/react-query`: For data fetching and caching
- `@heroui/react`: For UI components
- `next/navigation`: For routing

## Usage Notes

- Both components are client-side only (marked with 'use client')
- The components handle SSR by showing a placeholder during server-side rendering
- Data is cached using React Query for improved performance

## Usage

Import data components, hooks, and utilities from this directory when you need to work with data visualization or management.

Example:
```typescript
import { DataTable } from '@/shared/features/data/components/DataTable';
import { useDataFetch } from '@/shared/features/data/hooks/useDataFetch';
import { processData } from '@/shared/features/data/utils/dataProcessing';
``` 