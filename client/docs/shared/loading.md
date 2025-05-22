# Loading Components

This directory contains shared loading components for consistent loading states.

## Key Components

- **AnimatedBackgroundSkeleton**: Background with loading animation (deprecated)
- **TableSkeleton**: Loading skeleton for table data
- **ChartSkeleton**: Loading skeleton for charts and graphs
- **CardSkeleton**: Loading skeleton for card components
- **MapSkeleton**: Loading skeleton for map views

## Example Usage

```tsx
import { TableSkeleton } from "@/shared/components/loading";

function LoadingState() {
  return <TableSkeleton rows={5} columns={4} />;
}
```

## Best Practices

1. Use the appropriate skeleton for the content type
2. Match skeleton dimensions to actual content
3. Prefer TransitionBackground for page-level loading states
4. Use shared loading components for consistency
