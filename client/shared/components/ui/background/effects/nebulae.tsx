import { motion } from 'framer-motion';
import React, { useCallback } from 'react';

interface NebulaeProps {
  count: number;
  complexity: number;
  colors: string[];
  viewportDimensions: { width: number; height: number };
  parallaxStrength: number;
}

interface NebulaMesh {
  points: { x: number; y: number }[];
  radius: number;
  color: string;
  opacity: number;
  blurRadius: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  scaleSpeed: number;
  scaleDirection: boolean;
}

export const Nebulae: React.FC<NebulaeProps> = ({
  count = 4,
  complexity = 5,
  colors = ['rgba(111, 66, 193, 0.2)', 'rgba(58, 134, 255, 0.15)', 'rgba(29, 78, 216, 0.25)'],
  viewportDimensions,
  parallaxStrength = 4,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const meshesRef = React.useRef<NebulaMesh[]>([]);
  const animationFrameRef = React.useRef<number>();
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  // Generate nebula mesh
  const generateNebulaMesh = useCallback(() => {
    const meshes: NebulaMesh[] = [];
    for (let i = 0; i < count; i++) {
      const mesh: NebulaMesh = {
        points: [],
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
        radius: Math.min(viewportDimensions.width, viewportDimensions.height) * 0.2,
        blurRadius: 30 + Math.random() * 50,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.0002 - 0.0001) * (i % 2 === 0 ? 1 : -1),
        scale: 0.9 + Math.random() * 0.2,
        scaleSpeed: 0.0001 + Math.random() * 0.0001,
        scaleDirection: Math.random() > 0.5,
      };

      // Generate random points for the mesh
      for (let j = 0; j < complexity; j++) {
        mesh.points.push({
          x: Math.random() * viewportDimensions.width,
          y: Math.random() * viewportDimensions.height,
        });
      }

      meshes.push(mesh);
    }
    return meshes;
  }, [count, complexity, colors, viewportDimensions]);

  // Initialize meshes
  React.useEffect(() => {
    const meshes = generateNebulaMesh();
    meshesRef.current = meshes;
  }, [generateNebulaMesh]);

  // Mouse movement for nebulae parallax
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      const x = (e.clientX / viewportDimensions.width) * 2 - 1;
      const y = (e.clientY / viewportDimensions.height) * 2 - 1;
      setMousePosition({ x, y });
    },
    [viewportDimensions],
  );

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // Render nebulae
  React.useEffect(() => {
    if (!canvasRef.current || viewportDimensions.width === 0 || meshesRef.current.length === 0)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = viewportDimensions.width;
    canvas.height = viewportDimensions.height;

    // Animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'screen'; // Blend mode for more ethereal look

      // Parallax offset based on mouse position
      const parallaxX = mousePosition.x * parallaxStrength;
      const parallaxY = mousePosition.y * parallaxStrength;

      // Update and draw each nebula
      for (const [index, mesh] of meshesRef.current.entries()) {
        // Update rotation and scale over time
        mesh.rotation += mesh.rotationSpeed * deltaTime;

        if (mesh.scaleDirection) {
          mesh.scale += mesh.scaleSpeed * deltaTime;
          if (mesh.scale > 1.1) mesh.scaleDirection = false;
        } else {
          mesh.scale -= mesh.scaleSpeed * deltaTime;
          if (mesh.scale < 0.9) mesh.scaleDirection = true;
        }

        // Calculate center of the nebula for transformations
        const center = {
          x: mesh.points.reduce((sum, p) => sum + p.x, 0) / mesh.points.length,
          y: mesh.points.reduce((sum, p) => sum + p.y, 0) / mesh.points.length,
        };

        // Apply parallax offset (more for nebulae in front)
        const layerFactor = (index % 3) * 0.5 + 0.5;
        const offsetX = parallaxX * layerFactor;
        const offsetY = parallaxY * layerFactor;

        // Draw the nebula shape
        ctx.save();
        ctx.globalAlpha = mesh.opacity;

        // Begin path for the nebula shape
        ctx.beginPath();

        // Apply transformations from the center point
        ctx.translate(center.x + offsetX, center.y + offsetY);
        ctx.rotate(mesh.rotation);
        ctx.scale(mesh.scale, mesh.scale);
        ctx.translate(-center.x, -center.y);

        // Draw the shape
        ctx.moveTo(mesh.points[0].x, mesh.points[0].y);

        // Use bezier curves to create smooth nebula edges
        for (let i = 0; i < mesh.points.length; i++) {
          const curr = mesh.points[i];
          const next = mesh.points[(i + 1) % mesh.points.length];

          // Calculate control points
          const cp1x = curr.x + (next.x - curr.x) * 0.5 + (Math.random() * 20 - 10);
          const cp1y = curr.y + (next.y - curr.y) * 0.2 + (Math.random() * 20 - 10);
          const cp2x = curr.x + (next.x - curr.x) * 0.8 + (Math.random() * 20 - 10);
          const cp2y = curr.y + (next.y - curr.y) * 0.7 + (Math.random() * 20 - 10);

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
        }

        ctx.closePath();

        // Create gradient fills for more visual interest
        const gradient = ctx.createRadialGradient(
          center.x,
          center.y,
          0,
          center.x,
          center.y,
          mesh.radius,
        );

        // Adjust the color with varying opacities
        const baseColor = mesh.color.replace(/[\d\.]+\)$/, '');
        gradient.addColorStop(0, `${baseColor}${mesh.opacity * 1.5})`);
        gradient.addColorStop(0.5, mesh.color);
        gradient.addColorStop(1, `${baseColor}0)`);

        ctx.fillStyle = gradient;
        ctx.filter = `blur(${mesh.blurRadius}px)`;
        ctx.fill();

        ctx.restore();
      }

      ctx.globalCompositeOperation = 'source-over'; // Reset blend mode

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [viewportDimensions, mousePosition, parallaxStrength]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
