'use client';

import { Header } from '@/shared/components/layout';
import { ParticleBackground } from '@/shared/components/ui';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ProfilePageProps {
  heroSection: ReactNode;
  skillsSection: ReactNode;
  experienceSection: ReactNode;
  projectsSection: ReactNode;
  testimonialsSection: ReactNode;
  contactSection: ReactNode;
  name: string;
}

/**
 * Reusable ProfilePage component that renders a team member profile
 * Takes section components as props to allow customization while sharing structure
 */
export function ProfilePage({
  heroSection,
  skillsSection,
  experienceSection,
  projectsSection,
  testimonialsSection,
  contactSection,
  name,
}: ProfilePageProps) {
  const { resolvedTheme } = useTheme();

  // Scroll to section on load if hash is present
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            behavior: 'smooth',
            top: element.offsetTop - 100,
          });
        }, 500);
      }
    }
  }, []);

  return (
    <div key={`${name}-page-${resolvedTheme}`}>
      <Header />
      <ParticleBackground />

      {/* Hero Section */}
      {heroSection}

      {/* Skills Section */}
      {skillsSection}

      {/* Experience Section */}
      {experienceSection}

      {/* Projects Section */}
      {projectsSection}

      {/* Testimonials Section */}
      {testimonialsSection}

      {/* Contact Section */}
      {contactSection}
    </div>
  );
}
