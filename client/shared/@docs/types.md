# Shared Types

This file provides documentation for the shared TypeScript types in the `client/shared/types` directory.

## Directory Structure

```
types/
├── api.ts          # API-related types
├── components.ts   # Component-related types
├── data.ts         # Data model types
├── ui.ts           # UI-related types
└── index.ts        # Main export file
```

## Common Types

Here are some of the common types used throughout the application:

### API Types

```typescript
// Response wrapper type
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Error type
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

// API Query Options
export interface ApiQueryOptions {
  staleTime?: number;
  cachePeriod?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}
```

### Component Types

```typescript
// Common props shared across components
export interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

// Common button props
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### Data Model Types

```typescript
// City data type
export interface City {
  id: string;
  name: string;
  country: string;
  population?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Company data type
export interface Company {
  id: string;
  name: string;
  industry: string;
  industry_letter?: string;
  addresses?: {
    [key: string]: {
      latitude: number;
      longitude: number;
      address: string;
    };
  };
  employees?: number;
  revenue?: number;
  founded?: number;
}
```

### UI Types

```typescript
// Theme configuration
export type ThemeMode = 'light' | 'dark' | 'system';

// Color palette
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'default';

// Loading state
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  type?: 'overlay' | 'inline' | 'skeleton';
  priority?: 'high' | 'medium' | 'low';
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  createdAt: Date;
}
```

## Usage

Import types from the shared types directory:

```typescript
import { 
  ApiResponse, 
  ApiError, 
  City, 
  Company,
  LoadingState 
} from '@/shared/types';

// Function with typed parameters and return value
function fetchCities(): Promise<ApiResponse<City[]>> {
  // Implementation
}

// Component with typed props
interface CityListProps {
  cities: City[];
  loading: LoadingState;
  onSelect: (city: City) => void;
}

function CityList({ cities, loading, onSelect }: CityListProps) {
  // Implementation
}
```

## Best Practices

1. **Centralized Type Definitions**
   - Define shared types in the appropriate files
   - Avoid duplicating type definitions across the codebase

2. **Export from Index**
   - Export all types from the index.ts file
   - Use named imports when importing types

3. **Type vs Interface**
   - Use interfaces for object shapes that might be extended
   - Use types for unions, intersections, or primitives

4. **Documentation**
   - Document complex types with JSDoc comments
   - Include examples for non-obvious types 