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
import { useThemeContext } from '@/shared/context/ThemeContext';
import React, { useEffect } from 'react';

/**
 * KassuPage component that renders Kassu's profile
 * Uses a modular component approach with sections
 */
export default function KassuPage() {
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
    </>
  );
}
