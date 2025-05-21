'use client';

import { Button } from '@heroui/react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { type FC, memo, useCallback, useEffect, useState } from 'react';

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
const ThemeSwitchBase: FC<ThemeSwitchProps> = ({ className }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the theme switch after mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Replace the theme change event with a more performant approach
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Update localStorage directly for immediate access by other components
    localStorage.setItem('theme', newTheme);

    // Update data-theme attribute for immediate visual feedback
    document.documentElement.setAttribute('data-theme', newTheme);

    // Use a performant approach for theme-dependent components
    // Instead of dispatching an event which causes extensive re-renders
    // Components that need theme can read from localStorage or use useTheme hook
  }, [resolvedTheme, setTheme]);

  // Memoize the button content to prevent unnecessary re-renders
  const buttonContent = useCallback(() => {
    if (!mounted) {
      return <div className="w-[22px] h-[22px]" />;
    }
    return resolvedTheme === 'light' ? <MoonFilledIcon size={22} /> : <SunFilledIcon size={22} />;
  }, [mounted, resolvedTheme]);

  return (
    <Button
      isIconOnly
      radius="none"
      variant="light"
      onPress={toggleTheme}
      className={clsx(
        'bg-transparent border-none shadow-none cursor-pointer transition-opacity hover:opacity-80',
        className,
      )}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      data-testid="theme-switch"
    >
      {buttonContent()}
    </Button>
  );
};

// Memoize the entire component to prevent re-renders when parent components re-render
export const ThemeSwitch = memo(ThemeSwitchBase);
