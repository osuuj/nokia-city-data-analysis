'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook for managing animations in the landing feature.
 *
 * @returns {Object} Animation state and functions
 */
export const useHeroAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set isLoaded to true after component mounts
    setIsLoaded(true);

    // Add a small delay before showing content for a smoother entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    isVisible,
    isLoaded,
    // Animation classes that can be applied to elements
    fadeInClass: isVisible ? 'opacity-100' : 'opacity-0',
    slideUpClass: isVisible ? 'translate-y-0' : 'translate-y-8',
    scaleInClass: isVisible ? 'scale-100' : 'scale-95',
    // Transition classes
    transitionClass: 'transition-all duration-700 ease-out',
    // Combined classes for common animations
    fadeInUpClass: `${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 ease-out`,
    fadeInScaleClass: `${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 ease-out`,
  };
};
