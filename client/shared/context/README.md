# Shared Context

This directory contains React Context providers used across the application for global state management.

## Directory Structure

```
context/
├── loading/           # Loading state context
│   ├── LoadingContext.tsx
│   └── index.ts
├── breadcrumb/        # Breadcrumb navigation context
│   ├── BreadcrumbContext.tsx
│   └── index.ts
└── index.ts          # Main export file
```

## Available Contexts

### Loading Context

The Loading Context provides application-wide loading state management.

```typescript
import { useLoading } from '@shared/context';

// In your component
const { loadingState, startLoading, stopLoading } = useLoading();

// Start loading
startLoading({ message: 'Loading data...', type: 'overlay' });

// Stop loading
stopLoading();
```

#### Loading Types
- `overlay` - Full screen loading overlay
- `inline` - Inline loading indicator
- `skeleton` - Skeleton loading state

#### Loading Priorities
- `high` - Critical operations
- `medium` - Standard operations
- `low` - Background operations

### Breadcrumb Context

The Breadcrumb Context manages the current page title for navigation breadcrumbs.

```typescript
import { useBreadcrumb } from '@shared/context';

// In your component
const { currentPageTitle, setCurrentPageTitle } = useBreadcrumb();

// Set page title
setCurrentPageTitle('Dashboard');
```

## Usage Examples

### Setting up Providers

```typescript
import { LoadingProvider, BreadcrumbProvider } from '@shared/context';

function App({ children }) {
  return (
    <LoadingProvider>
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    </LoadingProvider>
  );
}
```

### Using Loading State

```typescript
import { useLoading } from '@shared/context';

function DataLoader() {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading({ message: 'Loading data...' });
    // ... fetch data
    stopLoading();
  }, []);

  return <div>Content</div>;
}
```

### Using Breadcrumbs

```typescript
import { useBreadcrumb } from '@shared/context';

function PageHeader() {
  const { currentPageTitle } = useBreadcrumb();

  return (
    <header>
      <h1>{currentPageTitle}</h1>
      <BreadcrumbNav />
    </header>
  );
}
```

## Best Practices

1. **Provider Order**
   - Place providers high in the component tree
   - Consider provider dependencies when ordering

2. **Performance**
   - Use context selectors to prevent unnecessary re-renders
   - Split contexts by domain to minimize re-renders

3. **Type Safety**
   - Always provide proper TypeScript types
   - Use type inference where possible

4. **Error Handling**
   - Implement proper error boundaries
   - Handle edge cases in context providers

## Contributing

When adding new contexts:
1. Create a new directory for the context
2. Implement the context provider and hook
3. Add proper TypeScript types
4. Include JSDoc documentation
5. Add usage examples to this README 