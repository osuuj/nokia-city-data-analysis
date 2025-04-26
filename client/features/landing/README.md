# Landing Feature

This feature contains components and functionality for the landing page of the application.

## Directory Structure

- `components/` - UI components for the landing page
  - `Hero/` - Hero section components
    - `Hero.tsx` - Main hero component
    - `HeroContent.tsx` - Hero content component
    - `HeroVideo.tsx` - Video background component
    - `HeroSkeleton.tsx` - Loading skeleton component
  - `Button/` - Button components
    - `ButtonStart.tsx` - Call-to-action button component
  - `LandingErrorBoundary.tsx` - Error boundary component
- `hooks/` - Custom React hooks
  - `useHeroAnimation.ts` - Animation management hook
- `types/` - TypeScript type definitions
- `docs/` - Documentation
  - `COMPONENTS.md` - Detailed component documentation
  - `STATE_MANAGEMENT.md` - State management patterns

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
  return (
    <ButtonStart
      label="Start Exploring"
      href="/dashboard"
      onPress={() => console.log('Button clicked')}
    />
  );
}
```

## Usage

Import components and hooks from the landing feature:

```tsx
import { Hero, ButtonStart, useHeroAnimation } from '@/features/landing';
```

## Best Practices

1. Keep components focused on a single responsibility
2. Use TypeScript for type safety
3. Follow the established directory structure
4. Document components with JSDoc comments
5. Test components thoroughly
6. Use error boundaries for graceful error handling
7. Implement loading states for better UX
8. Follow accessibility guidelines 