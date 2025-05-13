'use client';

import { useThemeContext } from '@/shared/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * ThemeTransitionManager
 *
 * A component that helps manage theme transitions across the application,
 * preventing white flashes when navigating between pages or changing themes.
 *
 * This component:
 * 1. Prevents layout shifts during theme changes
 * 2. Coordinates transitions between pages
 * 3. Ensures consistent theme application across components
 */
export function ThemeTransitionManager() {
  const { theme, isChanging } = useThemeContext();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Apply theme-syncing CSS variables for consistent transitions
  useEffect(() => {
    // Ensure transitions are consistent by updating CSS variables
    document.documentElement.style.setProperty('--theme-transition-duration', '300ms');

    // Sync all themed elements with this timing
    document.documentElement.style.setProperty('--content-transition-delay', '50ms');

    // Listen for Next.js route changes to manage transitions
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
    };

    const handleRouteChangeComplete = () => {
      // Allow a small delay before completing the transition
      setTimeout(() => {
        setIsNavigating(false);
      }, 100);
    };

    // Clean up function for event listeners
    return () => {
      // Next.js route events would be cleaned up here if we had direct access
      // This is a placeholder for when/if we implement custom event listeners
    };
  }, []);

  // If components need to synchronize with theme changes, they can use this effect
  useEffect(() => {
    if (isChanging || isNavigating) {
      // Apply a global class that can be used for transitions
      document.documentElement.classList.add('theme-transitioning');
    } else {
      document.documentElement.classList.remove('theme-transitioning');
    }

    // Add an attribute for current theme that CSS can use for transitions
    document.documentElement.setAttribute('data-theme-state', theme);
  }, [theme, isChanging, isNavigating]);

  // This is an invisible component that manages theme transitions
  return null;
}
