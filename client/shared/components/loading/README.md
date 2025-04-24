# Loading Components

This directory contains components for handling loading states throughout the application.

## Components

### LoadingSpinner

A reusable spinner component for indicating loading states.

```tsx
import { LoadingSpinner } from '@/shared/components/loading';

// Basic usage
<LoadingSpinner />

// With custom size and color
<LoadingSpinner size="lg" color="primary" />

// With loading text
<LoadingSpinner showText text="Loading data..." />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | The size of the spinner |
| color | 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'default' | 'primary' | The color of the spinner |
| className | string | undefined | Additional CSS classes |
| showText | boolean | false | Whether to show loading text |
| text | string | 'Loading...' | The text to show when showText is true |

### SkeletonLoader

A skeleton component for loading states.

```tsx
import { SkeletonLoader } from '@/shared/components/loading';

// Basic usage
<SkeletonLoader />

// With custom dimensions
<SkeletonLoader width={200} height={100} />

// Without animation
<SkeletonLoader animate={false} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number \| string | '100%' | The width of the skeleton |
| height | number \| string | '1rem' | The height of the skeleton |
| rounded | boolean | true | Whether to round the corners |
| className | string | undefined | Additional CSS classes |
| animate | boolean | true | Whether to animate the skeleton |

### LoadingOverlay

A full-screen overlay with a loading spinner and message.

```tsx
import { LoadingOverlay } from '@/shared/components/loading';

// Basic usage
<LoadingOverlay />

// With custom message
<LoadingOverlay message="Loading data..." />

// Without blur effect
<LoadingOverlay blur={false} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| visible | boolean | true | Whether the overlay is visible |
| message | string | 'Loading...' | The message to display |
| className | string | undefined | Additional CSS classes |
| blur | boolean | true | Whether to blur the background |
| zIndex | number | 50 | The z-index of the overlay |

## Loading Context

The loading context provides global loading state management.

```tsx
import { LoadingProvider, useLoading } from '@/shared/components/loading';

// Wrap your app with the provider
function App() {
  return (
    <LoadingProvider>
      <YourApp />
    </LoadingProvider>
  );
}

// Use the loading context in your components
function YourComponent() {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleSomeAsyncAction = async () => {
    startLoading('Processing...');
    try {
      await someAsyncOperation();
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      {isLoading && <LoadingOverlay />}
      <button onClick={handleSomeAsyncAction}>Do Something</button>
    </div>
  );
}
```

### LoadingContext API

| Property | Type | Description |
|----------|------|-------------|
| isLoading | boolean | Whether loading is active |
| loadingMessage | string | The current loading message |
| startLoading | (message?: string) => void | Start loading with optional message |
| stopLoading | () => void | Stop loading |

## Best Practices

1. Use `LoadingSpinner` for small, inline loading states
2. Use `SkeletonLoader` for content placeholders while data is loading
3. Use `LoadingOverlay` for full-screen loading states
4. Use the loading context for global loading state management
5. Always provide meaningful loading messages
6. Consider using skeleton loaders for better UX during data fetching
7. Use appropriate sizes and colors for different contexts 