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
  // Use a more specific key with timestamp to guarantee remount
  const [key, setKey] = useState(`map-${isDark ? 'dark' : 'light'}-${Date.now()}`);
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  // State to completely unmount and remount children during theme changes
  const [showChildren, setShowChildren] = useState(true);

  // Enhanced theme change handler with complete unmount-remount cycle
  const handleThemeChange = useCallback(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newIsDark = theme === 'dark';
    const newKey = `map-${newIsDark ? 'dark' : 'light'}-${Date.now()}`;

    if ((newIsDark && !isDark) || (!newIsDark && isDark)) {
      console.log('ThemeWrapper: Theme change detected, forcing complete remount');

      // First signal the change is happening
      setIsChangingTheme(true);

      // Notify parent component before any DOM changes
      if (onThemeChange) {
        onThemeChange(newIsDark);
      }

      // CRITICAL: Fully unmount children first
      setShowChildren(false);

      // After a short delay, update the key and remount
      setTimeout(() => {
        // Update the key to ensure complete remount
        setKey(newKey);

        // Remount children
        setTimeout(() => {
          setShowChildren(true);

          // After children have remounted, complete the theme change
          setTimeout(() => {
            setIsChangingTheme(false);
          }, 100);
        }, 50);
      }, 50);
    }
  }, [isDark, onThemeChange]);

  // Listen for theme change events
  useEffect(() => {
    document.addEventListener('themechange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      document.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [handleThemeChange]);

  // Handle direct theme changes from the theme hook
  useEffect(() => {
    const newKey = `map-${isDark ? 'dark' : 'light'}-${Date.now()}`;
    const currentTheme = key.includes('dark') ? 'dark' : 'light';
    const newTheme = isDark ? 'dark' : 'light';

    if (currentTheme !== newTheme) {
      console.log('ThemeWrapper: Direct theme change detected from hook', {
        currentTheme,
        newTheme,
      });

      // Signal change is happening
      setIsChangingTheme(true);

      // Notify parent
      if (onThemeChange) {
        onThemeChange(isDark);
      }

      // Unmount children completely
      setShowChildren(false);

      // After a short delay, update key and remount
      setTimeout(() => {
        setKey(newKey);

        setTimeout(() => {
          setShowChildren(true);

          setTimeout(() => {
            setIsChangingTheme(false);
          }, 100);
        }, 50);
      }, 50);
    }
  }, [isDark, key, onThemeChange]);

  return (
    <div
      key={key}
      className="w-full h-full"
      data-theme-changing={isChangingTheme ? 'true' : 'false'}
      data-theme={isDark ? 'dark' : 'light'}
    >
      {showChildren ? (
        children
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-sm text-default-500">Loading map...</div>
        </div>
      )}
    </div>
  );
};
