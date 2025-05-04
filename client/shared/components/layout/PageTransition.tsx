'use client';

import { useTheme } from 'next-themes';
import { usePathname, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition
 * Prevents flash during page transitions by applying theme colors immediately
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  // Store the dependencies in a state to avoid dependency array changes
  const [deps] = useState({ pathname, searchParams });

  // Apply theme when it changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Using stable state instead of direct dependencies
  useEffect(() => {
    if (!containerRef.current) return;

    // Get current theme
    const theme =
      (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ||
      resolvedTheme ||
      'dark';

    // Apply background directly to this container to prevent flash
    containerRef.current.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
    containerRef.current.style.color = theme === 'dark' ? '#ffffff' : '#000000';
  }, [resolvedTheme, deps]);

  return (
    <div
      ref={containerRef}
      className="page-transition"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
        width: '100%',
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
