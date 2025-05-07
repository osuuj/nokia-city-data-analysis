'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface TimelineSectionProps {
  timeline: string;
}

export default function TimelineSection({ timeline }: TimelineSectionProps) {
  const generateTimelineEvents = (timeline: string) => {
    const dateMatch = timeline.match(/(\w+\s\d{4})\s*-\s*(\w+\s\d{4})/);

    if (dateMatch) {
      const startDate = dateMatch[1];
      const endDate = dateMatch[2];

      return [
        {
          date: startDate,
          title: 'Project Kickoff',
          description: 'Initial planning and requirement gathering phase',
          icon: 'lucide:flag',
        },
        {
          date: getMiddleDate(startDate, endDate),
          title: 'Development Phase',
          description: 'Core functionality implementation and testing',
          icon: 'lucide:code',
        },
        {
          date: endDate,
          title: 'Project Completion',
          description: 'Final testing, documentation and deployment',
          icon: 'lucide:check-circle',
        },
      ];
    }

    return [
      {
        date: 'Project Start',
        title: 'Project Kickoff',
        description: 'Initial planning and requirement gathering phase',
        icon: 'lucide:flag',
      },
      {
        date: 'Development',
        title: 'Development Phase',
        description: 'Core functionality implementation and testing',
        icon: 'lucide:code',
      },
      {
        date: 'Completion',
        title: 'Project Completion',
        description: 'Final testing, documentation and deployment',
        icon: 'lucide:check-circle',
      },
    ];
  };

  const getMiddleDate = (startDateStr: string, endDateStr: string) => {
    try {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const [startMonthName, startYearStr] = startDateStr.split(' ');
      const [endMonthName, endYearStr] = endDateStr.split(' ');

      const startMonth = months.indexOf(startMonthName);
      const endMonth = months.indexOf(endMonthName);

      const startYear = Number.parseInt(startYearStr);
      const endYear = Number.parseInt(endYearStr);

      let middleMonth: number;
      let middleYear: number;

      if (startYear === endYear) {
        middleMonth = Math.floor((startMonth + endMonth) / 2);
        middleYear = startYear;
      } else {
        const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
        const halfMonths = Math.floor(totalMonths / 2);

        middleYear = startYear + Math.floor((startMonth + halfMonths) / 12);
        middleMonth = (startMonth + halfMonths) % 12;
      }

      return `${months[middleMonth]} ${middleYear}`;
    } catch {
      return 'Mid-Project';
    }
  };

  const timelineEvents = generateTimelineEvents(timeline);

  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-default-200 dark:bg-default-700" />

      <div className="space-y-12">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={`${event.date}-${event.title}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
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
