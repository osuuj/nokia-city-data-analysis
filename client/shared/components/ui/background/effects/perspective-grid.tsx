import { motion } from 'framer-motion';
import React from 'react';

interface PerspectiveGridProps {
  density: number;
  mousePosition: { x: number; y: number };
  color: string;
  responseIntensity: number;
  animationSpeed: number;
}

export const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({
  density = 10,
  mousePosition,
  color = 'rgba(72, 80, 109, 0.3)',
  responseIntensity = 15,
  animationSpeed = 1,
}) => {
  // Generate grid lines
  const horizontalLines = React.useMemo(() => {
    const lines = [];
    const spacing = 100 / density;

    for (let i = 0; i <= density; i++) {
      lines.push({
        id: `h-${i}`,
        y: spacing * i,
      });
    }

    return lines;
  }, [density]);

  const verticalLines = React.useMemo(() => {
    const lines = [];
    const spacing = 100 / density;

    for (let i = 0; i <= density; i++) {
      lines.push({
        id: `v-${i}`,
        x: spacing * i,
      });
    }

    return lines;
  }, [density]);

  // Calculate transformation based on mouse position
  const transform = React.useMemo(() => {
    const rotateX = mousePosition.y * responseIntensity;
    const rotateY = -mousePosition.x * responseIntensity;

    return {
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    };
  }, [mousePosition, responseIntensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 origin-center"
        style={{
          ...transform,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      >
        {/* Horizontal lines */}
        {horizontalLines.map((line) => (
          <div
            key={line.id}
            className="absolute left-0 w-full h-px"
            style={{
              top: `${line.y}%`,
              backgroundColor: color,
              transform: 'translateZ(0px)',
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 4 / animationSpeed,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          </div>
        ))}

        {/* Vertical lines */}
        {verticalLines.map((line) => (
          <div
            key={line.id}
            className="absolute top-0 h-full w-px"
            style={{
              left: `${line.x}%`,
              backgroundColor: color,
              transform: 'translateZ(0px)',
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 4 / animationSpeed,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          </div>
        ))}

        {/* Grid base plane */}
        <div
          className="absolute inset-0 bg-gradient-to-b"
          style={{
            backgroundImage: `linear-gradient(to bottom, transparent, ${color})`,
            opacity: 0.1,
            transform: 'translateZ(0px)',
          }}
        />
      </motion.div>
    </div>
  );
};
