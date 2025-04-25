const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.heroui.chat'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
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
    };
    return config;
  },
};

module.exports = nextConfig;
