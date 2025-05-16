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
      Resource Center
      <motion.span
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="absolute bottom-0 left-0 h-1 bg-primary rounded"
      />
    </h1>
    <p className="text-lg text-default-600 max-w-2xl mx-auto">
      Find all the tools, guides, and resources you need to help your business thrive in our
      community.
    </p>
  </div>
);
