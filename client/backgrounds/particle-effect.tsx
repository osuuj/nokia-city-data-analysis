import React from 'react';

interface ParticleEffectProps {
  count: number;
  opacity: number;
  size: number;
  color: string;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  count = 60,
  opacity = 0.6,
  size = 2,
  color = 'rgba(255, 255, 255, 0.7)',
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const animationRef = React.useRef<number>();
  const particlesRef = React.useRef<Particle[]>([]);

  // Define particle class
  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    pulseSpeed: number;
    pulseDirection: boolean;
    connections: number[];

    constructor(width: number, height: number) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * size + 0.5;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.speedY = Math.random() * 0.6 - 0.3;
      this.opacity = Math.random() * opacity * 0.8 + opacity * 0.2;
      this.pulseSpeed = Math.random() * 0.01 + 0.005;
      this.pulseDirection = Math.random() > 0.5;
      this.connections = []; // Stores indices of connected particles
    }

    update(width: number, height: number) {
      // Update position
      this.x += this.speedX;
      this.y += this.speedY;

      // Pulse size and opacity for organic feel
      if (this.pulseDirection) {
        this.opacity += this.pulseSpeed;
        if (this.opacity >= opacity) {
          this.pulseDirection = false;
        }
      } else {
        this.opacity -= this.pulseSpeed;
        if (this.opacity <= opacity * 0.5) {
          this.pulseDirection = true;
        }
      }

      // Boundary checking with bounce
      if (this.x < 0 || this.x > width) {
        this.speedX *= -1;
      }
      if (this.y < 0 || this.y > height) {
        this.speedY *= -1;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(')', `, ${this.opacity})`);
      ctx.fill();
    }

    findConnections(particles: Particle[], maxDistance: number, threshold: number) {
      this.connections = [];
      for (let i = 0; i < particles.length; i++) {
        if (particles[i] === this) continue;

        const dx = this.x - particles[i].x;
        const dy = this.y - particles[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance && Math.random() > threshold) {
          this.connections.push(i);
        }
      }
    }
  }

  // Handle window resize
  React.useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Create and animate particles
  React.useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle(canvas.width, canvas.height));
      }

      // Calculate initial connections
      const maxDistance = Math.min(dimensions.width, dimensions.height) * 0.15;
      for (const particle of particlesRef.current) {
        particle.findConnections(particlesRef.current, maxDistance, 0.7);
      }
    };

    initParticles();

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const maxDistance = Math.min(dimensions.width, dimensions.height) * 0.15;

      // Update and draw particles
      for (const particle of particles) {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);

        // Reset connections for next frame
        particle.connections = [];
      }

      // Draw connections
      for (const particle of particles) {
        for (const connectedIndex of particle.connections) {
          const connectedParticle = particles[connectedIndex];
          const distance = Math.sqrt(
            (particle.x - connectedParticle.x) ** 2 + (particle.y - connectedParticle.y) ** 2,
          );
          const opacity = 1 - distance / maxDistance;

          if (opacity > 0) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(connectedParticle.x, connectedParticle.y);
            ctx.strokeStyle = `rgba(${color}, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, count, color]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-1"
      style={{ opacity: 0.8 }}
    />
  );
};
