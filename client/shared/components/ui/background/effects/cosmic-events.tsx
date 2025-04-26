import { motion } from 'framer-motion';
import React from 'react';

interface CosmicEventsProps {
  frequency: number;
  eventColor: string;
  viewportDimensions: { width: number; height: number };
  mousePosition: { x: number; y: number };
}

interface CosmicEvent {
  type: 'supernova' | 'pulsar' | 'blackhole';
  x: number;
  y: number;
  size: number;
  opacity: number;
  phase: number;
  speed: number;
  color: string;
  active: boolean;
  duration: number;
  elapsed: number;
}

export const CosmicEvents: React.FC<CosmicEventsProps> = ({
  frequency = 0.5,
  eventColor = 'rgba(219, 39, 119, 0.7)',
  viewportDimensions,
  mousePosition,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const eventsRef = React.useRef<CosmicEvent[]>([]);
  const lastEventTimeRef = React.useRef<number>(0);
  const animationFrameRef = React.useRef<number>();

  // Initialize event pool
  React.useEffect(() => {
    // Pre-create inactive events that can be activated later
    eventsRef.current = Array(5)
      .fill(null)
      .map(() => ({
        type: 'supernova',
        x: 0,
        y: 0,
        size: 0,
        opacity: 0,
        phase: 0,
        speed: 0,
        color: eventColor,
        active: false,
        duration: 0,
        elapsed: 0,
      }));
  }, [eventColor]);

  // Main rendering loop
  React.useEffect(() => {
    if (!canvasRef.current || viewportDimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = viewportDimensions.width;
    canvas.height = viewportDimensions.height;

    // Supernova effect
    const drawSupernova = (
      ctx: CanvasRenderingContext2D,
      event: CosmicEvent,
      parallaxX: number,
      parallaxY: number,
    ) => {
      const { x, y, size, phase, color } = event;
      const adjustedX = x + parallaxX;
      const adjustedY = y + parallaxY;

      // Draw outer glow
      const gradient = ctx.createRadialGradient(
        adjustedX,
        adjustedY,
        0,
        adjustedX,
        adjustedY,
        size * 2,
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw shockwave
      const shockwaveSize = size * (1 + Math.sin(phase) * 0.2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, shockwaveSize, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Pulsar effect
    const drawPulsar = (
      ctx: CanvasRenderingContext2D,
      event: CosmicEvent,
      parallaxX: number,
      parallaxY: number,
    ) => {
      const { x, y, size, phase, color } = event;
      const adjustedX = x + parallaxX;
      const adjustedY = y + parallaxY;

      // Draw pulsar core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, size * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Draw energy rings
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const ringPhase = phase + (i * Math.PI) / ringCount;
        const ringSize = size * (0.5 + Math.sin(ringPhase) * 0.3);
        const ringOpacity = 0.5 + Math.sin(ringPhase) * 0.5;

        ctx.strokeStyle = color.replace(')', `, ${ringOpacity})`);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(adjustedX, adjustedY, ringSize, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw energy beams
      const beamCount = 4;
      for (let i = 0; i < beamCount; i++) {
        const beamAngle = (i * Math.PI * 2) / beamCount + phase;
        const beamLength = size * (1 + Math.sin(phase * 2) * 0.3);
        const endX = adjustedX + Math.cos(beamAngle) * beamLength;
        const endY = adjustedY + Math.sin(beamAngle) * beamLength;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(adjustedX, adjustedY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    };

    // Blackhole effect
    const drawBlackhole = (
      ctx: CanvasRenderingContext2D,
      event: CosmicEvent,
      parallaxX: number,
      parallaxY: number,
    ) => {
      const { x, y, size, phase, color } = event;
      const adjustedX = x + parallaxX;
      const adjustedY = y + parallaxY;

      // Draw accretion disk
      const diskGradient = ctx.createRadialGradient(
        adjustedX,
        adjustedY,
        size * 0.2,
        adjustedX,
        adjustedY,
        size,
      );
      diskGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      diskGradient.addColorStop(0.5, color);
      diskGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = diskGradient;
      ctx.beginPath();
      ctx.ellipse(adjustedX, adjustedY, size, size * 0.3, phase, 0, Math.PI * 2);
      ctx.fill();

      // Draw event horizon
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, size * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Draw gravitational lensing effect
      const lensGradient = ctx.createRadialGradient(
        adjustedX,
        adjustedY,
        size * 0.2,
        adjustedX,
        adjustedY,
        size * 1.5,
      );
      lensGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      lensGradient.addColorStop(0.5, color.replace(')', ', 0.1)'));
      lensGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = lensGradient;
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, size * 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    // Create a new cosmic event
    const createCosmicEvent = (timestamp: number) => {
      const inactiveEvent = eventsRef.current.find((event) => !event.active);
      if (!inactiveEvent) return;

      // Determine event type
      const types: ('supernova' | 'pulsar' | 'blackhole')[] = ['supernova', 'pulsar', 'blackhole'];
      const type = types[Math.floor(Math.random() * types.length)];

      // Position with distance from edges
      const margin = viewportDimensions.width * 0.15;
      const x = margin + Math.random() * (viewportDimensions.width - margin * 2);
      const y = margin + Math.random() * (viewportDimensions.height - margin * 2);

      // Configure the event based on its type
      let size: number;
      let duration: number;
      let speed: number;

      switch (type) {
        case 'supernova':
          size = Math.random() * 100 + 50;
          duration = Math.random() * 5000 + 3000;
          speed = 0.002 + Math.random() * 0.002;
          break;
        case 'pulsar':
          size = Math.random() * 30 + 20;
          duration = Math.random() * 8000 + 5000;
          speed = 0.005 + Math.random() * 0.01;
          break;
        case 'blackhole':
          size = Math.random() * 80 + 40;
          duration = Math.random() * 10000 + 7000;
          speed = 0.001 + Math.random() * 0.001;
          break;
        default:
          size = 50;
          duration = 5000;
          speed = 0.003;
      }

      // Activate the event
      inactiveEvent.type = type;
      inactiveEvent.x = x;
      inactiveEvent.y = y;
      inactiveEvent.size = size;
      inactiveEvent.opacity = 0;
      inactiveEvent.phase = 0;
      inactiveEvent.speed = speed;
      inactiveEvent.color = eventColor;
      inactiveEvent.active = true;
      inactiveEvent.duration = duration;
      inactiveEvent.elapsed = 0;

      lastEventTimeRef.current = timestamp;
    };

    let lastTime = 0;
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and render events
      for (const event of eventsRef.current) {
        if (!event.active) return;

        event.elapsed += deltaTime;
        event.phase += event.speed;

        // Calculate opacity based on elapsed time
        const progress = event.elapsed / event.duration;
        if (progress < 0.2) {
          event.opacity = progress * 5;
        } else if (progress > 0.8) {
          event.opacity = (1 - progress) * 5;
        } else {
          event.opacity = 1;
        }

        // Render event based on type
        ctx.save();
        ctx.globalAlpha = event.opacity;

        // Calculate parallax effect
        const parallaxX = mousePosition.x * 10;
        const parallaxY = mousePosition.y * 10;

        switch (event.type) {
          case 'supernova':
            drawSupernova(ctx, event, parallaxX, parallaxY);
            break;
          case 'pulsar':
            drawPulsar(ctx, event, parallaxX, parallaxY);
            break;
          case 'blackhole':
            drawBlackhole(ctx, event, parallaxX, parallaxY);
            break;
        }

        ctx.restore();

        // Deactivate event if duration exceeded
        if (event.elapsed >= event.duration) {
          event.active = false;
        }
      }

      // Create new events based on frequency
      if (timestamp - lastEventTimeRef.current > frequency) {
        createCosmicEvent(timestamp);
      }

      // Continue animation
      requestAnimationFrame(animate);
    };

    // Start animation
    requestAnimationFrame(animate);

    // Cleanup
    return () => {
      // No cleanup needed as requestAnimationFrame is automatically cancelled
      // when the component unmounts
    };
  }, [viewportDimensions, mousePosition, frequency, eventColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-1 pointer-events-none" />;
};
