import { motion } from 'framer-motion';
import React from 'react';

interface GlowPointsProps {
  count: number;
  colors: string[];
  viewportDimensions: { width: number; height: number };
  mousePosition: { x: number; y: number };
  responseIntensity: number;
  animationSpeed: number;
}

export const GlowPoints: React.FC<GlowPointsProps> = ({
  count = 6,
  colors = ['rgba(90, 103, 216, 0.6)', 'rgba(107, 70, 193, 0.5)'],
  viewportDimensions,
  mousePosition,
  responseIntensity = 5,
  animationSpeed = 1,
}) => {
  // Generate glow points with randomized properties
  const glowPoints = React.useMemo(() => {
    const points = [];

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 300 + 200;
      const x = Math.random() * 100; // percent
      const y = Math.random() * 100; // percent
      const depth = Math.random() * 500 - 250; // Z-position: -250 to 250
      const color = colors[i % colors.length];
      const blur = Math.random() * 50 + 70; // blur radius
      const opacity = Math.random() * 0.4 + 0.2;
      const duration = (Math.random() * 20 + 20) / animationSpeed; // Adjusted by animation speed
      const delay = Math.random() * 5;

      points.push({
        id: `glow-${i}`,
        size,
        x,
        y,
        depth,
        color,
        blur,
        opacity,
        duration,
        delay,
      });
    }

    return points;
  }, [count, colors, animationSpeed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {glowPoints.map((point) => {
        // Calculate 3D effect based on mouse position and point depth
        const depthFactor = point.depth / 250; // -1 to 1
        const translateX = -mousePosition.x * responseIntensity * depthFactor;
        const translateY = -mousePosition.y * responseIntensity * depthFactor;

        return (
          <motion.div
            key={point.id}
            className="absolute rounded-full"
            style={{
              width: point.size,
              height: point.size,
              left: `calc(${point.x}% - ${point.size / 2}px)`,
              top: `calc(${point.y}% - ${point.size / 2}px)`,
              transform: `translateX(${translateX}px) translateY(${translateY}px)`,
              backgroundColor: point.color,
              filter: `blur(${point.blur}px)`,
              opacity: point.opacity,
            }}
            initial={{ scale: 0.5 }}
            animate={{
              scale: [0.5, 1.2, 0.8, 1.1, 0.5],
              opacity: [
                point.opacity * 0.7,
                point.opacity,
                point.opacity * 0.8,
                point.opacity,
                point.opacity * 0.7,
              ],
            }}
            transition={{
              duration: point.duration,
              delay: point.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
};
