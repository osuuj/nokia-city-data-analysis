'use client';

import { AboutErrorBoundary, AboutStory, AboutTeam } from '@/features/about/components';
import { AnimatedBackground } from '@/shared/components/ui/background';

/**
 * About page component that displays the team story and team members.
 * Uses React Query for data fetching with proper loading states.
 */
export default function AboutPage() {
  return (
    <AboutErrorBoundary>
      <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
        {/* Animated background */}
        <AnimatedBackground />

        <div className="relative z-10 max-w-3xl mx-auto">
          <AboutStory />
          <AboutTeam />
        </div>
      </div>
    </AboutErrorBoundary>
  );
}
