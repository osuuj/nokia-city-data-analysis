import { motion } from 'framer-motion';
import React from 'react';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface EducationSectionProps {
  education: Education[];
  title?: string;
}

export default function EducationSection({
  education,
  title = 'Education',
}: EducationSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div
            key={`${edu.institution}-${edu.degree}-${index}`}
            className="bg-content1 p-4 rounded-large backdrop-blur-md bg-opacity-85 border border-content2"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <span className="text-default-500 text-sm">{edu.year}</span>
            </div>
            <p className="text-primary font-medium">{edu.institution}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
