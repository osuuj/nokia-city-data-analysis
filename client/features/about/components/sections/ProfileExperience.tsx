'use client';

import { TimelineItem } from '@/features/project/components/ui/TimelineItem';
import { motion } from 'framer-motion';

type Experience = {
  year: string;
  title: string;
  company?: string;
  description: string;
};

type ProfileExperienceProps = {
  experience: Experience[];
  title?: string;
  description?: string;
  profileId?: string;
};

export function ProfileExperience({
  experience,
  title = 'Work Experience',
  description = 'Professional journey and key achievements',
  profileId,
}: ProfileExperienceProps) {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative text-black dark:text-white">
            {title}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 h-1 bg-primary rounded"
            />
          </h2>
          <p className="text-default-600 max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Timeline line for desktop - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-default-200 transform -translate-x-1/2" />

          {/* Timeline items */}
          <div className="relative">
            {experience.map((item, index) => (
              <TimelineItem
                key={`${item.year}-${item.title}`}
                year={item.year}
                title={item.title}
                company={item.company}
                description={item.description}
                index={index}
                isLast={index === experience.length - 1}
              />
            ))}

            {/* Final marker - Mobile version */}
            <div className="md:hidden relative pl-14 mb-12">
              <motion.div
                className="absolute left-5 top-0 -translate-x-1/2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-5 h-5 rounded-full bg-primary-200 border-4 border-primary" />
              </motion.div>
            </div>

            {/* Final marker - Desktop version */}
            <motion.div
              className="hidden md:flex absolute left-1/2 bottom-0 transform -translate-x-1/2 flex-col items-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-5 h-5 rounded-full bg-primary-200 border-4 border-primary z-10" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
