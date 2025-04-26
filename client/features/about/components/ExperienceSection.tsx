'use client';

import { Card, CardBody, CardFooter, CardHeader, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import React, { memo } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Experience, ExperienceSectionProps } from '../types';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Memoized experience item component to prevent unnecessary re-renders
const ExperienceItem = memo(({ experience, index }: { experience: Experience; index: number }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div ref={ref} variants={itemVariants} className="mb-4">
      <Card className="backdrop-blur-md bg-opacity-85">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold">{experience.title}</h3>
          <span className="text-default-500 text-sm">{experience.period}</span>
        </CardHeader>
        <CardBody>
          <p className="text-primary font-medium mb-2">{experience.company}</p>
          <p className="text-default-600 mb-3">{experience.description}</p>
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {experience.technologies.map((tech: string) => (
                <Chip key={tech} size="sm" variant="flat">
                  {tech}
                </Chip>
              ))}
            </div>
          )}
        </CardBody>
        {experience.achievements && experience.achievements.length > 0 && (
          <CardFooter>
            <ul className="list-disc list-inside text-sm text-default-500">
              {experience.achievements.map((achievement: string, i: number) => (
                <li key={`${experience.id}-achievement-${achievement}`}>{achievement}</li>
              ))}
            </ul>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
});

ExperienceItem.displayName = 'ExperienceItem';

const ExperienceSection = ({ experiences, title = 'Experience' }: ExperienceSectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="mb-8"
      aria-labelledby="experience-title"
    >
      <h2 id="experience-title" className="text-2xl font-semibold mb-6">
        {title}
      </h2>
      <div className="space-y-4">
        {experiences.map((experience, index) => (
          <ExperienceItem
            key={`${experience.company}-${experience.title}-${index}`}
            experience={experience}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default memo(ExperienceSection);
