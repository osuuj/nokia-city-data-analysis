'use client';

import { AnimatedSkillBar } from '@/features/about/components/ui';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type Skill = {
  name: string;
  level: number;
};

type ProfileSkillsProps = {
  skills: Skill[];
  title?: string;
  description?: string;
};

export function ProfileSkills({
  skills,
  title = 'Technical Skills',
  description = 'Expertise and proficiency levels',
}: ProfileSkillsProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="skills" className="py-24 bg-default-50/50">
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

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 max-w-5xl mx-auto"
          ref={ref}
        >
          {skills.map((skill, index) => (
            <AnimatedSkillBar
              key={skill.name}
              name={skill.name}
              level={skill.level}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
