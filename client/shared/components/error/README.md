# Error Handling Components

This directory contains shared error handling components for use throughout the application. These components provide consistent error handling, reporting, and display across all features.

## Components

### `ErrorBoundary`

The base error boundary component that catches JavaScript errors in child components.

```tsx
<ErrorBoundary
  fallback={<CustomFallback />}
  onError={(error, errorInfo) => logError(error, errorInfo)}
>
  <YourComponent />
</ErrorBoundary>
```

### `FeatureErrorBoundary`

A specialized error boundary for feature-specific errors with consistent styling and messaging.

```tsx
<FeatureErrorBoundary 
  featureName="Dashboard"
  errorTitle="Dashboard Error"
  errorMessage="There was a problem loading the dashboard"
>
  <DashboardContent />
</FeatureErrorBoundary>
```

### `ErrorDisplay`

A customizable error display component for showing error messages with optional details.

```tsx
<ErrorDisplay
  title="Data Loading Error"
  message="Failed to fetch user data"
  error={error}
  showDetails={true}
  onRetry={() => refetch()}
/>
```

### `withErrorBoundary`

A higher-order component (HOC) for wrapping components with error boundaries.

```tsx
const SafeComponent = withErrorBoundary(MyComponent, {
  componentName: "MyComponent",
  errorTitle: "Component Error",
  errorMessage: "Failed to render the component"
});
```

## Best Practices

1. Use `FeatureErrorBoundary` for top-level feature components
2. Use `withErrorBoundary` for reusable components that might fail
3. Use `ErrorDisplay` for showing API or data-related errors
4. Keep error messages user-friendly and actionable

## Migration

All feature-specific error boundaries have been deprecated in favor of these shared components. If you're using any of the following, please migrate:

- `DashboardErrorBoundary` → `FeatureErrorBoundary`
- `withDashboardErrorBoundary` → `withErrorBoundary`
- Feature-specific error message components → `ErrorDisplay` or `SimpleErrorMessage` 