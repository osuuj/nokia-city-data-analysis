'use client';

import { ContactInfo, TeamMemberCard } from '@/features/contact/components';
import { ContactPageSkeleton } from '@/features/contact/components/ContactPageSkeleton';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// Team member data - moved outside component to avoid re-creation on renders
const teamMembers = [
  {
    name: 'Juuso Juvonen',
    role: 'Lead Developer',
    email: 'superjuuso@gmail.com',
    socialLinks: [
      {
        icon: 'logos:linkedin-icon',
        href: 'https://linkedin.com/in/jutoju',
        label: 'linkedin.com/in/jutoju',
      },
      {
        icon: 'logos:github-icon',
        href: 'https://github.com/osuuj',
        label: 'github.com/osuuj',
      },
    ],
  },
  {
    name: 'Kasperi Rautio',
    role: 'Developer',
    email: 'kasperi.rautio@gmail.com',
    socialLinks: [
      {
        icon: 'logos:linkedin-icon',
        href: 'https://linkedin.com/in/kasperi-rautio',
        label: 'linkedin.com/in/kasperi-rautio',
      },
      {
        icon: 'logos:github-icon',
        href: 'https://github.com/kasperi-r',
        label: 'github.com/kasperi-r',
      },
    ],
  },
];

/**
 * Contact page component.
 * Displays contact information for team members.
 *
 * @returns {JSX.Element} The rendered contact page component
 */
export default function ContactPage(): JSX.Element {
  const { resolvedTheme: theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Intersection observer to determine when components enter viewport
  const [teamRef, teamInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Mobile detection for performance optimization
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Mark page as loaded after a short delay
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Component wrappers based on device type
  const HeaderComponent = isMobile ? 'h1' : motion.h1;
  const ContentComponent = isMobile ? 'div' : motion.div;

  // Motion props to use or skip animations based on device
  const headerMotionProps = isMobile
    ? {}
    : {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
      };

  const contentMotionProps = isMobile
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 },
      };

  // Memoized rendering of team member cards
  const renderTeamMembers = useCallback(() => {
    return teamMembers.map((member) => (
      <TeamMemberCard
        key={member.name}
        name={member.name}
        role={member.role}
        email={member.email}
        socialLinks={member.socialLinks}
      />
    ));
  }, []);

  // Show skeleton while client-side code is hydrating
  if (!isMounted) {
    return <ContactPageSkeleton />;
  }

  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Preload avatar images */}
      <Head>
        {teamMembers.map((member) => (
          <link
            key={member.name}
            rel="preload"
            href={`/images/team/${member.name.toLowerCase().replace(/\s+/g, '-')}.svg`}
            as="image"
            type="image/svg+xml"
          />
        ))}
      </Head>

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
        <ContentComponent {...contentMotionProps} className="mb-16" ref={teamRef}>
          <h2 className="text-2xl font-semibold text-default-800 dark:text-default-200 mb-6 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{renderTeamMembers()}</div>
        </ContentComponent>

        {/* Contact information */}
        <div ref={contactRef}>
          <ContactInfo
            email="team@nokiacitydata.com"
            description="Have questions about our city data analysis projects? Feel free to reach out to our team via email."
            responseTime="We typically respond to inquiries within 1-2 business days."
          />
        </div>
      </div>
    </div>
  );
}
