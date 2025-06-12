/**
 * Data for Kasperi's profile page
 */

export const kasperiData = {
  skills: [
    { name: 'React.js', level: 95 },
    { name: 'Node.js', level: 88 },
    { name: 'Next.js', level: 85 },
    { name: 'JavaScript', level: 90 },
    { name: 'TypeScript', level: 87 },
    { name: 'Python', level: 85 },
    { name: 'PostgreSQL', level: 80 },
    { name: 'Docker', level: 90 },
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
  ],

  experience: [
    {
      year: '2021 - Present',
      title: 'Project Researcher & Developer',
      company: 'University of Turku',
      description:
        'Technical team lead role focusing on data engineering and software development for academic projects.',
    },
  ],

  // testimonials: [
  //   {
  //     content:
  //       'Kasperi is an exceptional developer who delivers high-quality code ahead of schedule. His deep knowledge of backend systems saved our project from serious performance issues.',
  //     name: 'Alex Morgan',
  //     title: 'CTO at TechVision',
  //     avatarSrc: '/images/team/alex.webp',
  //   },
  //   {
  //     content:
  //       'Working with Kasperi was a game-changer for our data infrastructure. He quickly identified bottlenecks and implemented elegant solutions that scaled beautifully.',
  //     name: 'Sarah Chen',
  //     title: 'Lead Engineer at DataFlow',
  //     avatarSrc: '/images/team/sarah.webp',
  //   },
  //   {
  //     content:
  //       "Kasperi's expertise in cloud architecture helped us reduce our AWS costs by 35% while improving system reliability. His documentation is also top-notch.",
  //     name: 'Michael Torres',
  //     title: 'Product Manager',
  //     avatarSrc: '/images/team/michael.webp',
  //   },
  // ],

  typedStrings: [
    'Software Engineer',
    'Full Stack Developer',
    'React Specialist',
    'Electronics Engineer',
  ],

  // contact: {
  //   email: 'hello@kasperi.com',
  //   location: 'Berlin, Germany',
  //   website: 'www.kasperi.com',
  //   availability: {
  //     status: 'Available for new projects',
  //     response: 'Typical response time is within 24 hours',
  //   },
  // },

  socialLinks: {
    github: 'https://github.com/kasperi-r',
    linkedin: 'https://linkedin.com/in/kasperi-rautio',
  },

  avatarUrl: '/images/team/kasperi-rautio.svg',
};
