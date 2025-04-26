'use client';

import { Card, CardBody, Progress } from '@heroui/react';
import { motion } from 'framer-motion';
import React, { memo, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import type { SkillsSectionProps } from '../types';

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

// Memoized skill item component to prevent unnecessary re-renders
const SkillItem = memo(
  ({ skill, index }: { skill: { name: string; level: number }; index: number }) => {
    const { ref, inView } = useInView({
      threshold: 0.2,
      triggerOnce: true,
    });

    // Map skill level to color based on proficiency
    const getColorByLevel = (level: number) => {
      if (level >= 90) return 'success';
      if (level >= 75) return 'primary';
      if (level >= 60) return 'secondary';
      return 'warning';
    };

    return (
      <motion.div ref={ref} variants={itemVariants} className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{skill.name}</span>
          <motion.span
            className="text-default-500"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          >
            {skill.level}%
          </motion.span>
        </div>
        <Progress
          value={skill.level}
          color={getColorByLevel(skill.level)}
          className="h-2"
          aria-label={`${skill.name} skill level: ${skill.level}%`}
          showValueLabel={false}
        />
      </motion.div>
    );
  },
);

SkillItem.displayName = 'SkillItem';

// Group skills by category for better organization
const SkillsSection = ({ skills, title = 'Skills' }: SkillsSectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Memoize the grouped skills to prevent recalculation on every render
  const groupedSkills = useMemo(() => {
    const groups: Record<string, typeof skills> = {};

    for (const skill of skills) {
      const category = skill.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(skill);
    }

    return groups;
  }, [skills]);

  return (
    <motion.section
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="mb-8"
      aria-labelledby="skills-title"
    >
      <Card className="backdrop-blur-md bg-opacity-85">
        <CardBody>
          <h2 id="skills-title" className="text-2xl font-semibold mb-6">
            {title}
          </h2>

          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-4 capitalize">{category}</h3>
              {categorySkills.map((skill, index) => (
                <SkillItem key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          ))}
        </CardBody>
      </Card>
    </motion.section>
  );
};

export default memo(SkillsSection);
