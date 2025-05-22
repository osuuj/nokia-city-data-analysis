# Error Handling Components

This directory contains shared error handling components for use throughout the application. These components provide consistent error handling, reporting, and display across all features.

## Components

### ErrorBoundary

The base error boundary component that catches JavaScript errors in child components.

```tsx
import { ErrorBoundary } from '@/shared/components/error';

function MyComponent() {
  return (
    <ErrorBoundary
      fallback={<CustomFallback />}
      onError={(error, errorInfo) => logError(error, errorInfo)}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Components that might throw errors |
| `fallback` | ReactNode \| ((error: Error) => ReactNode) | Default error UI | Fallback UI to show when an error occurs |
| `onError` | (error: Error, errorInfo: React.ErrorInfo) => void | undefined | Optional callback for error reporting |
| `resetKeys` | any[] | [] | Array of values that will reset the error boundary when they change |

### FeatureErrorBoundary

A specialized error boundary for feature-specific errors with consistent styling and messaging.

```tsx
import { FeatureErrorBoundary } from '@/shared/components/error';

function FeatureComponent() {
  return (
    <FeatureErrorBoundary 
      featureName="Dashboard"
      errorTitle="Dashboard Error"
      errorMessage="There was a problem loading the dashboard"
    >
      <DashboardContent />
    </FeatureErrorBoundary>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Components that might throw errors |
| `featureName` | string | - | Name of the feature for error reporting |
| `errorTitle` | string | 'An error occurred' | Title for the error display |
| `errorMessage` | string | 'Something went wrong' | Message for the error display |
| `onRetry` | () => void | undefined | Optional callback for retry action |

### ErrorDisplay

A customizable error display component for showing error messages with optional details.

```tsx
import { ErrorDisplay } from '@/shared/components/error';

function DataComponent({ data, error }) {
  if (error) {
    return (
      <ErrorDisplay
        title="Data Loading Error"
        message="Failed to fetch user data"
        error={error}
        showDetails={true}
        onRetry={() => refetch()}
      />
    );
  }
  
  return <DataView data={data} />;
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | 'Error' | Title for the error display |
| `message` | string | 'An unexpected error occurred' | Error message |
| `error` | Error \| unknown | undefined | The error object |
| `showDetails` | boolean | false | Whether to show technical error details |
| `onRetry` | () => void | undefined | Optional callback for retry action |
| `className` | string | '' | Additional class names |

### withErrorBoundary

A higher-order component (HOC) for wrapping components with error boundaries.

```tsx
import { withErrorBoundary } from '@/shared/components/error';

const SafeComponent = withErrorBoundary(MyComponent, {
  componentName: "MyComponent",
  errorTitle: "Component Error",
  errorMessage: "Failed to render the component"
});
```

## Best Practices

1. **Use Feature-specific Error Boundaries**: Wrap each major feature with `FeatureErrorBoundary` to prevent entire app crashes
2. **Provide Helpful Messages**: Include specific error messages that explain what went wrong
3. **Include Retry Options**: When possible, provide retry functionality for recoverable errors
4. **Error Reporting**: Use the `onError` callback to log errors to monitoring services
5. **Granular Boundaries**: Use multiple error boundaries for different parts of the UI

## Migration

All feature-specific error boundaries have been deprecated in favor of these shared components. If you're using any of the following, please migrate:

- `DashboardErrorBoundary` → `FeatureErrorBoundary`
- `ProjectErrorBoundary` → `FeatureErrorBoundary`
- `withDashboardErrorBoundary` → `withErrorBoundary`
- Feature-specific error message components → `ErrorDisplay`

### Migration Example

**Before:**
```tsx
import { DashboardErrorBoundary } from '@/features/dashboard/components/DashboardErrorBoundary';

function Dashboard() {
  return (
    <DashboardErrorBoundary>
      <DashboardContent />
    </DashboardErrorBoundary>
  );
}
```

**After:**
```tsx
import { FeatureErrorBoundary } from '@/shared/components/error';

function Dashboard() {
  return (
    <FeatureErrorBoundary
      featureName="Dashboard"
      errorTitle="Dashboard Error"
      errorMessage="There was a problem loading the dashboard"
    >
      <DashboardContent />
    </FeatureErrorBoundary>
  );
}
``` 