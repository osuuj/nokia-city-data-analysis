import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import type React from 'react';
import { useInView } from 'react-intersection-observer';

interface TimelineItemProps {
  year: string;
  title: string;
  company: string;
  description: string;
  index: number;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  year,
  title,
  company,
  description,
  index,
  isLast = false,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const alignRight = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative mb-8 flex ${alignRight ? 'justify-end' : 'justify-start'} md:justify-normal`}
    >
      {/* Timeline line */}
      <div
        className={`absolute left-1/2 h-full w-px bg-default-200 transform -translate-x-1/2 ${isLast ? 'hidden' : ''}`}
      />

      {/* Year marker */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="w-5 h-5 rounded-full bg-primary border-4 border-content1 z-10 shadow-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
          className="mt-2 py-1 px-3 bg-primary-100 dark:bg-primary-900 rounded-full text-xs font-medium text-primary-700 dark:text-primary-300"
        >
          {year}
        </motion.div>
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: alignRight ? 50 : -50 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: alignRight ? 50 : -50 }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
        className={`md:w-5/12 z-10 ${alignRight ? 'md:ml-auto md:mr-8' : 'md:mr-auto md:ml-8'}`}
      >
        <Card className="shadow-md">
          <CardBody>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-primary-500 mb-3">{company}</p>
            <p className="text-sm text-default-600">{description}</p>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
