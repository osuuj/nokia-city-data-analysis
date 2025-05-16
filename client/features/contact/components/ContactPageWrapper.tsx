'use client';

import { ContactInfo, TeamMemberCard } from '@/features/contact/components';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { ContactPageWrapperProps } from '../types/contact-types';

/**
 * Client-side contact page wrapper component
 * Uses the same pattern as project and about pages for consistent transitions
 */
export default function ContactPageWrapper({
  teamMembers,
  email,
  description,
  responseTime,
}: ContactPageWrapperProps) {
  // Memoize the team member cards to avoid re-renders
  const teamMembersList = useMemo(
    () =>
      teamMembers.map((member) => (
        <TeamMemberCard
          key={member.name}
          name={member.name}
          role={member.role}
          email={member.email}
          socialLinks={member.socialLinks}
        />
      )),
    [teamMembers],
  );

  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Use the AnimatedBackground directly, just like the project and about pages */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative text-black dark:text-white">
            Contact Us
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 h-1 bg-primary rounded"
            />
          </h1>
        </div>

        {/* Team contacts section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{teamMembersList}</div>
        </div>

        {/* Contact information */}
        <ContactInfo email={email} description={description} responseTime={responseTime} />
      </div>
    </div>
  );
}
