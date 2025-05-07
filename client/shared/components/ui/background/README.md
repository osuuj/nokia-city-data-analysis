# Background Components

A collection of background components that provide consistent styling and behavior across the application.

## Components

### AnimatedBackground

A background component with animated gradient effects.

```tsx
import { AnimatedBackground } from '@/shared/components/ui/background';

export function MyPage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground priority="high" />
      <div className="relative z-10 p-6">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `priority` | 'high' \| 'low' | 'low' | Visual priority - 'high' for important UI |
| `className` | string | '' | Additional class names |

### StaticBackground

A non-animated background for pages where animation would be distracting.

```tsx
import { StaticBackground } from '@/shared/components/ui/background';

export function MyStaticPage() {
  return (
    <div className="relative min-h-screen">
      <StaticBackground showOverlay={true} />
      <div className="relative z-10 p-6">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `priority` | 'high' \| 'low' | 'low' | Visual priority of LCP content |
| `showOverlay` | boolean | true | Whether to show a semi-transparent overlay |
| `className` | string | '' | Additional class names |

### TransitionBackground

A background with fade-in transitions, perfect for loading states.

```tsx
import { TransitionBackground } from '@/shared/components/ui/background';

export function LoadingPage() {
  return (
    <TransitionBackground>
      <div className="p-6">
        {/* Loading content here */}
      </div>
    </TransitionBackground>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to render on top of the background |
| `className` | string | '' | Additional class name for container |
| `gradientDelay` | number | 300 | Delay (ms) before showing the gradient |
| `contentDelay` | number | 600 | Delay (ms) before showing content |
| `style` | CSSProperties | {} | Additional inline styles |
| `fadeFromBlack` | boolean | true | Whether to fade in from black |

## Shared Configuration

You can access the shared background configuration for customization:

```tsx
import { gradientColors, animationTiming } from '@/shared/components/ui/background';

// Custom component using the shared colors
function CustomBackground() {
  const isDark = true; // Or use theme context
  const colors = isDark ? gradientColors.dark : gradientColors.light;
  
  return (
    <div style={{
      background: `linear-gradient(45deg, ${colors.primary.start}, ${colors.primary.end})`,
      transition: `all ${animationTiming.duration.gradient}ms`
    }}>
      {/* Custom content */}
    </div>
  );
}
```

## Migration Guide

### Migrating from AnimatedBackgroundSkeleton

If you're using `AnimatedBackgroundSkeleton` from the loading components, migrate to `TransitionBackground`:

**Before:**
```tsx
import { AnimatedBackgroundSkeleton } from '@/shared/components/loading';

export function MyLoadingState() {
  return (
    <AnimatedBackgroundSkeleton>
      <div className="p-6">
        {/* Loading content */}
      </div>
    </AnimatedBackgroundSkeleton>
  );
}
```

**After:**
```tsx
import { TransitionBackground } from '@/shared/components/ui/background';

export function MyLoadingState() {
  return (
    <TransitionBackground>
      <div className="p-6">
        {/* Loading content */}
      </div>
    </TransitionBackground>
  );
}
```

### Migrating from ProjectSkeleton

If you're using background code in `ProjectGridSkeleton` or `ProjectDetailSkeleton`, migrate to `TransitionBackground`:

**Before:**
```tsx
// Complex background setup in ProjectGridSkeleton
const [showGradient, setShowGradient] = useState(false);
// ... more background setup code ...

// ... JSX with background divs ...
```

**After:**
```tsx
import { TransitionBackground } from '@/shared/components/ui/background';

<TransitionBackground>
  {/* Your skeleton content */}
</TransitionBackground>
``` 