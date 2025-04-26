# Authentication Feature

This directory contains components, hooks, utilities, and types for authentication management and display.

## Structure

- `components/`: Authentication components and displays
- `hooks/`: Custom React hooks for authentication management
- `utils/`: Utility functions for authentication processing and formatting
- `types/`: TypeScript type definitions for authentication-related data structures

## Usage

Import authentication components, hooks, and utilities from this directory when you need to work with authentication or display.

Example:
```typescript
import { AuthProvider } from '@/shared/features/authentication/components/AuthProvider';
import { useAuth } from '@/shared/features/authentication/hooks/useAuth';
import { formatAuth } from '@/shared/features/authentication/utils/authUtils';
``` 