'use client';

import { useTheme } from 'next-themes';
import { usePathname, useSearchParams } from 'next/navigation';
import { type ReactNode, Suspense, useEffect, useRef, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Inner component that uses useSearchParams
 */
function PageTransitionInner({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Apply theme when it changes
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
  }, [resolvedTheme]);

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

/**
 * PageTransition
 * Prevents flash during page transitions by applying theme colors immediately
 * Wrapped in Suspense to handle useSearchParams CSR bailout
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            minHeight: '100vh',
            width: '100%',
          }}
        >
          {children}
        </div>
      }
    >
      <PageTransitionInner>{children}</PageTransitionInner>
    </Suspense>
  );
}
