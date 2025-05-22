# Landing Feature

The Landing feature provides the homepage and entry point for the Nokia City Data Analysis application, featuring an engaging hero section with video background and animated elements.

## Overview

- **Hero Section**: Visually engaging hero section with animated content
- **Video Background**: Autoplay background video with fallback
- **Animated Content**: Subtle animations for improved UX
- **Call-to-Action**: Primary button to guide users to the dashboard
- **Loading States**: Skeleton loaders for smooth experience
- **Error Handling**: Dedicated error boundary for reliability

## Directory Structure

```
client/features/landing/
├── components/               # UI components
│   ├── Hero/                 # Hero section components
│   │   ├── Hero.tsx          # Main hero component
│   │   ├── HeroContent.tsx   # Content overlay
│   │   ├── HeroVideo.tsx     # Video background
│   │   ├── HeroSkeleton.tsx  # Loading skeleton
│   │   └── index.ts          # Component exports
│   ├── ButtonStart.tsx       # CTA button component
│   ├── LandingErrorBoundary.tsx # Error boundary
│   └── index.ts              # Component exports
├── hooks/                    # Custom React hooks
│   ├── useHeroAnimation.ts   # Animation hook
│   └── index.ts              # Hook exports
├── types/                    # TypeScript types
│   └── index.ts              # Type definitions
└── index.ts                  # Feature exports
```

## Key Components

### Main Components

- **Hero**: Main hero component with background video and animated content
- **HeroContent**: Text and button overlay with animations
- **ButtonStart**: Call to action button to enter the application
- **LandingErrorBoundary**: Error boundary for the landing page

### UI Components

- **HeroVideo**: Video background with performance optimization
- **HeroSkeleton**: Loading state for the hero section

## Component Hierarchy

```
LandingPage
├── LandingErrorBoundary
│   └── Hero
│       ├── HeroVideo
│       └── HeroContent
│           └── ButtonStart
```

## Shared Component Usage

The Landing feature leverages several shared components:

```tsx
// Background and theme
import { TransitionBackground } from '@/shared/components/ui/background';
import { gradientColors } from '@/shared/utils/backgroundConfig';

// Loading components
import { HeaderSectionSkeleton } from '@/shared/components/loading';

// Error handling
import { ErrorDisplay } from '@/shared/components/error';
```

## Data Management

The Landing feature primarily focuses on presentation, with minimal data requirements:

```tsx
import { useHeroAnimation } from '@/features/landing/hooks';

function HeroContent() {
  const { 
    titleRef,
    subtitleRef,
    buttonRef,
    isAnimationComplete
  } = useHeroAnimation();
  
  // Component implementation with refs
}
```

## Core Types

```typescript
export interface HeroProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  videoSrc?: string;
  fallbackImageSrc?: string;
}

export interface AnimationState {
  isVisible: boolean;
  hasAnimated: boolean;
}
```

## Usage Examples

### Basic Hero Section

```tsx
import { Hero } from '@/features/landing/components/Hero';

function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero 
        title="Nokia City Data Analysis"
        subtitle="Visualize and analyze city business data with interactive tools"
        buttonText="Explore Dashboard"
        videoSrc="/videos/city-aerial.mp4"
        fallbackImageSrc="/images/city-aerial-fallback.jpg"
      />
    </main>
  );
}
```

### Customized Hero with Animation

```tsx
import { Hero, HeroContent } from '@/features/landing/components/Hero';
import { useHeroAnimation } from '@/features/landing/hooks';

function CustomLandingHero() {
  const { titleRef, subtitleRef, buttonRef } = useHeroAnimation();
  
  return (
    <Hero videoSrc="/videos/background.mp4">
      <HeroContent
        titleRef={titleRef}
        subtitleRef={subtitleRef}
        buttonRef={buttonRef}
        customContent={
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold">Custom Content</h2>
          </div>
        }
      />
    </Hero>
  );
}
```

## Best Practices

1. **Performance**
   - Use compressed video formats for the background
   - Implement lazy loading for the video component
   - Provide image fallbacks for slower connections
   - Optimize animations for performance

2. **Accessibility**
   - Ensure sufficient contrast for text over video
   - Provide descriptive button text
   - Implement keyboard navigation support
   - Use semantic HTML structure

3. **Responsiveness**
   - Adapt video and content layout for mobile devices
   - Adjust text size and spacing for different screens
   - Use appropriate loading states for all screen sizes

4. **Animation**
   - Use subtle animations that don't distract
   - Ensure animations complete quickly
   - Provide reduced motion option for accessibility 