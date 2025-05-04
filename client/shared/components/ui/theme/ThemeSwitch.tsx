'use client';

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
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the theme switch after mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dispatch theme change event when theme changes
  useEffect(() => {
    if (mounted && resolvedTheme) {
      // Dispatch a custom event that components can listen for
      document.dispatchEvent(
        new CustomEvent('themechange', {
          detail: { theme: resolvedTheme },
        }),
      );
    }
  }, [resolvedTheme, mounted]);

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Update localStorage directly for immediate access by other components
    localStorage.setItem('theme', newTheme);

    // Update data-theme attribute for immediate visual feedback
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [resolvedTheme, setTheme]);

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
