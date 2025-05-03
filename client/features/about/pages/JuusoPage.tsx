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
import { useThemeContext } from '@/shared/context/ThemeContext';
import React, { useEffect } from 'react';

/**
 * JuusoPage component that renders Juuso's profile
 * Uses a modular component approach with sections
 */
export default function JuusoPage() {
  const { theme } = useThemeContext();

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
    <>
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
    </>
  );
}
