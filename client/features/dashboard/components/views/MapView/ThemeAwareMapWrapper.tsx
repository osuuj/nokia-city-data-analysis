'use client';

import { useMapTheme } from '@/features/dashboard/hooks/useMapTheme';
import { type ReactNode, useEffect, useState } from 'react';

interface ThemeAwareMapWrapperProps {
  children: ReactNode;
}

/**
 * ThemeAwareMapWrapper
 * Forces map to remount when theme changes to ensure proper style application
 */
export const ThemeAwareMapWrapper = ({ children }: ThemeAwareMapWrapperProps) => {
  const { isDark } = useMapTheme();
  const [key, setKey] = useState(isDark ? 'dark-map' : 'light-map');

  // Listen for theme change events to force remount
  useEffect(() => {
    const handleThemeChange = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setKey(theme === 'dark' ? 'dark-map' : 'light-map');
      console.log('Map wrapper detected theme change, forcing remount', theme);
    };

    document.addEventListener('themechange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      document.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // Update key when isDark changes (from hook)
  useEffect(() => {
    setKey(isDark ? 'dark-map' : 'light-map');
  }, [isDark]);

  return (
    <div key={key} className="w-full h-full">
      {children}
    </div>
  );
};
