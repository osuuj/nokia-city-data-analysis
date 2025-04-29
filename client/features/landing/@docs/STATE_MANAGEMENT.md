# Landing Feature State Management

This document outlines the state management patterns used in the landing feature, including component state, hooks, and data flow.

## Table of Contents

- [Overview](#overview)
- [Component State](#component-state)
- [Custom Hooks](#custom-hooks)
- [Data Flow](#data-flow)
- [Performance Considerations](#performance-considerations)

## Overview

The landing feature uses a combination of React's built-in state management capabilities and custom hooks to manage state efficiently. The architecture follows a component-based approach with local state management where appropriate.

## Component State

### Hero Component

The `Hero` component manages several pieces of state:

- `isLoading`: Boolean state to track loading status
- `videoError`: Boolean state to track video loading errors
- `shouldNavigate`: Boolean state to track navigation intent
- `isClient`: Boolean state to track client-side rendering
- `mounted`: Boolean state to track component mount status

```tsx
const [isLoading, setIsLoading] = useState(true);
const [videoError, setVideoError] = useState(false);
const [shouldNavigate, setShouldNavigate] = useState(false);
const [isClient, setIsClient] = useState(false);
const [mounted, setMounted] = useState(false);
```

### HeroVideo Component

The `HeroVideo` component manages:

- Video element reference using `useRef`
- Video loading and error states through props
- Video playback state

```tsx
const videoRef = useRef<HTMLVideoElement>(null);
```

### HeroContent Component

The `HeroContent` component receives state as props:

- `isLoading`: Boolean prop for loading state
- `videoError`: Boolean prop for video error state
- `onStartExploring`: Callback function for the CTA button

## Custom Hooks

### useHeroAnimation

A custom hook for managing animations:

```tsx
const useHeroAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return {
    isVisible,
    isLoaded,
    fadeInClass: isVisible ? 'opacity-100' : 'opacity-0',
    slideUpClass: isVisible ? 'translate-y-0' : 'translate-y-8',
    scaleInClass: isVisible ? 'scale-100' : 'scale-95',
    transitionClass: 'transition-all duration-700 ease-out',
    fadeInUpClass: `${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 ease-out`,
    fadeInScaleClass: `${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 ease-out`,
  };
};
```

## Data Flow

The landing feature follows a unidirectional data flow pattern:

1. **State Initialization**: State is initialized at the component level
2. **State Updates**: State is updated through event handlers or effects
3. **Prop Passing**: State is passed down to child components as props
4. **Event Handling**: Child components trigger events that update parent state

Example data flow in the Hero component:

```
Hero (Parent)
  ├── State: isLoading, videoError, shouldNavigate, isClient, mounted
  ├── HeroVideo (Child)
  │     ├── Props: onVideoError
  │     └── Events: videoError
  └── HeroContent (Child)
        ├── Props: isLoading, videoError, onStartExploring
        └── Events: startExploring
```

## Performance Considerations

### Memoization

Components and callbacks are memoized to prevent unnecessary re-renders:

```tsx
// Memoized callback
const handleStartExploring = useCallback(() => {
  onStartExploring();
}, [onStartExploring]);
```

### Lazy Loading

Components are lazy loaded to improve initial load performance:

```tsx
const HeroContent = lazy(() => import('./HeroContent'));
const HeroVideo = lazy(() => import('./HeroVideo'));
```

### State Updates

State updates are batched and optimized:

```tsx
// Batch state updates
const handleVideoError = useCallback(() => {
  setVideoError(true);
  setIsLoading(false);
}, []);
```

## Best Practices

1. **Local State**: Use local component state for UI-specific state
2. **Custom Hooks**: Extract reusable state logic into custom hooks
3. **Prop Drilling**: Avoid excessive prop drilling by using composition
4. **Memoization**: Memoize components and callbacks to prevent unnecessary re-renders
5. **Error Boundaries**: Use error boundaries to catch and handle errors gracefully
6. **Loading States**: Provide loading states for asynchronous operations
7. **Type Safety**: Use TypeScript for type-safe state management
8. **Cleanup**: Properly clean up effects and event listeners

## Conclusion

The landing feature's state management approach balances simplicity and performance. By using React's built-in state management capabilities and custom hooks, we've created a maintainable and efficient architecture that scales well with the application's needs. 