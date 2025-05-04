'use client';

import { useThemeContext } from '@/shared/context/ThemeContext';
import { Button } from '@heroui/react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { type FC, useCallback, useEffect, useState } from 'react';

import { MoonFilledIcon, SunFilledIcon } from '@shared/icons';

/**
 * Props for the ThemeSwitch component.
 */
export interface ThemeSwitchProps {
  /** Optional class name for styling */
  className?: string;
}

/**
 * ThemeSwitch Component
 *
 * A toggle button to switch between light and dark themes using `next-themes`.
 *
 * @example
 * <ThemeSwitch className="ml-2" />
 */
export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { resolvedTheme, setTheme: setNextTheme } = useTheme();
  const { toggleTheme: contextToggleTheme } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  // Only show the theme switch after mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced toggle function that updates both next-themes and our context
  const toggleTheme = useCallback(() => {
    // First update via next-themes
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setNextTheme(newTheme);

    // Also update via our context
    contextToggleTheme();

    // Directly set the data-theme attribute as a fallback
    document.documentElement.setAttribute('data-theme', newTheme);

    // Store in localStorage for persistence
    localStorage.setItem('theme', newTheme);

    // Add transitioning class to prevent flash
    document.documentElement.classList.add('theme-transition-disabled');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition-disabled');
    }, 100);
  }, [resolvedTheme, setNextTheme, contextToggleTheme]);

  // Render a placeholder with the same dimensions during SSR
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
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {resolvedTheme === 'light' ? <MoonFilledIcon size={22} /> : <SunFilledIcon size={22} />}
    </Button>
  );
};
