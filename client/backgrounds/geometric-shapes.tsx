import { motion } from 'framer-motion';
import React from 'react';

interface GeometricShapesProps {
  count: number;
  themeMode: 'light' | 'dark';
}

export const GeometricShapes: React.FC<GeometricShapesProps> = ({
  count = 15,
  themeMode = 'dark',
}) => {
  const shapes = React.useMemo(() => {
    const shapesArray = [];
    const shapeTypes = ['circle', 'square', 'triangle', 'line'];

    // Create shapes with random properties
    for (let i = 0; i < count; i++) {
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const size = Math.random() * 140 + 60;
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const duration = Math.random() * 60 + 40;
      const delay = Math.random() * 10;
      const opacity = Math.random() * 0.12 + 0.03;

      // Colors based on theme
      const colors =
        themeMode === 'dark'
          ? [
              'rgba(150, 120, 255, opacity)',
              'rgba(100, 100, 255, opacity)',
              'rgba(120, 150, 255, opacity)',
            ]
          : [
              'rgba(100, 130, 255, opacity)',
              'rgba(130, 160, 255, opacity)',
              'rgba(160, 180, 255, opacity)',
            ];

      const color = colors[Math.floor(Math.random() * colors.length)].replace(
        'opacity',
        opacity.toString(),
      );

      shapesArray.push({
        id: i,
        type: shapeType,
        size,
        left,
        top,
        color,
        duration,
        delay,
        rotate: Math.random() * 360,
      });
    }

    return shapesArray;
  }, [count, themeMode]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: shape.left,
            top: shape.top,
            width: shape.size,
            height: shape.type !== 'line' ? shape.size : 2,
          }}
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{
            opacity: 1,
            scale: [0.7, 1, 0.9, 1.1, 0.8, 1],
            rotate: shape.rotate + 360,
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        >
          {shape.type === 'circle' && (
            <div
              className="h-full w-full rounded-full"
              style={{ backgroundColor: shape.color, filter: 'blur(8px)' }}
            />
          )}

          {shape.type === 'square' && (
            <div
              className="h-full w-full"
              style={{ backgroundColor: shape.color, filter: 'blur(8px)' }}
            />
          )}

          {shape.type === 'triangle' && (
            <div
              className="h-0 w-0"
              style={{
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
                filter: 'blur(8px)',
              }}
            />
          )}

          {shape.type === 'line' && (
            <div
              style={{
                height: '2px',
                width: `${shape.size}px`,
                backgroundColor: shape.color,
                filter: 'blur(4px)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};
