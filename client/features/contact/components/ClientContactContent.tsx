'use client';

import { ContactInfo, TeamMemberCard } from '@/features/contact/components';
import { AnimatedBackgroundSkeleton } from '@/shared/components/loading';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

// Types for team member data
interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface TeamMember {
  name: string;
  role: string;
  email: string;
  socialLinks: SocialLink[];
}

// Export the props interface for use in dynamic imports
export interface ClientContactContentProps {
  teamMembers: TeamMember[];
  email: string;
  description: string;
  responseTime: string;
}

/**
 * Client-side contact page content
 * Contains all interactive elements and animations
 */
export function ClientContactContent({
  teamMembers,
  email,
  description,
  responseTime,
}: ClientContactContentProps): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Single effect for initialization - more efficient
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize device detection to avoid recalculations
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  }, []); // No dependencies needed as this is only checked on initial render

  // Disable animations if user prefers reduced motion or on mobile
  const shouldAnimate = useMemo(() => {
    return isMounted && !prefersReducedMotion && !isMobile;
  }, [isMounted, prefersReducedMotion, isMobile]);

  // Memoized components and props to reduce render work
  const HeaderComponent = shouldAnimate ? motion.h1 : 'h1';
  const ContentComponent = shouldAnimate ? motion.div : 'div';

  // Motion props to use or skip animations based on preferences
  const headerMotionProps = useMemo(() => {
    return shouldAnimate
      ? {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
        }
      : {};
  }, [shouldAnimate]);

  const contentMotionProps = useMemo(() => {
    return shouldAnimate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
        }
      : {};
  }, [shouldAnimate]);

  // Memoized rendering of team member cards for fewer re-renders
  const teamMemberCards = useMemo(() => {
    return teamMembers.map((member) => (
      <TeamMemberCard
        key={member.name}
        name={member.name}
        role={member.role}
        email={member.email}
        socialLinks={member.socialLinks}
      />
    ));
  }, [teamMembers]);

  // Show skeleton while client-side code is hydrating
  if (!isMounted) {
    return (
      <AnimatedBackgroundSkeleton>
        <div className="px-4 py-8 md:px-6">
          {/* Header skeleton with shimmer effect */}
          <Skeleton className="h-10 w-48 mx-auto mb-12 rounded-md" />

          {/* Team section skeleton with subtle animation */}
          <div className="mb-16">
            <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Team member cards with Card components matching final appearance */}
              {[0, 1].map((index) => (
                <Card
                  key={`skeleton-${index}`}
                  className="backdrop-blur-md bg-opacity-90 transition-colors"
                >
                  <CardBody className="flex flex-col items-center gap-4">
                    <Skeleton className="rounded-full w-24 h-24" />
                    <div className="text-center w-full">
                      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                      <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                      <Skeleton className="h-4 w-full mb-2 mx-auto" />
                      <Skeleton className="h-4 w-full mb-2 mx-auto" />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Info skeleton with Card matching final appearance */}
          <Card className="backdrop-blur-md bg-opacity-90 transition-colors mb-12">
            <CardBody className="p-6">
              <Skeleton className="h-6 w-48 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mx-auto mb-6" />
              <div className="flex items-center justify-center gap-3 mb-4">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-64 mx-auto mt-6" />
            </CardBody>
          </Card>
        </div>
      </AnimatedBackgroundSkeleton>
    );
  }

  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Animated background */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        <HeaderComponent
          {...headerMotionProps}
          className="text-4xl font-bold text-center text-primary mb-12"
        >
          Contact Us
        </HeaderComponent>

        {/* Team contacts section */}
        <ContentComponent {...contentMotionProps} className="mb-16">
          <h2 className="text-2xl font-semibold text-default-800 dark:text-default-200 mb-6 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{teamMemberCards}</div>
        </ContentComponent>

        {/* Contact information */}
        <ContactInfo email={email} description={description} responseTime={responseTime} />
      </div>
    </div>
  );
}
