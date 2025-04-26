# Error Feature

This directory contains components, hooks, utilities, and types for error handling and display.

## Structure

- `components/`: Error components and displays
- `hooks/`: Custom React hooks for error management
- `utils/`: Utility functions for error processing and formatting
- `types/`: TypeScript type definitions for error-related data structures

## Usage

Import error components, hooks, and utilities from this directory when you need to work with error handling or display.

Example:
```typescript
import { ErrorProvider } from '@/shared/features/error/components/ErrorProvider';
import { useError } from '@/shared/features/error/hooks/useError';
import { formatError } from '@/shared/features/error/utils/errorUtils';
``` 