'use client';

import {
  KassuContact,
  KassuExperience,
  KassuHero,
  KassuProjects,
  KassuSkills,
  KassuTestimonials,
} from '@/features/about/components/sections';
import { Header } from '@/shared/components/layout';
import { ParticleBackground } from '@/shared/components/ui';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

/**
 * KassuPage component that renders Kassu's profile
 * Uses a modular component approach with sections
 */
export default function KassuPage() {
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

  // Add listener for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      // No-op since 'mounted' state is removed
    };

    document.addEventListener('themechange', handleThemeChange);
    return () => {
      document.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  return (
    <div key={`kassu-page-${resolvedTheme}`}>
      <Header />
      <ParticleBackground />

      {/* Hero Section */}
      <KassuHero />

      {/* Skills Section */}
      <KassuSkills />

      {/* Experience Section */}
      <KassuExperience />

      {/* Projects Section */}
      <KassuProjects />

      {/* Testimonials Section */}
      <KassuTestimonials />

      {/* Contact Section */}
      <KassuContact />
    </div>
  );
}
