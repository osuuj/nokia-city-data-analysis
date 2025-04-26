import { motion } from 'framer-motion';
import React from 'react';
import { GeometricShapes } from './geometric-shapes';
import { ParticleEffect } from './particle-effect';
import { WaveEffect } from './wave-effect';

interface EnhancedBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({ intensity = 'medium' }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>('dark');
  const backgroundRef = React.useRef<HTMLDivElement>(null);

  // Get theme from document class
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setThemeMode(isDark ? 'dark' : 'light');

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  // Handle mouse movement
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Define gradient colors based on theme
  const gradientColors = React.useMemo(() => {
    return themeMode === 'dark'
      ? {
          primary: 'rgba(60, 60, 110, 0.8)',
          secondary: 'rgba(40, 40, 80, 0.6)',
          tertiary: 'rgba(80, 60, 120, 0.7)',
          accent: 'rgba(100, 70, 160, 0.5)',
          highlight: 'rgba(120, 90, 180, 0.4)',
        }
      : {
          primary: 'rgba(240, 240, 255, 0.8)',
          secondary: 'rgba(230, 230, 250, 0.6)',
          tertiary: 'rgba(220, 225, 255, 0.7)',
          accent: 'rgba(200, 220, 255, 0.5)',
          highlight: 'rgba(210, 230, 255, 0.4)',
        };
  }, [themeMode]);

  // Calculate intensity parameters
  const intensityParams = React.useMemo(() => {
    const params = {
      particleCount: 60,
      particleOpacity: 0.6,
      particleSize: 2,
      gradientSpeed: 20,
      shapeCount: 15,
      waveAmplitude: 20,
    };

    if (intensity === 'low') {
      params.particleCount = 40;
      params.particleOpacity = 0.4;
      params.particleSize = 1.5;
      params.gradientSpeed = 30;
      params.shapeCount = 10;
      params.waveAmplitude = 15;
    } else if (intensity === 'high') {
      params.particleCount = 80;
      params.particleOpacity = 0.7;
      params.particleSize = 2.5;
      params.gradientSpeed = 15;
      params.shapeCount = 25;
      params.waveAmplitude = 25;
    }

    // On mobile devices, reduce intensity
    if (isMobile) {
      params.particleCount = Math.floor(params.particleCount * 0.6);
      params.shapeCount = Math.floor(params.shapeCount * 0.6);
    }

    return params;
  }, [intensity, isMobile]);

  return (
    <div ref={backgroundRef} className="fixed inset-0 overflow-hidden">
      {/* Base gradient layer with advanced animation */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            `radial-gradient(circle at 30% 20%, ${gradientColors.primary}, transparent 70%)`,
            `radial-gradient(circle at 70% 60%, ${gradientColors.primary}, transparent 70%)`,
            `radial-gradient(circle at 80% 30%, ${gradientColors.primary}, transparent 70%)`,
            `radial-gradient(circle at 40% 70%, ${gradientColors.primary}, transparent 70%)`,
            `radial-gradient(circle at 30% 20%, ${gradientColors.primary}, transparent 70%)`,
          ],
        }}
        transition={{
          duration: intensityParams.gradientSpeed,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />

      {/* Secondary gradient layer with different timing */}
      <motion.div
        className="absolute inset-0 z-0 opacity-60"
        animate={{
          background: [
            `radial-gradient(circle at 70% 70%, ${gradientColors.secondary}, transparent 60%)`,
            `radial-gradient(circle at 30% 30%, ${gradientColors.secondary}, transparent 60%)`,
            `radial-gradient(circle at 40% 80%, ${gradientColors.secondary}, transparent 60%)`,
            `radial-gradient(circle at 60% 20%, ${gradientColors.secondary}, transparent 60%)`,
            `radial-gradient(circle at 70% 70%, ${gradientColors.secondary}, transparent 60%)`,
          ],
        }}
        transition={{
          duration: intensityParams.gradientSpeed * 0.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />

      {/* Tertiary accent gradient */}
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        animate={{
          background: [
            `radial-gradient(circle at 50% 50%, ${gradientColors.tertiary}, transparent 40%)`,
            `radial-gradient(circle at 45% 45%, ${gradientColors.accent}, transparent 40%)`,
            `radial-gradient(circle at 55% 55%, ${gradientColors.tertiary}, transparent 40%)`,
            `radial-gradient(circle at 50% 50%, ${gradientColors.accent}, transparent 40%)`,
          ],
        }}
        transition={{
          duration: intensityParams.gradientSpeed * 1.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />

      {/* Subtle glow spot that follows mouse movement */}
      <motion.div
        className="pointer-events-none absolute z-0 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
          backgroundColor: [
            gradientColors.highlight,
            gradientColors.accent,
            gradientColors.tertiary,
            gradientColors.accent,
            gradientColors.highlight,
          ],
        }}
        transition={{
          x: { duration: 0.8, ease: 'easeOut' },
          y: { duration: 0.8, ease: 'easeOut' },
          backgroundColor: {
            duration: 10,
            ease: 'linear',
            repeat: Number.POSITIVE_INFINITY,
          },
        }}
      />

      {/* Particle system */}
      <ParticleEffect
        count={intensityParams.particleCount}
        opacity={intensityParams.particleOpacity}
        size={intensityParams.particleSize}
        color={themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(70, 70, 140, 0.7)'}
      />

      {/* Geometric shapes */}
      <GeometricShapes count={intensityParams.shapeCount} themeMode={themeMode} />

      {/* Wave effect at bottom */}
      <WaveEffect amplitude={intensityParams.waveAmplitude} themeMode={themeMode} />
    </div>
  );
};
