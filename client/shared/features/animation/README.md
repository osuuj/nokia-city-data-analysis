# Animation Feature

This feature provides animation components and utilities for creating smooth, performant animations in the application.

## Directory Structure

- `components/`: React components for animations
- `hooks/`: Custom React hooks for animation logic
- `utils/`: Utility functions for animation calculations
- `types/`: TypeScript type definitions for animations

## Components

### Animate

A component for creating simple animations with configurable properties.

```tsx
import { Animate } from '@/shared/features/animation/components/Animate';

function MyAnimatedComponent() {
  return (
    <Animate 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div>Animated content</div>
    </Animate>
  );
}
```

### FadeIn

A component for creating fade-in animations.

```tsx
import { FadeIn } from '@/shared/features/animation/components/FadeIn';

function MyFadeInComponent() {
  return (
    <FadeIn duration={0.5} delay={0.2}>
      <div>Content that fades in</div>
    </FadeIn>
  );
}
```

### SlideIn

A component for creating slide-in animations.

```tsx
import { SlideIn } from '@/shared/features/animation/components/SlideIn';

function MySlideInComponent() {
  return (
    <SlideIn direction="right" duration={0.5}>
      <div>Content that slides in from the right</div>
    </SlideIn>
  );
}
```

### ScaleIn

A component for creating scale-in animations.

```tsx
import { ScaleIn } from '@/shared/features/animation/components/ScaleIn';

function MyScaleInComponent() {
  return (
    <ScaleIn duration={0.5} scale={1.2}>
      <div>Content that scales in</div>
    </ScaleIn>
  );
}
```

## Hooks

### useAnimation

A hook for creating custom animations.

```tsx
import { useAnimation } from '@/shared/features/animation/hooks/useAnimation';

function MyCustomAnimation() {
  const { ref, inView } = useAnimation({
    threshold: 0.5,
    triggerOnce: true
  });
  
  return (
    <div ref={ref}>
      {inView ? 'Element is in view' : 'Element is out of view'}
    </div>
  );
}
```

### useScrollAnimation

A hook for creating scroll-based animations.

```tsx
import { useScrollAnimation } from '@/shared/features/animation/hooks/useScrollAnimation';

function MyScrollAnimation() {
  const { ref, progress } = useScrollAnimation();
  
  return (
    <div ref={ref} style={{ opacity: progress }}>
      Content that animates based on scroll position
    </div>
  );
}
```

## Types

### AnimationProps

```typescript
interface AnimationProps {
  children: React.ReactNode;
  initial?: Record<string, number | string>;
  animate?: Record<string, number | string>;
  exit?: Record<string, number | string>;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
  };
  className?: string;
}
```

### FadeInProps

```typescript
interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}
```

### SlideInProps

```typescript
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  className?: string;
}
```

### ScaleInProps

```typescript
interface ScaleInProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  delay?: number;
  className?: string;
}
```

## Dependencies

- `react`: For React components and hooks
- `framer-motion`: For animation capabilities
- `react-intersection-observer`: For scroll-based animations

## Usage Notes

- Animation components are designed to be performant and accessible
- Use the Animate component for custom animations
- Use specialized components (FadeIn, SlideIn, ScaleIn) for common animation patterns
- Use animation hooks for more complex animation logic
- Consider reducing motion for users who prefer reduced motion
- Test animations on different devices and browsers 