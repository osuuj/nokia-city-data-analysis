# Notification Feature

This directory contains components, hooks, utilities, and types for notification management and display.

## Structure

- `components/`: Notification components and displays
- `hooks/`: Custom React hooks for notification management
- `utils/`: Utility functions for notification processing and formatting
- `types/`: TypeScript type definitions for notification-related data structures

## Usage

Import notification components, hooks, and utilities from this directory when you need to work with notifications or display.

Example:
```typescript
import { NotificationProvider } from '@/shared/features/notification/components/NotificationProvider';
import { useNotification } from '@/shared/features/notification/hooks/useNotification';
import { formatNotification } from '@/shared/features/notification/utils/notificationUtils';
``` 