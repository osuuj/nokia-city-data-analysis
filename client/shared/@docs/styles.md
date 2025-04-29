# Shared Styles

This file provides documentation for the global styles in the `client/shared/styles` directory.

## Directory Structure

```
styles/
├── base/            # Base styles and resets
│   ├── globals.css
│   └── index.ts
├── utilities/       # Utility classes
│   ├── animations.css
│   └── index.ts
└── index.ts        # Main export file
```

## Global Styles

The global styles in `globals.css` include:
- Tailwind CSS directives
- External styles (like Mapbox)
- Custom CSS variables and utility classes

### Import External Styles

```css
/* Import external styles */
@import 'mapbox-gl/dist/mapbox-gl.css';
```

### Tailwind CSS Directives

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

If you're seeing linter errors with @tailwind directives:
1. Add the VS Code CSS Validation extension or similar
2. Add a .vscode/settings.json file with this setting:
```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

## Usage

To use global styles, import them at the application level:

```typescript
// In your app entry point
import '@/shared/styles';
```

## Custom Utilities

You can define custom utilities that build on top of Tailwind:

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## Theme Variables

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

## Best Practices

1. **Use Tailwind Classes**
   - Prefer Tailwind utility classes over custom CSS
   - Use the `cn()` utility for conditional classNames

2. **CSS Variables**
   - Use CSS variables for theming
   - Define variables at the `:root` level

3. **Avoid Global Styles**
   - Minimize global style declarations
   - Use component-level styles when possible

4. **Organization**
   - Keep base styles separate from utilities
   - Document custom utilities and extensions 