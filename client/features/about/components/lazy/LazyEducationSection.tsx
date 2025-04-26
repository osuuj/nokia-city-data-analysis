'use client';

import { Card, CardBody, CardFooter, CardHeader, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import React, { memo } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Education, EducationSectionProps } from '../../types';

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

// Memoized education item component to prevent unnecessary re-renders
const EducationItem = memo(({ education, index }: { education: Education; index: number }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div ref={ref} variants={itemVariants} className="mb-4">
      <Card className="backdrop-blur-md bg-opacity-85">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold">{education.degree}</h3>
          <div className="text-sm text-default-600">
            {education.startDate} - {education.endDate || 'Present'}
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-primary font-medium mb-2">{education.institution}</p>
          <div className="text-sm text-default-500">
            {education.degree} in {education.field}
          </div>
          {education.description && (
            <div className="mt-2 text-sm text-default-500">{education.description}</div>
          )}
          {education.gpa && (
            <div className="flex items-center gap-2">
              <span className="font-medium">GPA:</span>
              <Chip size="sm" variant="flat" color="primary">
                {education.gpa}
              </Chip>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
});

EducationItem.displayName = 'EducationItem';

const LazyEducationSection = ({ education, title = 'Education' }: EducationSectionProps) => {
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
      aria-labelledby="education-title"
    >
      <h2 id="education-title" className="text-2xl font-semibold mb-6">
        {title}
      </h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <EducationItem
            key={`${edu.institution}-${edu.degree}-${index}`}
            education={edu}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default memo(LazyEducationSection);
