import { motion } from 'framer-motion';
import React from 'react';

interface Skill {
  name: string;
  level: number;
}

interface SkillsSectionProps {
  skills: Skill[];
  title?: string;
}

export default function SkillsSection({ skills, title = 'Skills' }: SkillsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
      aria-labelledby="skills-title"
    >
      <h2 id="skills-title" className="text-2xl font-semibold mb-4">
        {title}
      </h2>
      <ul className="grid gap-4" aria-label="Skills list">
        {skills.map((skill, index) => (
          <li
            key={skill.name}
            className="bg-content1 p-4 rounded-large backdrop-blur-md bg-opacity-85 border border-content2"
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium">{skill.name}</span>
              <span className="text-default-500" aria-label={`${skill.level} percent`}>
                {skill.level}%
              </span>
            </div>
            <progress
              className="h-2 bg-default-100 rounded-full overflow-hidden"
              value={skill.level}
              max={100}
              aria-label={`${skill.name} skill level: ${skill.level}%`}
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </progress>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
