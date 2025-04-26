import { motion } from 'framer-motion';
import React from 'react';
import { CellularPattern } from './cellular-pattern';
import { FluidInteraction } from './fluid-interaction';
import { LightSource } from './light-source';

interface EvolvingBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const EvolvingBackground: React.FC<EvolvingBackgroundProps> = ({ intensity = 'medium' }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = React.useState(false);
  const [viewportDimensions, setViewportDimensions] = React.useState({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>('dark');
  const backgroundRef = React.useRef<HTMLDivElement>(null);
  const lastMoveTimeRef = React.useRef<number>(0);

  // Get theme from document class and set viewport dimensions
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

  // Handle mouse movement for interactive effects
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });

        setIsMoving(true);
        lastMoveTimeRef.current = Date.now();

        // After a short delay with no movement, set isMoving to false
        setTimeout(() => {
          const timeSinceLastMove = Date.now() - lastMoveTimeRef.current;
          if (timeSinceLastMove >= 100) {
            setIsMoving(false);
          }
        }, 100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Touch support for mobile
  React.useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (backgroundRef.current && e.touches[0]) {
        const rect = backgroundRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        setMousePosition({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
        setIsMoving(true);
        lastMoveTimeRef.current = Date.now();
      }
    };

    const handleTouchEnd = () => {
      setIsMoving(false);
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Calculate intensity parameters based on intensity prop and device type
  const intensityParams = React.useMemo(() => {
    const params = {
      cellDensity: 12,
      evolutionSpeed: 1,
      fluidInteractionStrength: 10,
      lightIntensity: 0.6,
      patternComplexity: 3,
    };

    if (intensity === 'low') {
      params.cellDensity = 8;
      params.evolutionSpeed = 0.7;
      params.fluidInteractionStrength = 7;
      params.lightIntensity = 0.4;
      params.patternComplexity = 2;
    } else if (intensity === 'high') {
      params.cellDensity = 16;
      params.evolutionSpeed = 1.3;
      params.fluidInteractionStrength = 15;
      params.lightIntensity = 0.8;
      params.patternComplexity = 4;
    }

    // Reduce complexity on mobile
    if (isMobile) {
      params.cellDensity = Math.round(params.cellDensity * 0.6);
      params.evolutionSpeed = params.evolutionSpeed * 0.8;
      params.fluidInteractionStrength = params.fluidInteractionStrength * 0.7;
      params.patternComplexity = Math.max(1, params.patternComplexity - 1);
    }

    return params;
  }, [intensity, isMobile]);

  // Base colors and theme specific settings
  const themeColors = React.useMemo(() => {
    return themeMode === 'dark'
      ? {
          background: '#0F172A',
          cell: '#334155',
          cellActive: '#64748B',
          fluidPrimary: 'rgba(99, 102, 241, 0.15)',
          fluidSecondary: 'rgba(168, 85, 247, 0.12)',
          lightPrimary: 'rgba(129, 140, 248, 0.8)',
          lightSecondary: 'rgba(192, 132, 252, 0.7)',
          accent: '#818cf8',
        }
      : {
          background: '#F8FAFC',
          cell: '#E2E8F0',
          cellActive: '#94A3B8',
          fluidPrimary: 'rgba(99, 102, 241, 0.08)',
          fluidSecondary: 'rgba(168, 85, 247, 0.06)',
          lightPrimary: 'rgba(99, 102, 241, 0.5)',
          lightSecondary: 'rgba(168, 85, 247, 0.4)',
          accent: '#6366F1',
        };
  }, [themeMode]);

  return (
    <div ref={backgroundRef} className="fixed inset-0 overflow-hidden">
      {/* Base background color */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ backgroundColor: themeColors.background }}
      />

      {/* Cellular pattern layer */}
      <CellularPattern
        density={intensityParams.cellDensity}
        evolutionSpeed={intensityParams.evolutionSpeed}
        complexity={intensityParams.patternComplexity}
        mousePosition={mousePosition}
        isMouseMoving={isMoving}
        baseColor={themeColors.cell}
        activeColor={themeColors.cellActive}
        viewportDimensions={viewportDimensions}
      />

      {/* Fluid interaction layer */}
      <FluidInteraction
        mousePosition={mousePosition}
        isMouseMoving={isMoving}
        strength={intensityParams.fluidInteractionStrength}
        primaryColor={themeColors.fluidPrimary}
        secondaryColor={themeColors.fluidSecondary}
        viewportDimensions={viewportDimensions}
      />

      {/* Dynamic light source that follows interaction */}
      <LightSource
        mousePosition={mousePosition}
        isActive={isMoving}
        intensity={intensityParams.lightIntensity}
        primaryColor={themeColors.lightPrimary}
        secondaryColor={themeColors.lightSecondary}
        viewportDimensions={viewportDimensions}
      />

      {/* Subtle accent vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 70%, ${themeColors.accent} 100%)`,
        }}
      />
    </div>
  );
};
