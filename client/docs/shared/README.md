# Shared Components

This directory contains documentation for shared components, hooks, utilities, and infrastructure used across the Nokia City Data Analysis project.

## Overview

The shared module provides:

- **UI Components**: Reusable components for consistent UI across features
- **Error Handling**: Error boundaries and error display components
- **Loading States**: Skeletons, spinners, and loading indicators
- **Layout Components**: Footers, headers, and structural elements
- **Hooks**: Custom React hooks for common functionality
- **Utilities**: Helper functions and configuration
- **Context Providers**: Global state management

## Documentation Structure

| Component | Description |
|-----------|-------------|
| [Background Components](./background.md) | Background components with animations and gradients |
| [Error Components](./error.md) | Error boundaries and error displays |
| [Loading Components](./loading.md) | Loading skeletons and indicators |
| [UI Components](./ui.md) | Buttons, inputs, and other UI elements |
| [Layout Components](./layout.md) | Page layout components |
| [Hooks](./hooks.md) | Custom React hooks |
| [Context](./context.md) | Context providers |
| [Utils](./utils.md) | Utility functions |

## Directory Structure

```
client/shared/
├── components/           # UI components
│   ├── data/             # Data display components
│   ├── error/            # Error handling components
│   ├── layout/           # Layout components
│   │   └── footer/       # Footer components
│   ├── loading/          # Loading components
│   └── ui/               # UI components
│       ├── background/   # Background components
│       └── theme/        # Theme components
├── config/               # Configuration
├── context/              # Context providers
│   └── loading/          # Loading context
├── hooks/                # Custom React hooks
├── icons/                # Icon components
├── providers/            # Application providers
├── styles/               # Global styles
├── types/                # TypeScript types
├── utils/                # Utility functions
└── index.ts              # Shared module exports
```

## Best Practices

1. **Component Usage**
   - Always check for a shared component before creating a feature-specific one
   - Follow established patterns for props and API design
   - Use consistent naming patterns

2. **Background Components**
   - Use the `TransitionBackground` component for consistent background effects
   - Configure through the `backgroundConfig.ts` utility
   - Never hardcode gradient colors or animation properties

3. **Loading and Error States**
   - Use shared loading components (skeletons) for consistent loading experience
   - Use the `ErrorDisplay` component for error states
   - Use error boundaries to catch and handle unexpected errors

4. **Context and Providers**
   - Use the LoadingContext for managing loading states
   - Use the ThemeContext for theme-related functionality
   - Wrap providers at appropriate levels of the component tree

5. **Utility Functions**
   - Use shared utility functions for common operations
   - Keep utility functions focused and well-tested
   - Document utility functions with clear descriptions and examples

## Component Migration

Several components have been migrated or refactored:

- `AnimatedBackgroundSkeleton` → `TransitionBackground` 
- Feature-specific error boundaries → Shared error boundaries
- Component-specific configurations → Centralized configuration files

For detailed migration information, see the relevant component documentation.

## Examples

### Using Background Components

```tsx
import { TransitionBackground } from '@/shared/components/ui/background';
import { gradientColors } from '@/shared/utils/backgroundConfig';

function MyComponent() {
  return (
    <TransitionBackground
      colors={gradientColors.blue}
      direction="to-r"
      className="min-h-screen"
    >
      <div className="relative z-10">
        {/* Content */}
      </div>
    </TransitionBackground>
  );
}
```

### Using Error Components

```tsx
import { ErrorBoundary, ErrorDisplay } from '@/shared/components/error';

function MyComponent() {
  // For API or data errors
  const { data, error } = useMyData();
  
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  
  // For component errors
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      {/* Content that might error */}
    </ErrorBoundary>
  );
}
```

### Using Loading Components

```tsx
import { TableSkeleton, CardSkeleton } from '@/shared/components/loading';

function MyComponent() {
  const { data, isLoading } = useMyData();
  
  if (isLoading) {
    return <TableSkeleton rows={5} columns={4} />;
  }
  
  return (
    // Actual component
  );
}
``` 