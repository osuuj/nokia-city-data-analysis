# Landing Feature

This feature contains components and functionality for the landing page of the application.

## Directory Structure

- `components/` - UI components for the landing page
  - `Hero/` - Hero section component
  - `Button/` - Button components
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `data/` - Data fetching functions
- `store/` - State management

## Components

### Hero

The Hero component displays a fullscreen landing section with background video, heading text, description, and a call-to-action button.

```tsx
import { Hero } from '@/features/landing';

function LandingPage() {
  return <Hero />;
}
```

### ButtonStart

A call-to-action button component used in the Hero section.

```tsx
import { ButtonStart } from '@/features/landing';

function MyComponent() {
  return <ButtonStart onClick={() => console.log('Button clicked')} />;
}
```

## Usage

Import components and utilities from the landing feature:

```tsx
import { Hero, ButtonStart } from '@/features/landing';
```

## Best Practices

1. Keep components focused on a single responsibility.
2. Use TypeScript for type safety.
3. Follow the established directory structure.
4. Document components with JSDoc comments.
5. Test components thoroughly. 