const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.heroui.chat',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
    // Optimized image formats - WebP and AVIF for better performance
    formats: ['image/webp', 'image/avif'],
    // Improved quality/size balance
    minimumCacheTTL: 60,
    // Device-specific image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  turbopack: {
    // Turbopack configuration (stable API)
    resolveAlias: {
      '@': path.resolve(__dirname),
      '@app': path.resolve(__dirname, 'app'),
      '@features': path.resolve(__dirname, 'features'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@components': path.resolve(__dirname, 'shared/components'),
      '@hooks': path.resolve(__dirname, 'shared/hooks'),
      '@layout': path.resolve(__dirname, 'shared/layout'),
      '@config': path.resolve(__dirname, 'config'),
      '@store': path.resolve(__dirname, 'store'),
      '@icons': path.resolve(__dirname, 'shared/icons'),
      '@types': path.resolve(__dirname, 'types'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@dashboard': path.resolve(__dirname, 'features/dashboard'),
      '@dashboard-components': path.resolve(__dirname, 'features/dashboard/components'),
      '@dashboard-hooks': path.resolve(__dirname, 'features/dashboard/hooks'),
      '@dashboard-types': path.resolve(__dirname, 'features/dashboard/types'),
      '@dashboard-utils': path.resolve(__dirname, 'features/dashboard/utils'),
    },
  },
  // Keep webpack config for production builds
  webpack: (config) => {
    // Remove CSP-specific alias for mapbox-gl
    config.resolve.alias = {
      ...config.resolve.alias,
      // No CSP alias
    };
    return config;
  },
  // Configure a custom build directory
  distDir: process.env.NEXT_CUSTOM_BUILD_DIR || '.next',
  // Optimize runtime performance
  reactStrictMode: true,
  // Optimize text compression
  compress: true,
  // Improve loading performance
  experimental: {
    optimizeCss: true,
    // Improved bundle splitting
    optimizePackageImports: ['framer-motion', '@heroui/react'],
  },
};

module.exports = nextConfig;
