import React from 'react';
import { FlowingRibbons } from './flowing-ribbons';
import { GlowPoints } from './glow-points';
import { PerspectiveGrid } from './perspective-grid';

interface DynamicBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ intensity = 'medium' }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [viewportDimensions, setViewportDimensions] = React.useState({
    width: 0,
    height: 0,
  });
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
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial dimensions
    setViewportDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    mediaQuery.addEventListener('change', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle mouse movement for 3D effect
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();

        // Calculate normalized values (-1 to 1) for center-based coordinates
        const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        setMousePosition({
          x: normalizedX,
          y: normalizedY,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate intensity parameters based on intensity prop and device
  const intensityParams = React.useMemo(() => {
    const params = {
      gridDensity: 12,
      ribbonCount: 5,
      glowPointCount: 6,
      animationSpeed: 1,
      perspective: 1000,
      responseIntensity: 15,
    };

    if (intensity === 'low') {
      params.gridDensity = 8;
      params.ribbonCount = 3;
      params.glowPointCount = 4;
      params.animationSpeed = 0.7;
      params.perspective = 800;
      params.responseIntensity = 10;
    } else if (intensity === 'high') {
      params.gridDensity = 16;
      params.ribbonCount = 7;
      params.glowPointCount = 8;
      params.animationSpeed = 1.3;
      params.perspective = 1200;
      params.responseIntensity = 20;
    }

    // Reduce complexity on mobile
    if (isMobile) {
      params.gridDensity = Math.round(params.gridDensity * 0.6);
      params.ribbonCount = Math.max(2, Math.round(params.ribbonCount * 0.7));
      params.glowPointCount = Math.max(2, Math.round(params.glowPointCount * 0.7));
      params.perspective = params.perspective * 0.8;
    }

    return params;
  }, [intensity, isMobile]);

  // Color scheme based on theme
  const themeColors = React.useMemo(() => {
    return themeMode === 'dark'
      ? {
          primary: '#2D3748',
          secondary: '#1A202C',
          accent1: '#5A67D8',
          accent2: '#6B46C1',
          accent3: '#805AD5',
          glow1: 'rgba(90, 103, 216, 0.6)',
          glow2: 'rgba(107, 70, 193, 0.5)',
          grid: 'rgba(72, 80, 109, 0.3)',
          ribbon1: 'rgba(104, 117, 245, 0.5)',
          ribbon2: 'rgba(159, 122, 234, 0.5)',
        }
      : {
          primary: '#F7FAFC',
          secondary: '#EDF2F7',
          accent1: '#5A67D8',
          accent2: '#6B46C1',
          accent3: '#805AD5',
          glow1: 'rgba(90, 103, 216, 0.4)',
          glow2: 'rgba(107, 70, 193, 0.3)',
          grid: 'rgba(160, 174, 192, 0.2)',
          ribbon1: 'rgba(104, 117, 245, 0.3)',
          ribbon2: 'rgba(159, 122, 234, 0.3)',
        };
  }, [themeMode]);

  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 overflow-hidden"
      style={{ perspective: `${intensityParams.perspective}px` }}
    >
      {/* Base gradient background */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background:
            themeMode === 'dark'
              ? `linear-gradient(to bottom right, ${themeColors.secondary}, ${themeColors.primary})`
              : `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary})`,
        }}
      />

      {/* 3D Perspective Grid */}
      <PerspectiveGrid
        density={intensityParams.gridDensity}
        mousePosition={mousePosition}
        color={themeColors.grid}
        responseIntensity={intensityParams.responseIntensity}
        animationSpeed={intensityParams.animationSpeed}
      />

      {/* Flowing ribbons */}
      <FlowingRibbons
        count={intensityParams.ribbonCount}
        colors={[themeColors.ribbon1, themeColors.ribbon2]}
        animationSpeed={intensityParams.animationSpeed}
        mousePosition={mousePosition}
        responseIntensity={intensityParams.responseIntensity * 0.5}
      />

      {/* Glow points */}
      <GlowPoints
        count={intensityParams.glowPointCount}
        colors={[themeColors.glow1, themeColors.glow2]}
        viewportDimensions={viewportDimensions}
        mousePosition={mousePosition}
        responseIntensity={intensityParams.responseIntensity * 0.3}
        animationSpeed={intensityParams.animationSpeed}
      />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none" />
    </div>
  );
};
