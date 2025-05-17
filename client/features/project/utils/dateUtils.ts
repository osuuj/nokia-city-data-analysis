/**
 * List of month names in order
 */
export const MONTHS = [
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

/**
 * Parses a timeline string in the format "Month YYYY - Month YYYY"
 * and returns start and end dates if found
 *
 * @param timeline Timeline string to parse
 * @returns Object with start and end date strings, or null if not parsable
 */
export function parseTimelineString(timeline: string): { start: string; end: string } | null {
  const dateMatch = timeline.match(/(\w+\s\d{4})\s*-\s*(\w+\s\d{4})/);

  if (dateMatch) {
    return {
      start: dateMatch[1],
      end: dateMatch[2],
    };
  }

  return null;
}

/**
 * Calculates the middle date between two date strings in the format "Month YYYY"
 *
 * @param startDateStr Start date string in "Month YYYY" format
 * @param endDateStr End date string in "Month YYYY" format
 * @returns Middle date as string in "Month YYYY" format, or 'Mid-Project' if calculation fails
 */
export function getMiddleDate(startDateStr: string, endDateStr: string): string {
  try {
    const [startMonthName, startYearStr] = startDateStr.split(' ');
    const [endMonthName, endYearStr] = endDateStr.split(' ');

    const startMonth = MONTHS.indexOf(startMonthName);
    const endMonth = MONTHS.indexOf(endMonthName);

    // Check for invalid months
    if (startMonth === -1 || endMonth === -1) {
      return 'Mid-Project';
    }

    const startYear = Number.parseInt(startYearStr);
    const endYear = Number.parseInt(endYearStr);

    // Check for invalid years
    if (Number.isNaN(startYear) || Number.isNaN(endYear)) {
      return 'Mid-Project';
    }

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

    return `${MONTHS[middleMonth]} ${middleYear}`;
  } catch {
    return 'Mid-Project';
  }
}

/**
 * Generates timeline events based on a timeline string
 *
 * @param timeline Timeline string to parse
 * @returns Array of timeline events with dates, titles, descriptions and icons
 */
export function generateTimelineEvents(timeline: string) {
  const parsedTimeline = parseTimelineString(timeline);

  if (parsedTimeline) {
    const { start, end } = parsedTimeline;

    return [
      {
        date: start,
        title: 'Project Kickoff',
        description: 'Initial planning and requirement gathering phase',
        icon: 'lucide:flag',
      },
      {
        date: getMiddleDate(start, end),
        title: 'Development Phase',
        description: 'Core functionality implementation and testing',
        icon: 'lucide:code',
      },
      {
        date: end,
        title: 'Project Completion',
        description: 'Final testing, documentation and deployment',
        icon: 'lucide:check-circle',
      },
    ];
  }

  // Default fallback timeline if parsing fails
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
