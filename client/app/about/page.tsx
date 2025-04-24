'use client';

import { useTeamMembers } from '@/features/about/hooks/useTeamMember';
import TeamMemberCard from '@/features/team/TeamMemberCard';
import { ErrorMessage } from '@/shared/components/error';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { Skeleton } from '@heroui/react';
import { useTheme } from 'next-themes';
import { Suspense } from 'react';

function AboutPageSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-10">
        <Skeleton className="w-48 h-12 mb-6" />
        <div className="rounded-large bg-content1 p-6">
          <Skeleton className="w-full h-24 mb-6" />
          <Skeleton className="w-full h-24 mb-6" />
          <Skeleton className="w-3/4 h-24" />
        </div>

        <Skeleton className="w-40 h-8 mt-10 mb-4" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-large bg-content1 p-6">
              <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
              <Skeleton className="w-32 h-6 mx-auto mb-2" />
              <Skeleton className="w-48 h-4 mx-auto mb-4" />
              <Skeleton className="w-full h-16 mb-4" />
              <Skeleton className="w-32 h-9 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutContent() {
  const { resolvedTheme: theme } = useTheme();
  const { data: teamMembers, isLoading, error } = useTeamMembers();

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  if (isLoading) {
    return <AboutPageSkeleton />;
  }

  if (error || !teamMembers) {
    return (
      <div className="container mx-auto px-4">
        <ErrorMessage
          title="Failed to Load Team Data"
          message="We couldn't load the team information at this time. Please try again later."
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-primary mb-6">Our Story</h1>
        <div className="rounded-large bg-content1 p-6 shadow-small backdrop-blur-md bg-opacity-85 border border-content2">
          <p className="text-default-600 mb-6">
            We started this project to help people discover local companies with powerful tools like
            interactive search and maps. Our mission is to connect communities with local businesses
            and provide resources that help both sides thrive.
          </p>
          <p className="text-default-600 mb-6">
            What began as a simple idea has grown into a comprehensive platform that serves
            thousands of users. We're constantly expanding our features and improving the experience
            based on community feedback.
          </p>
          <p className="text-default-600">
            Our team is passionate about supporting local economies and building technology that
            makes a real difference in how people discover and connect with businesses in their
            communities.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Meet the Team</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Animated background */}
      <AnimatedBackground />

      <div className="relative z-10">
        <Suspense fallback={<AboutPageSkeleton />}>
          <AboutContent />
        </Suspense>
      </div>
    </div>
  );
}
