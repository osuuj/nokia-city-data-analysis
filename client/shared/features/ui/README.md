# UI Feature

This directory contains UI components, hooks, utilities, and types specific to the user interface.

## Structure

- `components/`: UI components for layout, navigation, and user interaction
- `hooks/`: Custom React hooks for UI state management and interactions
- `utils/`: Utility functions for UI-related operations
- `types/`: TypeScript type definitions for UI components and state

## Usage

Import UI components, hooks, and utilities from this directory when you need to build or enhance the user interface.

Example:
```typescript
import { Card } from '@/shared/features/ui/components/Card';
import { useModal } from '@/shared/features/ui/hooks/useModal';
import { calculateLayout } from '@/shared/features/ui/utils/layoutUtils';
``` 