# Error Handling Components

This document provides information about components for handling errors throughout the application.

## Components

### ErrorBoundary

A React error boundary component for catching and handling errors in its child component tree.

```tsx
import { ErrorBoundary } from '@/shared/components/error';

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback UI
<ErrorBoundary
  fallback={
    <div className="p-4 text-red-500">
      Something went wrong. Please try again.
    </div>
  }
>
  <YourComponent />
</ErrorBoundary>

// With error callback
<ErrorBoundary
  onError={(error) => {
    console.error('Component error:', error);
    // Log to error tracking service
  }}
>
  <YourComponent />
</ErrorBoundary>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | The components to wrap with error boundary |
| fallback | ReactNode | ErrorMessage component | The UI to show when an error occurs |
| onError | (error: Error) => void | undefined | Callback function when an error occurs |

### ErrorMessage

A component for displaying error messages with consistent styling.

```tsx
import { ErrorMessage } from '@/shared/components/error';

// Basic usage
<ErrorMessage message="Something went wrong" />

// With custom title
<ErrorMessage
  title="Error Loading Data"
  message="Failed to load the requested data. Please try again."
/>

// With retry button
<ErrorMessage
  title="Connection Error"
  message="Failed to connect to the server."
  onRetry={() => window.location.reload()}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | 'Error' | The error title |
| message | string | required | The error message |
| onRetry | () => void | undefined | Callback function for retry button |

### withErrorBoundary

A higher-order component for wrapping components with error boundaries.

```tsx
import { withErrorBoundary } from '@/shared/components/error';

// Basic usage
const SafeComponent = withErrorBoundary(YourComponent);

// With custom fallback
const SafeComponent = withErrorBoundary(YourComponent, {
  fallback: <div>Custom error UI</div>,
});

// With error callback
const SafeComponent = withErrorBoundary(YourComponent, {
  onError: (error) => {
    console.error('Component error:', error);
  },
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| fallback | ReactNode | ErrorMessage component | The UI to show when an error occurs |
| onError | (error: Error) => void | undefined | Callback function when an error occurs |

## Best Practices

1. Use `ErrorBoundary` at strategic points in your component tree
2. Use `ErrorMessage` for consistent error message styling
3. Use `withErrorBoundary` HOC for reusable error boundary wrapping
4. Always provide meaningful error messages
5. Consider adding retry functionality where appropriate
6. Log errors to your error tracking service
7. Use error boundaries to prevent the entire app from crashing
8. Place error boundaries at route level for route-specific error handling
9. Use error boundaries around data fetching components
10. Consider using different error UIs for different types of errors 