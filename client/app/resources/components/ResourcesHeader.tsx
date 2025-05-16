'use client';

import { motion } from 'framer-motion';

/**
 * ResourcesHeader component
 *
 * Displays the title and description for the resources page.
 */
export const ResourcesHeader = () => (
  <div className="text-center mb-10">
    <h1 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative text-black dark:text-white">
      Osuuj Data Resources
      <motion.span
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="absolute bottom-0 left-0 h-1 bg-primary rounded"
      />
    </h1>
    <p className="text-lg text-default-600 max-w-2xl mx-auto">
      Documentation and guides to help you get the most out of the Osuuj Data Analysis platform.
      <span className="block mt-2 text-warning-500 text-sm">
        Note: This documentation is currently under development.
      </span>
    </p>
  </div>
);
