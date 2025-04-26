# Theme Feature

This directory contains components, hooks, utilities, and types for theme management and display.

## Structure

- `components/`: Theme components and displays
- `hooks/`: Custom React hooks for theme management
- `utils/`: Utility functions for theme processing and formatting
- `types/`: TypeScript type definitions for theme-related data structures

## Usage

Import theme components, hooks, and utilities from this directory when you need to work with themes or display.

Example:
```typescript
import { ThemeProvider } from '@/shared/features/theme/components/ThemeProvider';
import { useTheme } from '@/shared/features/theme/hooks/useTheme';
import { formatTheme } from '@/shared/features/theme/utils/themeUtils';
``` 