import { motion } from 'framer-motion';
import React from 'react';

interface FlowingRibbonsProps {
  count: number;
  colors: string[];
  animationSpeed: number;
  mousePosition: { x: number; y: number };
  responseIntensity: number;
}

export const FlowingRibbons: React.FC<FlowingRibbonsProps> = ({
  count = 5,
  colors = ['rgba(104, 117, 245, 0.5)', 'rgba(159, 122, 234, 0.5)'],
  animationSpeed = 1,
  mousePosition,
  responseIntensity = 10,
}) => {
  // Generate ribbon data with randomized properties
  const ribbons = React.useMemo(() => {
    const ribbonArray = [];

    for (let i = 0; i < count; i++) {
      const depth = Math.random() * 200 - 100; // Z-position: -100 to 100
      const width = Math.random() * 20 + 5; // Width: 5 to 25% of viewport
      const color = colors[i % colors.length];
      const delay = Math.random() * 5;
      const duration = (Math.random() * 15 + 15) / animationSpeed; // 15-30 seconds, adjusted by animation speed

      // Generate control points for the flow path - more points = more complex path
      const controlPoints = [];
      const numPoints = Math.floor(Math.random() * 3) + 4; // 4-6 control points

      for (let j = 0; j < numPoints; j++) {
        controlPoints.push({
          x: Math.random() * 140 - 20, // -20% to 120% of viewport width
          y: Math.random() * 140 - 20, // -20% to 120% of viewport height
        });
      }

      ribbonArray.push({
        id: `ribbon-${i}`,
        width,
        color,
        delay,
        duration,
        depth,
        controlPoints,
      });
    }

    return ribbonArray;
  }, [count, colors, animationSpeed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ribbons.map((ribbon) => {
        // Calculate 3D transformation based on mouse position and ribbon's depth
        const depthFactor = ribbon.depth / 100; // -1 to 1
        const translateX = -mousePosition.x * responseIntensity * depthFactor;
        const translateY = -mousePosition.y * responseIntensity * depthFactor;

        // Generate SVG path from control points
        const pathCommands = [];
        const { controlPoints } = ribbon;

        // Start path
        pathCommands.push(`M ${controlPoints[0].x} ${controlPoints[0].y}`);

        // Add cubic bezier curves between points
        for (let i = 0; i < controlPoints.length - 1; i++) {
          const startPoint = controlPoints[i];
          const endPoint = controlPoints[i + 1];

          // Calculate control points for smooth curve
          const cp1 = {
            x: startPoint.x + (endPoint.x - startPoint.x) * 0.5 + (Math.random() * 30 - 15),
            y: startPoint.y + (Math.random() * 30 - 15),
          };

          const cp2 = {
            x: endPoint.x - (endPoint.x - startPoint.x) * 0.5 + (Math.random() * 30 - 15),
            y: endPoint.y + (Math.random() * 30 - 15),
          };

          pathCommands.push(`C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endPoint.x} ${endPoint.y}`);
        }

        // Complete the path for a closed shape
        const lastPoint = controlPoints[controlPoints.length - 1];
        const firstPoint = controlPoints[0];

        const finalCp1 = {
          x: lastPoint.x + (firstPoint.x - lastPoint.x) * 0.5 + (Math.random() * 30 - 15),
          y: lastPoint.y + (Math.random() * 30 - 15),
        };

        const finalCp2 = {
          x: firstPoint.x - (firstPoint.x - lastPoint.x) * 0.5 + (Math.random() * 30 - 15),
          y: firstPoint.y + (Math.random() * 30 - 15),
        };

        pathCommands.push(
          `C ${finalCp1.x} ${finalCp1.y}, ${finalCp2.x} ${finalCp2.y}, ${firstPoint.x} ${firstPoint.y}`,
        );

        const pathString = pathCommands.join(' ');

        return (
          <motion.div
            key={ribbon.id}
            className="absolute inset-0 overflow-visible"
            style={{
              transform: `perspective(1000px) translateZ(${ribbon.depth}px) translateX(${translateX}px) translateY(${translateY}px)`,
              width: `${100 + ribbon.width * 2}%`,
              height: `${100 + ribbon.width * 2}%`,
              left: `-${ribbon.width}%`,
              top: `-${ribbon.width}%`,
            }}
          >
            <svg
              className="absolute w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              role="img"
              aria-label="Flowing ribbon animation"
            >
              <title>Flowing ribbon animation</title>
              <motion.path
                d={pathString}
                fill={ribbon.color}
                initial={{
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 0.8, 0.8, 0],
                  pathOffset: [0, 0, 1, 1],
                }}
                transition={{
                  duration: ribbon.duration,
                  delay: ribbon.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                style={{
                  filter: 'blur(15px)',
                }}
              />

              <motion.path
                d={pathString}
                stroke={ribbon.color}
                strokeWidth="0.5"
                fill="none"
                initial={{
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                  pathOffset: [0, 0, 1, 1],
                }}
                transition={{
                  duration: ribbon.duration * 0.8,
                  delay: ribbon.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};
