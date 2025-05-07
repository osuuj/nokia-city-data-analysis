'use client';

import { ContactInfo, TeamMemberCard } from '@/features/contact/components';
import { ContactPageSkeleton } from '@/features/contact/components/ContactPageSkeleton';
import { AnimatedBackground } from '@/shared/components/ui/background';
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
    return <ContactPageSkeleton />;
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
