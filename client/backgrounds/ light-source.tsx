import { motion } from 'framer-motion';
import React from 'react';

interface LightSourceProps {
  mousePosition: { x: number; y: number };
  isActive: boolean;
  intensity: number;
  primaryColor: string;
  secondaryColor: string;
  viewportDimensions: { width: number; height: number };
}

export const LightSource: React.FC<LightSourceProps> = ({
  mousePosition,
  isActive,
  intensity = 0.6,
  primaryColor = 'rgba(129, 140, 248, 0.8)',
  secondaryColor = 'rgba(192, 132, 252, 0.7)',
  viewportDimensions,
}) => {
  // Light effect properties
  const lightSize = React.useMemo(() => {
    const baseSize = Math.min(viewportDimensions.width, viewportDimensions.height) * 0.4;
    return baseSize * intensity;
  }, [viewportDimensions, intensity]);

  // Memoize light colors with applied intensity
  const lightColors = React.useMemo(() => {
    // Extract RGB from rgba strings
    const extractRGB = (rgba: string) => {
      const match = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
      if (match) {
        return {
          r: Number.parseInt(match[1]),
          g: Number.parseInt(match[2]),
          b: Number.parseInt(match[3]),
          a: Number.parseFloat(match[4]),
        };
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };

    const primary = extractRGB(primaryColor);
    const secondary = extractRGB(secondaryColor);

    // Adjust alpha with intensity
    const primaryWithIntensity = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${primary.a * intensity})`;
    const secondaryWithIntensity = `rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, ${secondary.a * intensity})`;

    return {
      primary: primaryWithIntensity,
      secondary: secondaryWithIntensity,
    };
  }, [primaryColor, secondaryColor, intensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary light source that follows mouse */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: lightSize * 2,
          height: lightSize * 2,
          left: 0,
          top: 0,
          filter: 'blur(60px)',
          background: lightColors.primary,
          opacity: isActive ? 1 : 0.6,
          x: mousePosition.x - lightSize,
          y: mousePosition.y - lightSize,
        }}
        animate={{
          scale: isActive ? [1, 1.1, 0.9, 1] : 1,
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          x: { duration: 0.3, ease: 'easeOut' },
          y: { duration: 0.3, ease: 'easeOut' },
          opacity: { duration: 1 },
        }}
      />

      {/* Secondary light source for depth */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: lightSize * 1.6,
          height: lightSize * 1.6,
          left: 0,
          top: 0,
          filter: 'blur(80px)',
          background: lightColors.secondary,
          opacity: isActive ? 0.7 : 0.3,
          x: mousePosition.x - lightSize * 0.8 + 40,
          y: mousePosition.y - lightSize * 0.8 - 40,
        }}
        animate={{
          scale: isActive ? [1, 0.9, 1.1, 1] : 1,
        }}
        transition={{
          scale: {
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 0.5,
          },
          x: { duration: 0.5, ease: 'easeOut' },
          y: { duration: 0.5, ease: 'easeOut' },
          opacity: { duration: 1 },
        }}
      />
    </div>
  );
};
