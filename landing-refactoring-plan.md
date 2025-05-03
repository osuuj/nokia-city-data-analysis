# Landing Feature Refactoring Plan

## Current Structure Analysis

The landing feature and related app files are split across:

- `/client/app/` - Next.js app router pages and layouts
  - `page.tsx` - Main landing page
  - `error.tsx` - Global error page
  - `layout.tsx` - Root layout
- `/client/features/landing/` - Landing feature components and logic

### App Structure
```
client/app/
  ├── page.tsx           - Main landing page (uses Hero component)
  ├── error.tsx          - Global error page
  └── layout.tsx         - Root layout for all pages
```

### Landing Feature Structure
```
client/features/landing/
  ├── components/        - UI components
  │   ├── Hero/          - Hero section components
  │   │   ├── Hero.tsx
  │   │   ├── HeroContent.tsx
  │   │   ├── HeroSkeleton.tsx
  │   │   ├── HeroVideo.tsx
  │   │   └── index.ts
  │   ├── Button/        - Custom button components
  │   │   ├── ButtonStart.tsx
  │   │   └── index.ts
  │   ├── LandingErrorBoundary.tsx
  │   └── index.ts
  ├── hooks/             - Custom hooks
  │   ├── useHeroAnimation.ts
  │   └── index.ts
  ├── types/             - Type definitions
  │   └── index.ts
  └── index.ts           - Feature exports
```

## Identified Issues

1. **Redundant Error Handling**: The `LandingErrorBoundary.tsx` duplicates functionality already available in the shared `ErrorBoundary` component used in layout.tsx
2. **Unnecessary Nesting**: Button component folder has only one component but its own index.ts
3. **Mixing Page-Specific and Reusable Components**: Current structure doesn't clearly separate page components from reusable UI components

## Recommended Changes

### 1. Simplify Error Handling

- **Remove `LandingErrorBoundary.tsx`** and use the shared `ErrorBoundary` component directly in page.tsx
- Update page.tsx to use the global error boundary from shared components

### 2. Flatten Component Structure

- **Consolidate Button folder** if it contains only one component
- Consider moving `ButtonStart.tsx` to shared components if it's used across features

### 3. Clean Directory Structure

- **Refactor Hero components** to better separate responsibilities
- Ensure the landing page directly imports what it needs without unnecessary indirection

## Action Items

- [x] Remove `LandingErrorBoundary.tsx` and update imports
- [x] Move `ButtonStart.tsx` to components directory
- [x] Remove Button folder since it only contained one component
- [x] Update app/page.tsx to use the shared ErrorBoundary component
- [x] Update imports in affected files
- [x] Clean up exports in index.ts files

## Progress Update

- **✅ Removed redundant error handling**: `LandingErrorBoundary.tsx` has been deleted
- **✅ Flattened component structure**: Moved `ButtonStart.tsx` directly to components folder
- **✅ Removed Button directory**: Simplified directory structure
- **✅ Updated page.tsx**: Now uses shared ErrorBoundary component
- **✅ Updated imports**: Fixed all import paths for ButtonStart
- **✅ Simplified structure**: Reduced unnecessary nesting and improved organization

## Current Structure

```
client/app/
  ├── page.tsx           - Main landing page with simplified imports
  ├── error.tsx          - Global error page
  └── layout.tsx         - Root layout with ErrorBoundary
```

```
client/features/landing/
  ├── components/        - UI components
  │   ├── Hero/          - Hero section components
  │   │   ├── Hero.tsx
  │   │   ├── HeroContent.tsx
  │   │   ├── HeroSkeleton.tsx
  │   │   ├── HeroVideo.tsx
  │   │   └── index.ts
  │   ├── ButtonStart.tsx - Moved to top level of components
  │   └── index.ts
  ├── hooks/             - Custom hooks
  │   ├── useHeroAnimation.ts
  │   └── index.ts
  └── types/             - Type definitions
      └── index.ts
```

This structure creates a cleaner separation between the app's routing concerns and the reusable landing feature components, reducing redundancy and simplifying the codebase. 