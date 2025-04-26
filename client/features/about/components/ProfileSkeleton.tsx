import { Card } from '@heroui/card';
import { motion } from 'framer-motion';
import React from 'react';

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function ProfileSkeleton() {
  return (
    <motion.div
      className="space-y-8 max-w-4xl mx-auto px-4 py-8"
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2" />
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4" />
            <div className="h-20 bg-gray-200 animate-pulse rounded mb-6" />
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </Card>

      <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
      <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
      <div className="h-48 bg-gray-200 animate-pulse rounded-lg" />
      <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
    </motion.div>
  );
}
