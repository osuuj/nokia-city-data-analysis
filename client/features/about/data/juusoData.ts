/**
 * Data for Juuso's profile page
 */

export const juusoData = {
  skills: [
    { name: 'React', level: 85 },
    { name: 'Next.js', level: 80 },
    { name: 'TypeScript', level: 80 },
    { name: 'Component Libraries (e.g., HeroUI)', level: 90 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'Animation & Motion', level: 65 },
    { name: 'Testing & Accessibility', level: 70 },
    { name: 'Python', level: 90 },
    { name: 'SQL', level: 75 },
    { name: 'ETL Development', level: 80 },
    { name: 'Machine Learning (ML)', level: 80 },
    { name: 'Apache Airflow', level: 65 },
    { name: 'Power BI', level: 75 },
    { name: 'Cloud (AWS / GCP)', level: 70 },
    { name: 'Git & GitHub', level: 80 },
  ],

  projects: [
    {
      id: '1',
      title: 'Osuuj Company Search Platform',
      description:
        'A comprehensive company discovery platform designed for analysts, researchers, and job seekers to explore and analyze organizations across regions.',
      tech: ['Python', 'Pandas', 'Postgres', 'ETL', 'FastAPI', 'React', 'Next.js', 'TypeScript'],
      image: '/images/projects/osuuj-platform.webp',
      link: '/project/1',
      hasDemo: true,
    },
    {
      id: '2',
      title: 'Travel Companion App',
      description:
        'Mobile application for travelers to discover local experiences, plan itineraries and connect with other adventurers.',
      tech: ['React Native', 'Firebase', 'Maps API', 'Redux'],
      image: '/images/projects/travel-app.webp',
      link: '/project/2',
      hasDemo: false,
    },
    {
      id: '2',
      title: 'Healthcare Portal',
      description:
        'Secure patient portal for scheduling appointments, accessing medical records and communicating with healthcare providers.',
      tech: ['Next.js', 'GraphQL', 'TailwindCSS', 'Auth0'],
      image: '/images/projects/healthcare-portal.webp',
      link: '/project/2',
      hasDemo: false,
    },
  ],

  experience: [
    {
      year: '10/2024-Present',
      title: 'Lead Developer',
      description:
        'Led the development of the Osuuj Search Platform, enabling company search and analysis across Finnish cities. Built the frontend with Next.js and TypeScript, implemented responsive UI with HeroUI, and developed interactive map visualizations and advanced search features. Collaborated on geospatial data integration and established frontend coding standards.',
    },
    {
      year: '11/2022-8/2024',
      title: 'Production Worker',
      company: 'Nokian Tyres',
      description:
        'Operated an assembly machine, ensuring production efficiency and continuous improvement. Trained new employees in both Finnish and English, strengthening my communication skills and ability to collaborate to achieve goals.',
    },
    {
      year: '3/2022-7/2022',
      title: 'Production Worker',
      company: 'Purso',
      description: 'Packaging of aluminum profiles.',
    },
    {
      year: '4/2020',
      title: 'Master of Science in Economics',
      company: 'Turku School of Economics',
      description:
        'Specialized in Mathematical Finance. Developed a neural network-based model for economic timeseries forecasting in my thesis, showcasing advanced analytical skills and the ability to apply theoretical knowledge to practical problem-solving.',
    },
    {
      year: '6/2014',
      title: 'Electronics Engineer',
      company: 'Turku University of Applied Sciences',
      description:
        'Specialized in electronics production. Thesis: Application of Lean Thinking in Electronics Contract Manufacturing.',
    },
  ],

  testimonials: [
    {
      content: 'Juuso is an ...',
      name: '???',
      title: '???',
      avatarSrc: '',
    },
  ],

  typedStrings: [
    'Electronics Engineer',
    'Master of Science in Economics',
    'Full Stack Developer',
    'UI/UX Specialist',
    'Animation Enthusiast',
    '...',
    'and',
    '"By the power of Grayskull … I have the power!"',
  ],

  contact: {
    email: 'juuso.juvonen@osuuj.ai',
    location: 'Nokia, Finland',
    website: 'www.osuuj.ai',
    availability: {
      status: 'Open to new projects and challenges',
      response: 'Will respond within 24 hours',
    },
  },

  socialLinks: {
    github: 'https://github.com/juuso',
    linkedin: 'https://linkedin.com/in/juuso',
  },

  avatarUrl: '/images/team/juuso-juvonen.svg',
};
