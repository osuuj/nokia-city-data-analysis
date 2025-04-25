# Global Styles

This directory contains global styles and CSS utilities used across the application.

## Directory Structure

```
styles/
├── base/           # Base styles and global CSS imports
│   ├── globals.css
│   └── index.ts
├── utilities/      # Utility styles and custom CSS utilities
│   ├── utilities.css
│   └── index.ts
├── components/     # Component-specific styles
│   └── index.ts
└── index.ts       # Main export file
```

## Style Categories

### Base Styles

The base styles include:
- Tailwind CSS base styles
- External CSS imports (e.g., Mapbox GL)
- Global CSS reset and defaults

```css
/* globals.css */
@import 'mapbox-gl/dist/mapbox-gl.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Utility Styles

Custom utility classes for common styling needs:

```css
/* utilities.css */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Responsive utilities */
@layer utilities {
  @media (min-width: 480px) {
    .xs\:block { display: block; }
    .xs\:hidden { display: none; }
    .xs\:w-8 { width: 2rem; }
    .xs\:h-8 { height: 2rem; }
    .xs\:gap-1 { gap: 0.25rem; }
    .xs\:text-sm { font-size: 0.875rem; }
  }
}
```

### Component Styles

Component-specific styles should be placed in the components directory using CSS modules:

```css
/* components/Button.module.css */
.button {
  @apply px-4 py-2 rounded-md;
}

.primary {
  @apply bg-blue-500 text-white;
}

.secondary {
  @apply bg-gray-200 text-gray-800;
}
```

## Usage Examples

### Using Utility Classes

```tsx
function ScrollableContent() {
  return (
    <div className="scrollbar-hide overflow-y-auto">
      {/* Content */}
    </div>
  );
}
```

### Using Responsive Utilities

```tsx
function ResponsiveComponent() {
  return (
    <div className="hidden xs:block">
      {/* Content visible on xs screens and up */}
    </div>
  );
}
```

### Using Component Styles

```tsx
import styles from './Button.module.css';

function Button({ variant = 'primary' }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      Click me
    </button>
  );
}
```

## Best Practices

1. **CSS Organization**
   - Use Tailwind CSS for utility classes
   - Create custom utilities for repeated patterns
   - Use CSS modules for component-specific styles

2. **Responsive Design**
   - Use Tailwind's responsive prefixes
   - Create custom breakpoints when needed
   - Test on all target devices

3. **Performance**
   - Minimize CSS bundle size
   - Use CSS modules to prevent style conflicts
   - Leverage Tailwind's purge feature

4. **Maintainability**
   - Follow a consistent naming convention
   - Document custom utilities
   - Keep component styles scoped

## Contributing

When adding new styles:
1. Place them in the appropriate directory
2. Use CSS modules for component styles
3. Document any new utility classes
4. Add usage examples to this README
5. Test across different screen sizes 