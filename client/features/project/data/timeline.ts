/**
 * Project timeline data
 */
export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProjectTimeline {
  id: string;
  events: TimelineEvent[];
}

/**
 * Timeline data for projects
 */
export const timelineData: Record<string, ProjectTimeline> = {
  'osuuj-platform': {
    id: 'osuuj-platform',
    events: [
      {
        date: 'Q3 2024',
        title: 'Ideation & Brainstorming',
        description:
          'Collaborative sessions with team members to generate and refine project ideas, define objectives, and outline key deliverables.',
        icon: 'lucide:lightbulb',
      },
      {
        date: 'Q4 2024',
        title: 'ETL Pipeline Implementation',
        description:
          'Developed the foundational ETL processes for data integration and transformation to support backend functionality.',
        icon: 'lucide:database',
      },
      {
        date: 'Q1 2025',
        title: 'Server Planning & UI Design',
        description:
          'Architected the server infrastructure and started UI/UX design using Figma and Octopus.do to map out user experience and flow.',
        icon: 'lucide:layout-dashboard',
      },
      {
        date: 'Q2 2025',
        title: 'Frontend Development & Deployment',
        description:
          'Implemented React frontend, integrated with backend services, and deployed the client to Vercel and server to AWS EC2. Finalized testing and documentation.',
        icon: 'lucide:rocket',
      },
    ],
  },
};

/**
 * Get timeline events for a project
 * @param id Project ID or timeline string
 * @returns Array of timeline events
 */
export function getTimelineEvents(id: string): TimelineEvent[] {
  // Check if we have predefined timeline data for this ID
  if (timelineData[id]) {
    return timelineData[id].events;
  }

  // Fallback: generate timeline events from a date range string (e.g., "Q4 2024 - Q2 2025")
  const dateMatch = id.match(/(\w+\s\d{4})\s*-\s*(\w+\s\d{4})/);

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

  // Default timeline for any other case
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
}

/**
 * Calculate a middle date between two date strings
 */
function getMiddleDate(startDateStr: string, endDateStr: string): string {
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
}
