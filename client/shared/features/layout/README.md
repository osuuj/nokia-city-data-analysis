# Layout Feature

This feature contains components and utilities for managing layout in the application.

## Directory Structure

- `components/`: React components for layout
- `hooks/`: Custom React hooks for layout logic
- `utils/`: Utility functions for layout calculations
- `types/`: TypeScript type definitions for layout

## Components

### Container

A responsive container component that centers content and provides consistent padding.

```tsx
import { Container } from '@/shared/features/layout/components/Container';

function MyPage() {
  return (
    <Container>
      <h1>My Page Content</h1>
      <p>This content is centered and has consistent padding.</p>
    </Container>
  );
}
```

### Grid

A flexible grid system for creating responsive layouts.

```tsx
import { Grid, GridItem } from '@/shared/features/layout/components/Grid';

function MyGrid() {
  return (
    <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      <GridItem>Item 1</GridItem>
      <GridItem>Item 2</GridItem>
      <GridItem>Item 3</GridItem>
    </Grid>
  );
}
```

### Stack

A component for arranging elements vertically or horizontally with consistent spacing.

```tsx
import { Stack } from '@/shared/features/layout/components/Stack';

function MyStack() {
  return (
    <Stack direction="column" spacing={4}>
      <div>First item</div>
      <div>Second item</div>
      <div>Third item</div>
    </Stack>
  );
}
```

### Box

A basic layout component that can be used as a container with customizable properties.

```tsx
import { Box } from '@/shared/features/layout/components/Box';

function MyBox() {
  return (
    <Box 
      padding={4} 
      margin={2} 
      borderRadius="md" 
      backgroundColor="primary.100"
    >
      Content in a box
    </Box>
  );
}
```

## Hooks

### useBreakpoint

A hook for accessing the current breakpoint.

```tsx
import { useBreakpoint } from '@/shared/features/layout/hooks/useBreakpoint';

function MyComponent() {
  const breakpoint = useBreakpoint();
  
  return (
    <div>
      Current breakpoint: {breakpoint}
    </div>
  );
}
```

### useMediaQuery

A hook for responding to media queries.

```tsx
import { useMediaQuery } from '@/shared/features/layout/hooks/useMediaQuery';

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      {isMobile ? 'Mobile View' : 'Desktop View'}
    </div>
  );
}
```

## Types

### Breakpoint

```typescript
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
```

### ContainerProps

```typescript
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string | number;
  padding?: string | number;
  className?: string;
}
```

### GridProps

```typescript
interface GridProps {
  children: React.ReactNode;
  columns?: number | Record<Breakpoint, number>;
  gap?: number | string;
  className?: string;
}
```

## Dependencies

- `react`: For React components and hooks
- `@heroui/react`: For UI components
- `framer-motion`: For animations

## Usage Notes

- Layout components are designed to be responsive and accessible
- Use the Grid component for complex layouts
- Use the Stack component for simple vertical or horizontal arrangements
- Use the Box component for custom containers with specific styling
- Use layout hooks to create responsive components 