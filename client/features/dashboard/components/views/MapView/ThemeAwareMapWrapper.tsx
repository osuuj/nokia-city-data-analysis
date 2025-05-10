'use client';

import { useMapTheme } from '@/features/dashboard/hooks/useMapTheme';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

interface ThemeAwareMapWrapperProps {
  children: ReactNode;
  onThemeChange?: (isDark: boolean) => void;
}

/**
 * ThemeAwareMapWrapper
 * Forces map to remount when theme changes to ensure proper style application
 * This is necessary because Mapbox GL doesn't support runtime style switching
 */
export const ThemeAwareMapWrapper = ({ children, onThemeChange }: ThemeAwareMapWrapperProps) => {
  const { isDark } = useMapTheme();
  // Don't use Date.now() in the key as it causes unnecessary remounts
  // Instead use a stable key per theme that won't change on re-renders
  const [key, setKey] = useState(`map-${isDark ? 'dark' : 'light'}`);

  // Track theme change status to coordinate with MapView
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  // Create a stable event handler that can be properly cleaned up
  const handleThemeChange = useCallback(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newIsDark = theme === 'dark';

    // Only change the key if the theme actually changed
    const newKey = `map-${newIsDark ? 'dark' : 'light'}`;
    if (newKey !== key) {
      console.log('Map wrapper detected theme change, updating map', {
        theme,
        oldKey: key,
        newKey,
      });

      // Signal that theme is changing before the remount
      setIsChangingTheme(true);

      // First notify the parent component about theme change
      if (onThemeChange) {
        onThemeChange(newIsDark);
      }

      // Then update the key to force remount
      setKey(newKey);

      // Signal theme change is complete
      setTimeout(() => {
        setIsChangingTheme(false);
      }, 50);
    }
  }, [key, onThemeChange]);

  // Listen for theme change events to force remount
  useEffect(() => {
    // Add event listeners for both custom theme events and localStorage changes
    document.addEventListener('themechange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    // Clean up listeners on unmount
    return () => {
      document.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [handleThemeChange]);

  // Update key when isDark changes from hook (direct theme system changes)
  useEffect(() => {
    const newKey = `map-${isDark ? 'dark' : 'light'}`;

    // Only update if the key actually changes
    if (newKey !== key) {
      console.log('Map theme changed from hook, updating map', {
        isDark,
        oldKey: key,
        newKey,
      });

      // Signal that theme is changing
      setIsChangingTheme(true);

      // First notify parent about theme change
      if (onThemeChange) {
        onThemeChange(isDark);
      }

      // Then update the key
      setKey(newKey);

      // Signal theme change is complete
      setTimeout(() => {
        setIsChangingTheme(false);
      }, 50);
    }
  }, [isDark, onThemeChange, key]);

  return (
    <div
      key={key}
      className="w-full h-full"
      data-theme-changing={isChangingTheme ? 'true' : 'false'}
    >
      {children}
    </div>
  );
};
