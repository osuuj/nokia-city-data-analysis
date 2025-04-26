# Loading Feature

This directory contains components, hooks, utilities, and types for loading state management and display.

## Structure

- `components/`: Loading components and displays
- `hooks/`: Custom React hooks for loading state management
- `utils/`: Utility functions for loading state processing and formatting
- `types/`: TypeScript type definitions for loading-related data structures

## Usage

Import loading components, hooks, and utilities from this directory when you need to work with loading states or display.

Example:
```typescript
import { LoadingProvider } from '@/shared/features/loading/components/LoadingProvider';
import { useLoading } from '@/shared/features/loading/hooks/useLoading';
import { formatLoading } from '@/shared/features/loading/utils/loadingUtils';
``` 