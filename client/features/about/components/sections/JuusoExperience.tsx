'use client';

import { juusoData } from '@/features/about/data/juusoData';
import { TimelineItem } from '@/features/project/components/ui/TimelineItem';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import React from 'react';

export function JuusoExperience() {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            Work Experience
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 h-1 bg-primary rounded"
            />
          </h2>
          <p className="text-default-600 max-w-3xl mx-auto">
            Frontend development journey and key achievements
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-default-200 transform -translate-x-1/2" />

          {/* Timeline items */}
          <div className="relative">
            {juusoData.experience.map((item, index) => (
              <TimelineItem
                key={`${item.year}-${item.title}`}
                year={item.year}
                title={item.title}
                company={item.company}
                description={item.description}
                index={index}
                isLast={index === juusoData.experience.length - 1}
              />
            ))}

            {/* Final marker */}
            <motion.div
              className="absolute left-1/2 bottom-0 transform -translate-x-1/2 flex flex-col items-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-5 h-5 rounded-full bg-primary-200 border-4 border-primary z-10" />
            </motion.div>
          </div>

          {/* Download CV button */}
          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button
                endContent={<Icon icon="lucide:download" />}
                color="primary"
                size="lg"
                as={Link}
                href="#"
                className="shadow-lg"
              >
                Download CV
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
