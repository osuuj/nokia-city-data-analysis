'use client';

import { Team } from '@/features/about/components/Team';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import { Header } from '@/shared/components/layout';
import { StandardFallback } from '@/shared/components/loading';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { Suspense } from 'react';

/**
 * About page component that displays the team story and team members.
 */
export default function AboutPage() {
  return (
    <>
      <AnimatedBackground priority="high" />
      <Header />
      <main className="relative z-10">
        <ErrorBoundary fallback={<ErrorMessage />}>
          <Suspense fallback={<StandardFallback />}>
            <Team />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}
