'use client';

import { useMapTheme } from '@/features/dashboard/hooks/useMapTheme';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

interface ThemeAwareMapWrapperProps {
  children: ReactNode;
}

/**
 * ThemeAwareMapWrapper
 * Forces map to remount when theme changes to ensure proper style application
 * This is necessary because Mapbox GL doesn't support runtime style switching
 */
export const ThemeAwareMapWrapper = ({ children }: ThemeAwareMapWrapperProps) => {
  const { isDark } = useMapTheme();
  const [key, setKey] = useState(`map-${isDark ? 'dark' : 'light'}-${Date.now()}`);

  // Create a stable event handler that can be properly cleaned up
  const handleThemeChange = useCallback(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newKey = `map-${theme === 'dark' ? 'dark' : 'light'}-${Date.now()}`;

    console.log('Map wrapper detected theme change, forcing remount', { theme, newKey });
    setKey(newKey);
  }, []);

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
    const newKey = `map-${isDark ? 'dark' : 'light'}-${Date.now()}`;
    console.log('Map theme changed from hook, forcing remount', { isDark, newKey });
    setKey(newKey);
  }, [isDark]);

  return (
    <div key={key} className="w-full h-full">
      {children}
    </div>
  );
};
