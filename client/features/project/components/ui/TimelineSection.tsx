'use client';

import { type TimelineEvent, getTimelineEvents } from '@/features/project/data/timeline';
import { useAnimationProps } from '@/shared/hooks';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface TimelineSectionProps {
  timeline: string;
  projectId?: string;
}

export default function TimelineSection({ timeline, projectId }: TimelineSectionProps) {
  // Get timeline events from either projectId or timeline string
  const timelineEvents: TimelineEvent[] = projectId
    ? getTimelineEvents(projectId)
    : getTimelineEvents(timeline);

  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-default-200 dark:bg-default-700" />

      <div className="space-y-12">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={`${event.date}-${event.title}`}
            {...useAnimationProps(
              'fadeInUp',
              { whileInView: true, once: true, duration: 0.5, delay: 0.2 },
              index,
            )}
            className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
              <Card className="shadow-md">
                <CardBody className="p-5">
                  <p className="text-sm text-default-500 mb-1">{event.date}</p>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-default-600">{event.description}</p>
                </CardBody>
              </Card>
            </div>

            <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 shadow-lg">
              <Icon icon={event.icon} className="text-white" />
            </div>

            <div className="w-1/2" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
