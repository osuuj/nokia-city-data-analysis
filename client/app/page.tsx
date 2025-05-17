import { Hero, LandingErrorBoundary, LandingPagePrefetcher } from '@/features/landing/components';
import { StandardFallback } from '@/shared/components/loading';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Osuuj Data Analysis - Home',
  description: 'Explore Finnish companies with interactive data visualizations',
  openGraph: {
    title: 'Osuuj Data Analysis',
    description:
      "Explore city data analytics and insights powered by Nokia's advanced data processing capabilities.",
    type: 'website',
  },
};

export const viewport = {
  title: 'Osuuj Data Analysis',
  // Other viewport config
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

      <Suspense fallback={<StandardFallback text="Loading landing page..." />}>
        <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <Hero />
        </section>
      </Suspense>
    </LandingErrorBoundary>
  );
}
