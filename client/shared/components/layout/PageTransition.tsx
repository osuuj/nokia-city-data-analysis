'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useRef } from 'react';

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

  // Immediately apply theme when route changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Get current theme
    const theme =
      (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';

    // Apply background directly to this container to prevent flash
    containerRef.current.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
    containerRef.current.style.color = theme === 'dark' ? '#ffffff' : '#000000';
  }, []);

  return (
    <div
      ref={containerRef}
      className="page-transition"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
        width: '100%',
        transition: 'none',
      }}
    >
      {children}
    </div>
  );
}
