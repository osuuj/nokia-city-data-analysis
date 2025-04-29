# Shared Providers

This file provides documentation for the application providers in the `client/shared/providers` directory.

## Directory Structure

```
providers/
├── Providers.tsx   # Main providers wrapper
└── index.ts       # Main export file
```

## Main Providers Component

The `Providers.tsx` file exports a component that wraps the application with all necessary providers:

```typescript
import { Providers } from '@/shared/providers';

// In your root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Included Providers

The Providers component includes the following providers:

### React Query Provider

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Usage
<QueryClientProvider client={queryClient}>
  {children}
  {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
</QueryClientProvider>
```

### Theme Provider

```typescript
import { ThemeProvider } from '@/shared/context';

// Usage
<ThemeProvider>{children}</ThemeProvider>
```

### Loading Provider

```typescript
import { LoadingProvider } from '@/shared/context';

// Usage
<LoadingProvider>{children}</LoadingProvider>
```

### Breadcrumb Provider

```typescript
import { BreadcrumbProvider } from '@/shared/context';

// Usage
<BreadcrumbProvider>{children}</BreadcrumbProvider>
```

## Usage

The providers are designed to be used at the root of your application. They provide global state and functionality to all components in the application.

```typescript
// In your app layout
import { Providers } from '@/shared/providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

## Best Practices

1. **Provider Order**
   - The order of providers matters! Some providers may depend on others.
   - The Providers component is designed with the correct order in mind.

2. **Custom Providers**
   - If you need to add a custom provider, consider adding it to the Providers component.
   - If it's feature-specific, add it at the feature level instead.

3. **Performance**
   - Providers can impact performance if they cause unnecessary re-renders.
   - Use context selectors and memoization to optimize performance.

4. **Testing**
   - When testing components that use providers, wrap them with the necessary providers.
   - Consider creating test-specific providers with mock data. 