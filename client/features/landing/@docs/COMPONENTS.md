# Landing Feature Components Documentation

This document provides detailed information about the components used in the landing feature, including their purpose, usage, and implementation details.

## Table of Contents

- [Hero](#hero)
- [HeroContent](#herocontent)
- [HeroVideo](#herovideo)
- [HeroSkeleton](#heroskeleton)
- [ButtonStart](#buttonstart)
- [LandingErrorBoundary](#landingerrorboundary)

## Hero

The `Hero` component is the main component of the landing feature. It displays a fullscreen landing section with background video, heading text, description, and a call-to-action button.

### Features

- Background video with fallback
- Responsive design
- Loading states
- Error handling
- Call-to-action button
- Dark mode support

### Usage

```tsx
import { Hero } from '@/features/landing';

const LandingPage = () => {
  return <Hero />;
};
```

### Implementation Details

The `Hero` component is composed of smaller components:
- `HeroVideo`: Handles the video background
- `HeroContent`: Displays the content (heading, description, button)

It uses React's `Suspense` and `lazy` for code splitting and performance optimization.

## HeroContent

The `HeroContent` component displays the content of the Hero section, including heading text, description, and a call-to-action button.

### Features

- Responsive design
- Loading states
- Call-to-action button
- Dark mode support

### Usage

```tsx
import { HeroContent } from '@/features/landing';

const MyComponent = () => {
  return (
    <HeroContent 
      isLoading={false} 
      videoError={false} 
      onStartExploring={() => console.log('Start exploring')} 
    />
  );
};
```

### Implementation Details

The `HeroContent` component uses the `Card` component from HeroUI for styling and the `ButtonStart` component for the call-to-action button.

## HeroVideo

The `HeroVideo` component displays a video background for the Hero section.

### Features

- Video background with fallback
- Error handling
- Loading states

### Usage

```tsx
import { HeroVideo } from '@/features/landing';

const MyComponent = () => {
  return <HeroVideo onVideoError={() => console.log('Video error')} />;
};
```

### Implementation Details

The `HeroVideo` component handles video loading and errors. It uses the `useRef` and `useEffect` hooks to manage the video element and event listeners.

## HeroSkeleton

The `HeroSkeleton` component is a loading skeleton that mimics the structure of the `Hero` component. It's used as a fallback during the loading state of the `Hero` component.

### Features

- Mimics the structure of Hero
- Responsive design
- Dark mode support

### Usage

```tsx
import { HeroSkeleton } from '@/features/landing';

const MyComponent = () => {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <Hero />
    </Suspense>
  );
};
```

### Implementation Details

The `HeroSkeleton` component uses the `Skeleton` component from HeroUI to create placeholder elements that match the structure of the `Hero` component.

## ButtonStart

The `ButtonStart` component is a call-to-action button used in the Hero section.

### Features

- Support for internal and external links
- Customization options (label, className)
- Responsive design
- Dark mode support

### Usage

```tsx
import { ButtonStart } from '@/features/landing';

const MyComponent = () => {
  return (
    <ButtonStart
      label="Start Exploring"
      href="/dashboard"
      onPress={() => console.log('Button clicked')}
    />
  );
};
```

### Implementation Details

The `ButtonStart` component uses the `Button` component from HeroUI for styling and supports both internal (Next.js) and external links.

## LandingErrorBoundary

The `LandingErrorBoundary` component is an error boundary for the landing feature. It catches and handles errors that occur within the landing components and provides a fallback UI.

### Features

- Error catching and handling
- Fallback UI for errors
- Error reporting
- Reset functionality

### Usage

```tsx
import { LandingErrorBoundary } from '@/features/landing';

const MyComponent = () => {
  return (
    <LandingErrorBoundary>
      <Hero />
    </LandingErrorBoundary>
  );
};
```

### Implementation Details

The `LandingErrorBoundary` component extends `React.Component` and implements the error boundary lifecycle methods. It provides a fallback UI when errors occur and includes a reset button to recover from errors.

## Component Relationships

The components in the landing feature work together as follows:

1. `Hero` is the main container component that integrates all other components.
2. `HeroVideo` provides the video background.
3. `HeroContent` displays the content (heading, description, button).
4. `HeroSkeleton` provides a loading state for the `Hero` component.
5. `ButtonStart` is used for the call-to-action button.
6. `LandingErrorBoundary` catches and handles errors that occur within the landing components.

This architecture ensures a robust, accessible, and user-friendly landing page with proper error handling and loading states. 