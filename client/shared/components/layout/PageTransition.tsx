'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  isDashboard?: boolean;
}

/**
 * PageTransition
 * Prevents flash during page transitions and provides a consistent background
 */
export function PageTransition({ children, isDashboard = false }: PageTransitionProps) {
  return (
    <Suspense
      fallback={
        <div
          className="bg-background"
          style={{
            minHeight: '100vh',
            width: '100%',
            overflow: isDashboard ? 'hidden' : 'auto',
          }}
        >
          {children}
        </div>
      }
    >
      <div
        className={clsx('page-transition bg-background', {
          'h-screen overflow-hidden': isDashboard,
        })}
        style={{
          minHeight: isDashboard ? undefined : '100vh',
          width: '100%',
          transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
        }}
      >
        {children}
      </div>
    </Suspense>
  );
}
