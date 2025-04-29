# Error Handling Guide

This guide covers the error handling components and utilities available in the dashboard feature.

## Components

### DashboardErrorBoundary

A React error boundary component for catching and handling errors in dashboard components.

```tsx
import { DashboardErrorBoundary } from '@/features/dashboard/components/shared/error';

// Basic usage
<DashboardErrorBoundary>
  <YourComponent />
</DashboardErrorBoundary>

// With custom fallback UI
<DashboardErrorBoundary
  fallback={
    <div className="p-4 text-red-500">
      Something went wrong. Please try again.
    </div>
  }
>
  <YourComponent />
</DashboardErrorBoundary>

// With component name for better error tracking
<DashboardErrorBoundary componentName="AnalyticsView">
  <AnalyticsView />
</DashboardErrorBoundary>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | The components to wrap with error boundary |
| fallback | ReactNode | Default error UI | The UI to show when an error occurs |
| componentName | string | undefined | Name of the component for better error tracking |

### DashboardErrorMessage

A component for displaying error messages with consistent styling.

```tsx
import { DashboardErrorMessage } from '@/features/dashboard/components/shared/error';

// Basic usage
<DashboardErrorMessage message="Something went wrong" />

// With custom title
<DashboardErrorMessage
  title="Error Loading Data"
  message="Failed to load the requested data. Please try again."
/>

// With retry button
<DashboardErrorMessage
  title="Connection Error"
  message="Failed to connect to the server."
  onRetry={() => window.location.reload()}
/>

// With error details
<DashboardErrorMessage
  title="API Error"
  message="Failed to fetch data from the API."
  details="Error: 500 Internal Server Error"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | 'Error' | The error title |
| message | string | required | The error message |
| onRetry | () => void | undefined | Callback function for retry button |
| details | string | undefined | Additional error details to display |
| className | string | '' | Additional CSS class name |

### withDashboardErrorBoundary

A higher-order component for wrapping components with error boundaries.

```tsx
import { withDashboardErrorBoundary } from '@/features/dashboard/components/shared/error';

// Basic usage
const SafeComponent = withDashboardErrorBoundary(YourComponent);

// With custom fallback
const SafeComponent = withDashboardErrorBoundary(YourComponent, {
  fallback: <div>Custom error UI</div>,
});

// With component name
const SafeAnalyticsView = withDashboardErrorBoundary(AnalyticsView, {
  componentName: 'AnalyticsView',
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| fallback | ReactNode | Default error UI | The UI to show when an error occurs |
| componentName | string | Component name | Name of the component for better error tracking |

## Utilities

### logError

Log an error with context information.

```tsx
import { logError } from '@/features/dashboard/components/shared/error';

try {
  // Some code that might throw an error
} catch (error) {
  if (error instanceof Error) {
    logError(error, { componentStack: '' }, 'YourComponent');
  }
}
```

### logWarning

Log a warning with context information.

```tsx
import { logWarning } from '@/features/dashboard/components/shared/error';

logWarning('This operation might fail', 'YourComponent');
```

### withErrorLogging

Create a higher-order function that logs errors for async operations.

```tsx
import { withErrorLogging } from '@/features/dashboard/components/shared/error';

const fetchData = async () => {
  const response = await fetch('/api/data');
  return response.json();
};

const safeFetchData = withErrorLogging(fetchData, 'DataFetcher');

// Now use safeFetchData instead of fetchData
const data = await safeFetchData();
```

## Best Practices

1. Use `DashboardErrorBoundary` at strategic points in your component tree
2. Use `DashboardErrorMessage` for consistent error message styling
3. Use `withDashboardErrorBoundary` HOC for reusable error boundary wrapping
4. Always provide meaningful error messages
5. Consider adding retry functionality where appropriate
6. Log errors using the provided utilities
7. Use error boundaries to prevent the entire dashboard from crashing
8. Place error boundaries at route level for route-specific error handling
9. Use error boundaries around data fetching components
10. Consider using different error UIs for different types of errors 