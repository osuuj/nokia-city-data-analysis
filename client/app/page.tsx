import { Hero } from '@/features/landing/components/Hero/Hero';
import { LandingErrorBoundary } from '@/features/landing/components/LandingErrorBoundary';
import { LandingPagePrefetcher } from '@/features/landing/components/LandingPagePrefetcher';
import { LoadingSpinner } from '@/shared/components/data/LoadingSpinner';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Nokia City Data Analysis - Home',
  description:
    "Explore city data analytics and insights powered by Nokia's advanced data processing capabilities.",
  openGraph: {
    title: 'Nokia City Data Analysis',
    description:
      "Explore city data analytics and insights powered by Nokia's advanced data processing capabilities.",
    type: 'website',
  },
};

/**
 * Landing page component displaying the hero section.
 * This is the root of the app's public-facing homepage.
 *
 * @returns {JSX.Element} The rendered landing page component
 */
export default function LandingPage(): JSX.Element {
  return (
    <LandingErrorBoundary>
      {/* Prefetch data in the background */}
      <LandingPagePrefetcher prefetchDelay={1500} />

      <Suspense fallback={<LoadingSpinner />}>
        <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <Hero />
        </section>
      </Suspense>
    </LandingErrorBoundary>
  );
}
