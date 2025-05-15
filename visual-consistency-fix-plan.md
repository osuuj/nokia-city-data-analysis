# Step-by-Step Plan to Fix Visual Inconsistencies

## Phase 1: Analysis & Understanding Current Implementation

### Step 1: Analyze Theme Implementation
- **Current approach**: Using a `ThemeProvider` with attribute 'data-theme' and a script for initialization 
- **Issue**: Possible delay between HTML render and theme application causing flash
- **Key files**: 
  - `app/layout.tsx` (Script tag with theme initialization)
  - `shared/providers/AppProviders.tsx` (Theme providers)

### Step 2: Examine Layout Structure & Transitions
- **Current approach**: Using `ConditionalLayout` with conditional header/footer rendering
- **Issue**: Completely removing elements rather than hiding them causes layout shifts
- **Key files**:
  - `shared/components/layout/ConditionalLayout.tsx`
  - `app/dashboard/layout.tsx`
  - `shared/components/layout/PageTransition.tsx`

### Step 3: Review Loading & Suspense Implementation
- **Current approach**: Using Suspense with fallbacks throughout the app
- **Issue**: Fallbacks may not maintain consistent background/styling
- **Key files**:
  - Various components using Suspense
  - `shared/components/loading/ResponsiveLoading.tsx`

### Step 4: Analyze CSS/Background Application
- **Current approach**: Applying background classes at component level
- **Issue**: Background may not be applied early enough or consistently
- **Key files**:
  - `shared/styles/globals.css`
  - `shared/styles/critical.css`

## Phase 2: Implementation Plan

### Step 5: Optimize Theme Script (Priority: High)
- Move theme script higher in head
- Add immediate background color to body
- Ensure it runs before any content renders

### Step 6: Fix Global CSS Background (Priority: High)
- Add background-color defaults to html/body in global CSS
- Add transition properties for smooth theme changes

### Step 7: Refactor ConditionalLayout (Priority: Medium)
- Change to visibility hiding rather than component unmounting
- Maintain layout structure while toggling visual display

### Step 8: Improve Suspense Fallbacks (Priority: Medium)
- Ensure all fallbacks have bg-background class
- Standardize loading indicators across the app

### Step 9: Enhance PageTransition Component (Priority: Low)
- Add motion effects for smooth transitions between routes
- Maintain background color during transitions

### Step 10: Validate and Test (Priority: High)
- Test all routes with transitions
- Check both light and dark mode
- Validate on mobile and desktop

## Phase 3: Implementation Details

### Theme Script Optimization

```tsx
// In app/layout.tsx - Move this higher in <head>
<Script id="theme-loader" strategy="beforeInteractive">
  {`
    (function() {
      try {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const savedTheme = localStorage.getItem('theme');
        const finalTheme = savedTheme || systemTheme;
        document.documentElement.setAttribute('data-theme', finalTheme);
        // Also add a background color immediately
        document.body.style.backgroundColor = finalTheme === 'dark' ? '#0f0f0f' : '#ffffff';
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  `}
</Script>
```

### Global CSS Background Fix

```css
/* In shared/styles/globals.css */
html, body {
  @apply min-h-screen bg-background transition-colors duration-300;
}
```

### ConditionalLayout Refactoring

```tsx
export const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard') ?? false;

  return (
    <PageTransition>
      <Header className={isDashboardPage ? 'hidden' : ''} />
      <main className={isDashboardPage ? 'dashboard-main' : 'content-main'}>{children}</main>
      <Footer className={isDashboardPage ? 'hidden' : ''} />
    </PageTransition>
  );
};
```

### Suspense Fallback Standardization

```tsx
<Suspense fallback={
  <div className="flex h-full w-full items-center justify-center bg-background">
    <LoadingSpinner showText text="Loading..." />
  </div>
}>
  {children}
</Suspense>
```

### PageTransition Enhancement

```tsx
// In PageTransition.tsx
'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-screen bg-background"
    >
      {children}
    </motion.div>
  );
}
``` 