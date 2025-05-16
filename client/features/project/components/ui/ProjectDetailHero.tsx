import { useAnimationProps } from '@/shared/hooks';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import type { Project } from '../../types';

interface ProjectDetailHeroProps {
  project: Project;
}

/**
 * ProjectDetailHero component
 *
 * Displays the hero section of a project detail page with image, title, and status.
 */
export const ProjectDetailHero = ({ project }: ProjectDetailHeroProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Format the status display text
  const getStatusDisplay = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active Project';
      case 'planning':
        return 'In Planning';
      case 'on_hold':
        return 'On Hold';
      default:
        return 'Project';
    }
  };

  // Get the status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-500';
      case 'active':
        return 'bg-primary-500';
      case 'planning':
        return 'bg-default-500';
      case 'on_hold':
        return 'bg-warning-500';
      default:
        return 'bg-default-500';
    }
  };

  // Animation props for the underline
  const underlineAnimProps = useAnimationProps('fadeIn', {
    whileInView: true,
    duration: 0.8,
    delay: 0.4,
    initial: { width: 0 },
    animate: { width: '100%' },
  });

  return (
    <header
      className="relative h-[40vh] overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
      aria-label="Project hero image"
    >
      {/* Stronger dark overlay to improve text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/65 z-10" />

      {/* Image container - full width/height */}
      <div className="absolute inset-0">
        <Image
          src={project.image}
          alt={project.title}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
          onLoadingComplete={() => setIsLoading(false)}
        />
        {isLoading && <div className="absolute inset-0 bg-gray-700 animate-pulse" />}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-white font-medium ${getStatusColor(project.status)}`}
            aria-label={`Project status: ${getStatusDisplay(project.status)}`}
          >
            {getStatusDisplay(project.status)}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white text-shadow-xl inline-block relative">
          {project.title}
          <motion.span
            {...underlineAnimProps}
            className="absolute bottom-0 left-0 h-1 bg-primary rounded"
          />
        </h1>
        {project.subtitle && (
          <p className="mt-2 text-base md:text-lg text-white/95 max-w-2xl font-medium text-shadow-md">
            {project.subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

/**
 * Adds a custom text-shadow utility to improve text readability over images
 */
const addTextShadowUtilities = () => {
  if (typeof document !== 'undefined') {
    // Add text shadow styles to improve readability over varied backgrounds
    const style = document.createElement('style');
    style.textContent = `
      .text-shadow-md { text-shadow: 0 2px 4px rgba(0,0,0,0.7); }
      .text-shadow-lg { text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
      .text-shadow-xl { text-shadow: 0 3px 6px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.5); }
    `;
    document.head.appendChild(style);
  }
};

// Add text shadow utilities when component is imported
addTextShadowUtilities();
