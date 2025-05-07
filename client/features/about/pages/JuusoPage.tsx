'use client';

import {
  JuusoContact,
  JuusoExperience,
  JuusoHero,
  JuusoProjects,
  JuusoSkills,
  JuusoTestimonials,
} from '@/features/about/components/sections';
import { Header } from '@/shared/components/layout';
import { ParticleBackground } from '@/shared/components/ui';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * JuusoPage component that renders Juuso's profile
 * Uses a modular component approach with sections
 */
export default function JuusoPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

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
      // Force re-render on theme change
      setMounted((prevMounted) => !prevMounted);
      setTimeout(() => setMounted(true), 0);
    };

    document.addEventListener('themechange', handleThemeChange);
    return () => {
      document.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  return (
    <div key={`juuso-page-${resolvedTheme}`}>
      <Header />
      <ParticleBackground />

      {/* Hero Section */}
      <JuusoHero />

      {/* Skills Section */}
      <JuusoSkills />

      {/* Experience Section */}
      <JuusoExperience />

      {/* Projects Section */}
      <JuusoProjects />

      {/* Testimonials Section */}
      <JuusoTestimonials />

      {/* Contact Section */}
      <JuusoContact />
    </div>
  );
}
