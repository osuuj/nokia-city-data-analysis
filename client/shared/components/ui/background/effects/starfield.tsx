import React from 'react';

interface StarfieldProps {
  count: number;
  depth: number;
  primaryColor: string;
  secondaryColor: string;
  viewportDimensions: { width: number; height: number };
  parallaxStrength: number;
  mousePosition: { x: number; y: number };
  scrollDirection: 'up' | 'down' | null;
  shootingStarFrequency?: number;
}

interface Star {
  x: number;
  y: number;
  z: number; // depth in 3D space (for parallax)
  size: number;
  brightness: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  speed: number;
  angle: number;
  length: number;
  active: boolean;
  createdAt: number;
}

export const Starfield: React.FC<StarfieldProps> = ({
  count = 800,
  depth = 5,
  primaryColor = 'rgba(255, 255, 255, 0.9)',
  secondaryColor = 'rgba(200, 220, 255, 0.85)',
  viewportDimensions,
  parallaxStrength = 20,
  mousePosition,
  scrollDirection,
  shootingStarFrequency = 0,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationFrameRef = React.useRef<number>();
  const starsRef = React.useRef<Star[]>([]);
  const shootingStarsRef = React.useRef<ShootingStar[]>([]);
  const lastShootingStarTimeRef = React.useRef<number>(0);

  // Initialize stars
  React.useEffect(() => {
    if (viewportDimensions.width === 0 || viewportDimensions.height === 0) return;

    const stars: Star[] = [];

    for (let i = 0; i < count; i++) {
      const z = Math.random() * depth; // Depth factor

      // Size and brightness affected by depth (z)
      const sizeFactor = (depth - z) / depth; // Closer = bigger
      const brightnessFactor = (depth - z) / depth; // Closer = brighter

      stars.push({
        x: Math.random() * (viewportDimensions.width + 200) - 100, // Slightly wider than viewport
        y: Math.random() * (viewportDimensions.height + 200) - 100, // Slightly taller than viewport
        z: z,
        size: Math.random() * 1.5 * sizeFactor + 0.5,
        brightness: brightnessFactor * 0.7 + 0.3,
        color: Math.random() > 0.3 ? primaryColor : secondaryColor,
        twinkleSpeed: Math.random() * 0.01 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2, // Random starting phase
      });
    }

    starsRef.current = stars;
  }, [count, depth, primaryColor, secondaryColor, viewportDimensions]);

  // Initialize shooting stars array
  React.useEffect(() => {
    shootingStarsRef.current = Array(5)
      .fill(null)
      .map(() => ({
        x: 0,
        y: 0,
        speed: 0,
        angle: 0,
        length: 0,
        active: false,
        createdAt: 0,
      }));
  }, []);

  // Draw stars on canvas
  React.useEffect(() => {
    if (!canvasRef.current || viewportDimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = viewportDimensions.width;
    canvas.height = viewportDimensions.height;

    const drawFrame = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      for (const star of starsRef.current) {
        // Calculate parallax offset based on mouse position and star depth
        const parallaxX = mousePosition.x * star.z * 0.05;
        const parallaxY = mousePosition.y * star.z * 0.05;

        // Apply scroll effect if applicable
        let scrollOffset = 0;
        if (scrollDirection === 'up') {
          scrollOffset = (-0.2 * star.z) / depth;
        } else if (scrollDirection === 'down') {
          scrollOffset = (0.2 * star.z) / depth;
        }

        // Update position with scroll direction
        let y = star.y + scrollOffset;

        // Wrap around if star moves out of view
        if (y < -100) y = viewportDimensions.height + 50;
        if (y > viewportDimensions.height + 100) y = -50;

        // Calculate twinkle effect
        const twinkle = Math.sin(timestamp * star.twinkleSpeed + star.twinklePhase) * 0.2 + 0.8;
        const finalSize = star.size * twinkle;
        const finalBrightness = star.brightness * twinkle;

        // Draw star with adjusted opacity
        const color = star.color.replace(')', `, ${finalBrightness})`);

        // Draw a circular star with slight glow
        ctx.beginPath();
        ctx.arc(star.x + parallaxX, y + parallaxY, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Add subtle glow effect for larger stars
        if (finalSize > 1) {
          ctx.beginPath();
          ctx.arc(star.x + parallaxX, y + parallaxY, finalSize * 2, 0, Math.PI * 2);
          ctx.fillStyle = color.replace(', ', ', 0.3');
          ctx.fill();
        }

        // For bright stars, add simple cross hairs
        if (finalSize > 1.3) {
          const glowSize = finalSize * 3;

          ctx.beginPath();
          ctx.moveTo(star.x + parallaxX - glowSize, y + parallaxY);
          ctx.lineTo(star.x + parallaxX + glowSize, y + parallaxY);
          ctx.strokeStyle = color.replace(', ', ', 0.15');
          ctx.lineWidth = 0.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(star.x + parallaxX, y + parallaxY - glowSize);
          ctx.lineTo(star.x + parallaxX, y + parallaxY + glowSize);
          ctx.strokeStyle = color.replace(', ', ', 0.15');
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        star.y = y; // Save updated y position
      }

      // Maybe create a shooting star
      if (shootingStarFrequency > 0) {
        const timeSinceLastStar = timestamp - lastShootingStarTimeRef.current;
        const chanceThisFrame = (shootingStarFrequency / 1000) * timeSinceLastStar;

        if (Math.random() < chanceThisFrame) {
          createShootingStar();
          lastShootingStarTimeRef.current = timestamp;
        }
      }

      // Update and draw shooting stars
      updateShootingStars(timestamp);
      drawShootingStars(ctx);

      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    animationFrameRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [viewportDimensions, mousePosition, depth, scrollDirection, shootingStarFrequency]);

  // Create a shooting star
  const createShootingStar = () => {
    // Set starting position at a random edge of the screen
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let startX: number;
    let startY: number;
    let angle: number;

    switch (side) {
      case 0: // top
        startX = Math.random() * viewportDimensions.width;
        startY = 0;
        angle = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        break;
      case 1: // right
        startX = viewportDimensions.width;
        startY = Math.random() * viewportDimensions.height;
        angle = Math.PI + (Math.random() - 0.5) * 0.5;
        break;
      case 2: // bottom
        startX = Math.random() * viewportDimensions.width;
        startY = viewportDimensions.height;
        angle = (Math.PI * 3) / 2 + (Math.random() - 0.5) * 0.5;
        break;
      case 3: // left
        startX = 0;
        startY = Math.random() * viewportDimensions.height;
        angle = (Math.random() - 0.5) * 0.5;
        break;
      default:
        startX = Math.random() * viewportDimensions.width;
        startY = 0;
        angle = Math.PI / 2;
    }

    // Create shooting star
    const shootingStar = {
      x: startX,
      y: startY,
      speed: 15 + Math.random() * 10,
      angle,
      length: 50 + Math.random() * 100,
      active: true,
      createdAt: Date.now(),
    };

    shootingStarsRef.current.push(shootingStar);
  };

  // Update shooting stars
  const updateShootingStars = (timestamp: number) => {
    for (const star of shootingStarsRef.current) {
      if (!star.active) return;

      // Update position
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;

      // Check if star is off screen
      if (
        star.x < -star.length ||
        star.x > viewportDimensions.width + star.length ||
        star.y < -star.length ||
        star.y > viewportDimensions.height + star.length
      ) {
        star.active = false;
      }
    }
  };

  // Draw shooting stars
  const drawShootingStars = (ctx: CanvasRenderingContext2D) => {
    for (const star of shootingStarsRef.current) {
      if (!star.active) return;

      // Calculate trail end point
      const trailX = star.x - Math.cos(star.angle) * star.length;
      const trailY = star.y - Math.sin(star.angle) * star.length;

      // Create gradient for trail
      const gradient = ctx.createLinearGradient(star.x, star.y, trailX, trailY);
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      // Draw trail
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(trailX, trailY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Add bright head
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();
    }
  };

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
