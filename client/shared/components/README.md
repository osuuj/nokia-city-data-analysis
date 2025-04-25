# Shared Components

This directory contains reusable components that can be used across the application.

## Directory Structure

- `ui/` - Basic UI components like buttons, inputs, and other common elements
- `error/` - Error handling components
- `loading/` - Loading state components
- `data/` - Data display components
- `team/` - Team member display components
- `layout/` - Layout components (not yet implemented)

## Usage

Import components from the shared components directory:

```tsx
// Import specific components
import { Button, Input } from '@/shared/components/ui';
import { ErrorBoundary } from '@/shared/components/error';
import { LoadingSpinner } from '@/shared/components/loading';
import { TeamMemberCard, TeamMemberGrid } from '@/shared/components/team';

// Or import all components
import * as SharedComponents from '@/shared/components';
```

## Component Categories

### UI Components

Basic UI components that can be used throughout the application.

```tsx
import { Button, Input, ThemeSwitch, AnimatedBackground } from '@/shared/components/ui';
```

### Error Components

Components for handling and displaying errors.

```tsx
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
```

### Loading Components

Components for displaying loading states.

```tsx
import { LoadingSpinner, SkeletonLoader, LoadingOverlay } from '@/shared/components/loading';
```

### Data Components

Components for displaying data.

```tsx
import { DataTable, DataGrid } from '@/shared/components/data';
```

### Team Components

Components for displaying team members.

```tsx
import { TeamMemberCard, TeamMemberGrid } from '@/shared/components/team';
```

## Best Practices

1. Use shared components whenever possible to maintain consistency across the application.
2. Extend shared components rather than creating new ones if the functionality is similar.
3. Keep shared components generic and reusable.
4. Document any new shared components with examples and usage instructions.
5. Test shared components thoroughly as they are used across the application. 