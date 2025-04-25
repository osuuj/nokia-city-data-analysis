# Shared Resources

This directory contains resources that are shared across the application. These resources include components, hooks, context providers, utilities, and more.

## Directory Structure

```
client/shared/
├── components/         # Shared UI components
│   ├── data/          # Data-related components
│   ├── error/         # Error-related components
│   ├── loading/       # Loading-related components
│   ├── ui/            # UI components
│   ├── layout/        # Layout components
│   ├── README.md      # Documentation for components
│   └── index.ts       # Export file
├── hooks/             # Shared hooks
│   ├── data/          # Data-related hooks
│   │   ├── useEnhancedQuery.ts
│   │   └── index.ts
│   ├── api/           # API-related hooks
│   │   ├── useApi.ts
│   │   └── index.ts
│   └── index.ts       # Main export file
├── context/           # Shared context providers
│   ├── loading/       # Loading-related context
│   │   ├── LoadingContext.tsx
│   │   └── index.ts
│   ├── breadcrumb/    # Breadcrumb-related context
│   │   ├── BreadcrumbContext.tsx
│   │   └── index.ts
│   └── index.ts       # Main export file
├── utils/             # Utility functions
│   ├── cn.ts
│   └── index.ts
├── api/               # API-related utilities
│   ├── client.ts
│   ├── types.ts
│   ├── endpoints.ts
│   ├── errors.ts
│   └── index.ts
├── styles/            # Global styles
│   ├── global-additions.css
│   ├── globals.css
│   └── index.ts
├── providers/         # Application providers
│   ├── Providers.tsx
│   └── index.ts
├── types/             # Shared type definitions
│   └── index.ts
└── README.md          # Documentation for shared resources
```

## Usage

### Components

Components are organized by their functionality. For example, data-related components are in the `components/data` directory, error-related components are in the `components/error` directory, and so on.

To use a component, import it from the appropriate directory:

```tsx
import { DataTable } from '@/shared/components/data';
import { ErrorMessage } from '@/shared/components/error';
import { LoadingSpinner } from '@/shared/components/loading';
```

### Hooks

Hooks are organized by their functionality. For example, data-related hooks are in the `hooks/data` directory, API-related hooks are in the `hooks/api` directory, and so on.

To use a hook, import it from the appropriate directory:

```tsx
import { useEnhancedQuery } from '@/shared/hooks/data';
import { useApi } from '@/shared/hooks/api';
```

### Context

Context providers are organized by their functionality. For example, loading-related context is in the `context/loading` directory, breadcrumb-related context is in the `context/breadcrumb` directory, and so on.

To use a context, import it from the appropriate directory:

```tsx
import { useLoading } from '@/shared/context/loading';
import { useBreadcrumb } from '@/shared/context/breadcrumb';
```

### Utilities

Utilities are functions that are used across the application. They are in the `utils` directory.

To use a utility, import it from the `utils` directory:

```tsx
import { cn } from '@/shared/utils';
```

### API

API-related utilities are in the `api` directory. They include the API client, types, endpoints, and error handling.

To use the API client, import it from the `api` directory:

```tsx
import { api } from '@/shared/api';
```

### Styles

Global styles are in the `styles` directory. They include global CSS and CSS additions.

To use global styles, import them from the `styles` directory:

```tsx
import '@/shared/styles';
```

### Providers

Application providers are in the `providers` directory. They include providers for the application, such as the `Providers` component.

To use the providers, import them from the `providers` directory:

```tsx
import { Providers } from '@/shared/providers';
```

### Types

Shared type definitions are in the `types` directory.

To use a type, import it from the `types` directory:

```tsx
import { ApiResponse } from '@/shared/types';
```

## Best Practices

1. **Use Shared Components**: Use shared components whenever possible to maintain consistency across the application.
2. **Use Shared Hooks**: Use shared hooks to avoid duplicating logic across the application.
3. **Use Shared Context**: Use shared context to avoid prop drilling and maintain a clean component hierarchy.
4. **Use Shared Utilities**: Use shared utilities to avoid duplicating utility functions across the application.
5. **Use Shared API**: Use the shared API client to maintain consistency in API calls across the application.
6. **Use Shared Styles**: Use shared styles to maintain consistency in styling across the application.
7. **Use Shared Providers**: Use shared providers to maintain consistency in provider usage across the application.
8. **Use Shared Types**: Use shared types to maintain consistency in type definitions across the application. 