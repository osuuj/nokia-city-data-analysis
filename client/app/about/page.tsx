'use client';

import { AboutErrorBoundary, AboutStory, AboutTeam } from '@/features/about/components';
import { AnimatedBackground } from '@/shared/components/ui/AnimatedBackground';
import { useTheme } from 'next-themes';

/**
 * About page component that displays the team story and team members.
 * Uses React Query for data fetching with proper loading states.
 */
export default function AboutPage() {
  const { resolvedTheme: theme } = useTheme();

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

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
