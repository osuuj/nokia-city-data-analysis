'use client';

import { Button } from '@heroui/react';
import { MoonFilledIcon, SunFilledIcon } from '@shared/icons';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { type FC, useCallback, useEffect, useState } from 'react';

/**
 * Props for the ThemeSwitchFix component.
 */
export interface ThemeSwitchFixProps {
  /** Optional class name for styling */
  className?: string;
}

/**
 * ThemeSwitchFix Component - Simplified version that directly manipulates DOM
 */
export const ThemeSwitchFix: FC<ThemeSwitchFixProps> = ({ className }) => {
  // State to track theme
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme(); // Access next-themes to keep it in sync

  // Ultra-simple direct DOM manipulation approach
  const applyTheme = useCallback(
    (theme: 'light' | 'dark') => {
      // Update DOM attributes
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);

      // Store in localStorage
      localStorage.setItem('theme', theme);

      // Keep next-themes in sync (for components using useTheme)
      setTheme(theme);

      // Notify other tabs/components
      try {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'theme',
            newValue: theme,
          }),
        );
      } catch (e) {
        console.error('Error dispatching storage event', e);
      }
    },
    [setTheme],
  );

  // Initialize on mount
  useEffect(() => {
    setMounted(true);

    // Get current theme
    const domTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const theme = storedTheme || domTheme || systemTheme;

    setCurrentTheme(theme);
    applyTheme(theme);

    // Listen for theme changes from other components/tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue as 'light' | 'dark';
        if (newTheme && (newTheme === 'light' || newTheme === 'dark')) {
          setCurrentTheme(newTheme);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [applyTheme]);

  // Direct toggle function
  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
  }, [currentTheme, applyTheme]);

  // Render a placeholder during SSR
  if (!mounted) {
    return (
      <Button
        isIconOnly
        radius="full"
        variant="light"
        className={clsx('cursor-pointer transition-opacity hover:opacity-80', className)}
        aria-label="Theme switch"
      >
        <div className="w-[22px] h-[22px]" />
      </Button>
    );
  }

  return (
    <Button
      isIconOnly
      radius="full"
      variant="light"
      onPress={toggleTheme}
      className={clsx('cursor-pointer transition-opacity hover:opacity-80', className)}
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {currentTheme === 'light' ? <MoonFilledIcon size={22} /> : <SunFilledIcon size={22} />}
    </Button>
  );
};
