'use client';

import TeamMemberCard from '@/features/team/TeamMemberCard';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { useTheme } from 'next-themes';

/**
 * About page component with tabs for Juuso and Kassu.
 * Highlights the active tab based on current pathname.
 */
export default function AboutPage() {
  const { resolvedTheme: theme } = useTheme();

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Animated background */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary mb-6">Our Story</h1>
          <div className="rounded-large bg-content1 p-6 shadow-small backdrop-blur-md bg-opacity-85 border border-content2">
            <p className="text-default-600 mb-6">
              We started this project to help people discover local companies with powerful tools
              like interactive search and maps. Our mission is to connect communities with local
              businesses and provide resources that help both sides thrive.
            </p>
            <p className="text-default-600 mb-6">
              What began as a simple idea has grown into a comprehensive platform that serves
              thousands of users. We're constantly expanding our features and improving the
              experience based on community feedback.
            </p>
            <p className="text-default-600">
              Our team is passionate about supporting local economies and building technology that
              makes a real difference in how people discover and connect with businesses in their
              communities.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Meet the Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <TeamMemberCard
              name="Juuso"
              jobTitle="Lead Developer"
              bio="Specializes in creating intuitive, beautiful user interfaces with modern web technologies."
              portfolioLink="/about/juuso"
              avatarSrc=""
            />

            <TeamMemberCard
              name="Kassu"
              jobTitle="Developer"
              bio="Expert in building robust server architectures and efficient database solutions."
              portfolioLink="/about/kassu"
              avatarSrc=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
