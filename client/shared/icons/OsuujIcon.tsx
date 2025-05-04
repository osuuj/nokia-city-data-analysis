'use client';

import clsx from 'clsx';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export interface OsuujLogoProps {
  /** Whether to prioritize loading (affects <Image />) */
  large?: boolean;
  /** Additional className for layout control */
  className?: string;
}

/**
 * OsuujLogo
 * Dynamically switches the logo between light/dark mode.
 */
export const OsuujLogo = ({ large = false, className = '' }: OsuujLogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force a component update when we get theme change events
  const handleThemeChange = useCallback(() => {
    console.log('OsuujLogo received theme change event');
    setForceUpdate((prev) => prev + 1);
  }, []);

  useEffect(() => {
    setMounted(true);

    // Listen for our custom theme change events
    document.addEventListener('themechange', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      document.removeEventListener('themechange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [handleThemeChange]);

  // Get current theme, checking DOM and localStorage first for immediate states
  const getCurrentTheme = () => {
    // DOM attribute first - most accurate for current state
    const domTheme = document.documentElement.getAttribute('data-theme');
    if (domTheme === 'light' || domTheme === 'dark') {
      return domTheme;
    }

    // Then localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    // Finally, fall back to resolvedTheme from next-themes
    return resolvedTheme || 'dark';
  };

  if (!mounted) {
    return <div className="w-10 h-10 bg-gray-300 animate-pulse" />;
  }

  const currentTheme = getCurrentTheme();
  const logoSrc = currentTheme === 'light' ? '/ouuj-black.svg' : '/ouuj-color.svg';

  return (
    <div className={clsx('relative w-10 h-10 block', className)}>
      <Image
        src={logoSrc}
        alt="Osuuj Logo"
        fill
        sizes="(max-width: 768px) 24px, 40px"
        className="object-contain"
        priority={true}
        key={`logo-${currentTheme}-${forceUpdate}`} // Force remount on theme change
      />
    </div>
  );
};
