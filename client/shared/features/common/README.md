# Common Feature

This directory contains shared components, hooks, utilities, and types that are used across multiple features.

## Structure

- `components/`: Reusable UI components that are not specific to any feature
- `hooks/`: Custom React hooks for common functionality
- `utils/`: Utility functions and helpers
- `types/`: TypeScript type definitions and interfaces

## Usage

Import components, hooks, and utilities from this directory when you need functionality that is not specific to a single feature.

Example:
```typescript
import { Button } from '@/shared/features/common/components/Button';
import { useDebounce } from '@/shared/features/common/hooks/useDebounce';
import { formatDate } from '@/shared/features/common/utils/dateUtils';
``` 