import { motion } from 'framer-motion';
import React from 'react';
import { CosmicEvents } from './cosmic-events';
import { Nebulae } from './nebulae';
import { Starfield } from './starfield';

interface CosmicBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ intensity = 'medium' }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [viewportDimensions, setViewportDimensions] = React.useState({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>('dark');
  const backgroundRef = React.useRef<HTMLDivElement>(null);
  const lastScrollPosition = React.useRef(0);
  const [scrollDirection, setScrollDirection] = React.useState<'up' | 'down' | null>(null);

  // Get theme and set viewport dimensions
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setThemeMode(isDark ? 'dark' : 'light');

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial dimensions
    setViewportDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    mediaQuery.addEventListener('change', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle mouse movement for parallax effect
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();

        // Calculate normalized values (-1 to 1)
        const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        setMousePosition({
          x: normalizedX,
          y: normalizedY,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Track scroll direction for enhanced parallax
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollPosition.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollPosition.current) {
        setScrollDirection('up');
      }

      lastScrollPosition.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate intensity parameters
  const intensityParams = React.useMemo(() => {
    const params = {
      starCount: 800,
      starfieldDepth: 5,
      nebulaeCount: 4,
      nebulaeComplexity: 5,
      cosmicEventFrequency: 0.5,
      parallaxStrength: 20,
    };

    if (intensity === 'low') {
      params.starCount = 400;
      params.starfieldDepth = 3;
      params.nebulaeCount = 2;
      params.nebulaeComplexity = 3;
      params.cosmicEventFrequency = 0.3;
      params.parallaxStrength = 10;
    } else if (intensity === 'high') {
      params.starCount = 1200;
      params.starfieldDepth = 8;
      params.nebulaeCount = 5;
      params.nebulaeComplexity = 7;
      params.cosmicEventFrequency = 0.8;
      params.parallaxStrength = 30;
    }

    // Reduce complexity on mobile
    if (isMobile) {
      params.starCount = Math.floor(params.starCount * 0.5);
      params.starfieldDepth = Math.max(2, params.starfieldDepth - 2);
      params.nebulaeCount = Math.max(1, params.nebulaeCount - 1);
      params.nebulaeComplexity = Math.max(2, params.nebulaeComplexity - 2);
      params.cosmicEventFrequency = params.cosmicEventFrequency * 0.5;
      params.parallaxStrength = params.parallaxStrength * 0.6;
    }

    return params;
  }, [intensity, isMobile]);

  // Theme colors
  const themeColors = React.useMemo(() => {
    return themeMode === 'dark'
      ? {
          spaceBackground: 'rgb(10, 5, 20)',
          spaceGradient: 'linear-gradient(to bottom, rgb(15, 10, 30), rgb(5, 2, 10))',
          primaryStar: 'rgba(255, 255, 255, 0.9)',
          secondaryStar: 'rgba(200, 220, 255, 0.85)',
          nebulaPrimary: 'rgba(111, 66, 193, 0.2)',
          nebulaSecondary: 'rgba(58, 134, 255, 0.15)',
          nebulaTertiary: 'rgba(29, 78, 216, 0.25)',
          cosmicEvent: 'rgba(219, 39, 119, 0.7)',
        }
      : {
          spaceBackground: 'rgb(235, 245, 255)',
          spaceGradient: 'linear-gradient(to bottom, rgb(245, 250, 255), rgb(225, 240, 255))',
          primaryStar: 'rgba(0, 0, 0, 0.7)',
          secondaryStar: 'rgba(30, 58, 138, 0.65)',
          nebulaPrimary: 'rgba(79, 70, 229, 0.1)',
          nebulaSecondary: 'rgba(37, 99, 235, 0.08)',
          nebulaTertiary: 'rgba(59, 130, 246, 0.12)',
          cosmicEvent: 'rgba(219, 39, 119, 0.4)',
        };
  }, [themeMode]);

  return (
    <div ref={backgroundRef} className="fixed inset-0 overflow-hidden">
      {/* Base space background */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ background: themeColors.spaceGradient }}
      />

      {/* Parallax container */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x * -intensityParams.parallaxStrength,
          y: mousePosition.y * -intensityParams.parallaxStrength,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 30 }}
      >
        {/* Far distance nebulae */}
        <Nebulae
          count={intensityParams.nebulaeCount}
          complexity={intensityParams.nebulaeComplexity}
          colors={[
            themeColors.nebulaPrimary,
            themeColors.nebulaSecondary,
            themeColors.nebulaTertiary,
          ]}
          viewportDimensions={viewportDimensions}
          parallaxStrength={intensityParams.parallaxStrength * 0.2}
        />

        {/* Distant starfield (furthest layer) */}
        <Starfield
          count={intensityParams.starCount * 0.5}
          depth={intensityParams.starfieldDepth - 2}
          primaryColor={themeColors.primaryStar}
          secondaryColor={themeColors.secondaryStar}
          viewportDimensions={viewportDimensions}
          parallaxStrength={intensityParams.parallaxStrength * 0.3}
          mousePosition={mousePosition}
          scrollDirection={scrollDirection}
        />

        {/* Mid-distance starfield */}
        <Starfield
          count={intensityParams.starCount * 0.3}
          depth={intensityParams.starfieldDepth}
          primaryColor={themeColors.primaryStar}
          secondaryColor={themeColors.secondaryStar}
          viewportDimensions={viewportDimensions}
          parallaxStrength={intensityParams.parallaxStrength * 0.6}
          mousePosition={mousePosition}
          scrollDirection={scrollDirection}
        />

        {/* Cosmic events (supernovas, pulsars, etc.) */}
        <CosmicEvents
          frequency={intensityParams.cosmicEventFrequency}
          eventColor={themeColors.cosmicEvent}
          viewportDimensions={viewportDimensions}
          mousePosition={mousePosition}
        />

        {/* Near starfield (closest layer) */}
        <Starfield
          count={intensityParams.starCount * 0.2}
          depth={intensityParams.starfieldDepth + 2}
          primaryColor={themeColors.primaryStar}
          secondaryColor={themeColors.secondaryStar}
          viewportDimensions={viewportDimensions}
          parallaxStrength={intensityParams.parallaxStrength}
          mousePosition={mousePosition}
          scrollDirection={scrollDirection}
          shootingStarFrequency={0.2}
        />
      </motion.div>

      {/* Subtle dark vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            themeMode === 'dark'
              ? 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)'
              : 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 50, 0.15) 100%)',
        }}
      />
    </div>
  );
};
