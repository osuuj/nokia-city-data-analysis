'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition
 * Prevents flash during page transitions and provides a consistent background
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <Suspense
      fallback={
        <div
          className="bg-background"
          style={{
            minHeight: '100vh',
            width: '100%',
          }}
        >
          {children}
        </div>
      }
    >
      <div
        className="page-transition bg-background"
        style={{
          minHeight: '100vh',
          width: '100%',
          transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
        }}
      >
        {children}
      </div>
    </Suspense>
  );
}
