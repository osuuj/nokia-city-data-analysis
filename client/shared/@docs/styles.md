# Shared Styles

This file provides documentation for the global styles in the `client/shared/styles` directory.

## Directory Structure

```
styles/
├── base/            # Base styles and global CSS imports
│   ├── globals.css
│   └── index.ts
├── utilities/       # Utility styles and custom CSS utilities
│   ├── utilities.css
│   └── index.ts
├── components/      # Component-specific styles
│   └── index.ts
└── index.ts         # Main export file
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

If you're seeing linter errors with @tailwind directives:
1. Add the VS Code CSS Validation extension or similar
2. Add a `.vscode/settings.json` file with this setting:
```json
{
  "css.lint.unknownAtRules": "ignore"
}
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
  
  .text-balance {
    text-wrap: balance;
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

### Theme Variables

CSS variables for theming are defined in the base styles:

```css
:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

[data-theme="dark"] {
  --foreground-rgb: 255, 255, 255;
  --background-rgb: 0, 0, 0;
}
```

## Usage Examples

### Basic Usage

To use global styles, import them at the application level:

```typescript
// In your app entry point
import '@/shared/styles';
```

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
   - Minimize global style declarations

5. **CSS Variables**
   - Use CSS variables for theming
   - Define variables at the `:root` level

## Contributing

When adding new styles:
1. Place them in the appropriate directory
2. Use CSS modules for component styles
3. Document any new utility classes
4. Add usage examples to this documentation
5. Test across different screen sizes 