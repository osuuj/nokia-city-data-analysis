# Shared Resources

This directory contains resources that are shared across the application. These resources include components, hooks, context providers, utilities, and more.

## Comprehensive Documentation

Detailed documentation for all shared resources is available in the [@docs directory](./@docs/index.md).

- [Components](./@docs/components.md) - Shared UI components
- [Hooks](./@docs/hooks.md) - Shared React hooks
- [Context](./@docs/context.md) - Shared React context providers
- [API](./@docs/api.md) - API utilities
- [Utils](./@docs/utils.md) - Utility functions
- [Types](./@docs/types.md) - TypeScript types
- [Styles](./@docs/styles.md) - Global styles
- [Providers](./@docs/providers.md) - Application providers

## Directory Structure

```
client/shared/
├── components/         # Shared UI components
│   ├── data/          # Data-related components
│   ├── error/         # Error-related components
│   ├── loading/       # Loading-related components
│   ├── ui/            # UI components
│   ├── layout/        # Layout components
│   └── ...
├── hooks/             # Shared hooks
│   ├── data/          # Data-related hooks
│   ├── api/           # API-related hooks
│   └── ...
├── context/           # Shared context providers
│   ├── loading/       # Loading-related context
│   ├── breadcrumb/    # Breadcrumb-related context
│   └── ...
├── utils/             # Utility functions
├── api/               # API-related utilities
├── styles/            # Global styles
├── providers/         # Application providers
├── types/             # Shared type definitions
├── icons/             # Icon components
├── services/          # Shared services
├── config/            # Configuration
├── @docs/             # Comprehensive documentation
└── README.md          # This file
```

## Quick Usage Examples

### Components

```tsx
import { Button } from '@/shared/components/ui';
import { ErrorMessage } from '@/shared/components/error';
import { LoadingSpinner } from '@/shared/components/loading';
```

### Hooks

```tsx
import { useEnhancedQuery } from '@/shared/hooks/data';
import { useApiQuery } from '@/shared/hooks/api';
```

### Context

```tsx
import { useLoading } from '@/shared/context/loading';
import { useBreadcrumb } from '@/shared/context/breadcrumb';
```

### Utilities

```tsx
import { cn } from '@/shared/utils';
```

### API

```tsx
import { API_ENDPOINTS } from '@/shared/api';
```

### Providers

```tsx
import { Providers } from '@/shared/providers';
```

## Best Practices

For detailed best practices, please refer to the [comprehensive documentation](./@docs/index.md). Here are a few key principles:

1. **Use Shared Resources**: Use shared components, hooks, and utilities whenever possible to maintain consistency.
2. **Follow Patterns**: Follow established patterns when creating new components or utilities.
3. **Documentation**: Update documentation when adding or modifying shared resources.
4. **Testing**: Test shared resources thoroughly as they are used across the application.

## Contributing

When adding new shared resources:
1. Place them in the appropriate directory
2. Add proper TypeScript types
3. Include JSDoc documentation
4. Update the documentation in the [@docs directory](./@docs/) 