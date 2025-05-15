'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

/**
 * Client component that wraps layout content and manages body classes
 * Single source of truth for DOM class manipulation to prevent hydration issues
 */
export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Handle initial mount and get saved theme
  useEffect(() => {
    setIsMounted(true);

    // Ensure theme persistence by reading from localStorage on mount
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        // This will ensure next-themes is in sync with localStorage
        setTheme(savedTheme);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [setTheme]);

  // Handle page-specific classes
  useEffect(() => {
    if (!isMounted) return;

    // Check if we're on dashboard pages
    const isDashboardPage = pathname?.startsWith('/dashboard') ?? false;

    // Add or remove the dashboard-page class based on the current route
    if (isDashboardPage) {
      document.body.classList.add('dashboard-page');
    } else {
      document.body.classList.remove('dashboard-page');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, [pathname, isMounted]);

  // Handle theme changes
  useEffect(() => {
    if (!isMounted) return;

    // Get theme from localStorage first, fall back to resolvedTheme, then to system preference
    let activeTheme: string | null = null;

    try {
      activeTheme = localStorage.getItem('theme');
    } catch (e) {
      // Ignore localStorage errors
    }

    // If no saved theme, use resolved theme from next-themes
    const theme = activeTheme || resolvedTheme || 'dark';

    // Use classes instead of inline styles
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }

    // Update data-theme attribute for component library
    document.documentElement.setAttribute('data-theme', theme);
  }, [resolvedTheme, isMounted]);

  // This component renders its children
  return <>{children}</>;
}
