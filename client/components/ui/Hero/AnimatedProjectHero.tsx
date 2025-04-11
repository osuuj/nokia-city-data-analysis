'use client';

import { Badge } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const categories = [
  {
    id: 'web',
    name: 'Web Platform',
    icon: 'lucide:globe',
    color: 'primary',
  },
  {
    id: 'ai',
    name: 'AI & ML',
    icon: 'lucide:brain',
    color: 'success',
  },
  {
    id: 'etl',
    name: 'Data Pipeline (ETL)',
    icon: 'lucide:database',
    color: 'warning',
  },
  {
    id: 'api',
    name: 'Backend API',
    icon: 'lucide:server',
    color: 'secondary',
  },
  {
    id: 'map',
    name: 'Geospatial (Mapbox)',
    icon: 'lucide:map',
    color: 'default',
  },
  {
    id: 'analytics',
    name: 'Company Analytics',
    icon: 'lucide:bar-chart-2',
    color: 'danger',
  },
] as const;

export function AnimatedProjectHero() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentCategory = categories[currentIndex];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden pt-1 pb-1 md:pt-3 md:pb-3">
      {/* 💫 Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <motion.div className="absolute inset-0 bg-gradient-to-b from-background to-content2" />
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-100 dark:bg-primary-900/30 opacity-30 blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary-100 dark:bg-secondary-900/30 opacity-30 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* 🔁 Animated Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Badge
                  color={currentCategory.color}
                  placement="bottom-right"
                  className="absolute bottom-1 right-1 translate-x-1/3"
                >
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full bg-${currentCategory.color}-100 dark:bg-${currentCategory.color}-900/30 mx-auto`}
                  >
                    <Icon
                      icon={currentCategory.icon}
                      className={`text-${currentCategory.color}-500 text-2xl`}
                    />
                  </div>
                </Badge>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 📝 Heading */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our Projects
        </motion.h1>

        {/* 💬 Description */}
        <motion.p
          className="text-default-600 text-base md:text-lg max-w-2xl mx-auto mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Explore our portfolio of innovative projects spanning various domains and technologies.
          Each project represents our commitment to excellence and creative problem-solving.
        </motion.p>
      </div>
    </div>
  );
}
