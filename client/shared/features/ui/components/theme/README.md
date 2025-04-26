# Theme Components

This directory contains components related to theme switching functionality.

## Components

### ThemeSwitch

A basic theme toggle button component that switches between light and dark themes.

```tsx
import { ThemeSwitch } from './theme';

// Basic usage
<ThemeSwitch />

// With custom className
<ThemeSwitch className="custom-class" />
```

### ThemeSwitcher

A wrapper component that provides theme switching functionality. This component can be extended with additional features like animations or tooltips.

```tsx
import { ThemeSwitcher } from './theme';

// Basic usage
<ThemeSwitcher />
```

## Dependencies

- `next-themes`: For theme management
- `@heroui/react`: For UI components
- `clsx`: For conditional class name composition

## Usage Notes

- Both components are client-side only (marked with 'use client')
- The components handle SSR by showing a placeholder during server-side rendering
- Theme state is persisted in localStorage
- The components use the system theme by default 