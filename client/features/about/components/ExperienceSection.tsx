import { motion } from 'framer-motion';
import React from 'react';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  title?: string;
}

export default function ExperienceSection({
  experiences,
  title = 'Experience',
}: ExperienceSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {experiences.map((experience, index) => (
          <div
            key={`${experience.company}-${experience.title}-${index}`}
            className="bg-content1 p-4 rounded-large backdrop-blur-md bg-opacity-85 border border-content2"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <h3 className="text-lg font-semibold">{experience.title}</h3>
              <span className="text-default-500 text-sm">{experience.period}</span>
            </div>
            <p className="text-primary font-medium mb-2">{experience.company}</p>
            <p className="text-default-600">{experience.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
