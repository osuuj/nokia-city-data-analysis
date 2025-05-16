/**
 * Data for Kasperi's profile page
 */

export const kasperiData = {
  skills: [
    { name: 'Node.js', level: 92 },
    { name: 'Python', level: 88 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'AWS', level: 80 },
    { name: 'Docker', level: 82 },
    { name: 'Kubernetes', level: 78 },
    { name: 'GraphQL', level: 84 },
    { name: 'MongoDB', level: 79 },
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
      title: 'Data Pipeline System',
      description: 'Automated ETL pipeline for processing large datasets with real-time monitoring',
      tech: ['Python', 'Apache Airflow', 'PostgreSQL', 'Pandas'],
      image: '/images/projects/data-pipeline.webp',
      link: '/project/2',
      hasDemo: false,
    },
    {
      id: '2',
      title: 'Cloud Infrastructure',
      description: 'Infrastructure as Code solution for automated cloud deployment and scaling',
      tech: ['AWS', 'Terraform', 'Docker', 'Ansible'],
      image: '/images/projects/cloud-infra.webp',
      link: '/project/2',
      hasDemo: false,
    },
  ],

  experience: [
    {
      year: '2021-Present',
      title: 'Senior Backend Developer',
      company: 'TechVision Inc.',
      description:
        'Lead architecture design for high-volume API systems serving 10M+ daily requests. Improved system performance by 42% through optimization and caching strategies.',
    },
    {
      year: '2018-2021',
      title: 'Backend Developer',
      company: 'DataFlow Systems',
      description:
        'Developed ETL pipelines for processing financial data. Built robust PostgreSQL optimization strategies that reduced query times by 65%.',
    },
    {
      year: '2016-2018',
      title: 'Software Engineer',
      company: 'InnovateCloud',
      description:
        'Implemented cloud-based microservices architecture for distributed systems. Created CI/CD pipelines that reduced deployment time by 78%.',
    },
  ],

  testimonials: [
    {
      content:
        'Kasperi is an exceptional developer who delivers high-quality code ahead of schedule. His deep knowledge of backend systems saved our project from serious performance issues.',
      name: 'Alex Morgan',
      title: 'CTO at TechVision',
      avatarSrc: '/images/team/alex.webp',
    },
    {
      content:
        'Working with Kasperi was a game-changer for our data infrastructure. He quickly identified bottlenecks and implemented elegant solutions that scaled beautifully.',
      name: 'Sarah Chen',
      title: 'Lead Engineer at DataFlow',
      avatarSrc: '/images/team/sarah.webp',
    },
    {
      content:
        "Kasperi's expertise in cloud architecture helped us reduce our AWS costs by 35% while improving system reliability. His documentation is also top-notch.",
      name: 'Michael Torres',
      title: 'Product Manager',
      avatarSrc: '/images/team/michael.webp',
    },
  ],

  typedStrings: [
    'Backend Developer',
    'Cloud Architecture Expert',
    'Database Specialist',
    'API Performance Guru',
  ],

  contact: {
    email: 'hello@kasperi.com',
    location: 'Berlin, Germany',
    website: 'www.kasperi.com',
    availability: {
      status: 'Available for new projects',
      response: 'Typical response time is within 24 hours',
    },
  },

  socialLinks: {
    github: 'https://github.com/kasperi',
    linkedin: 'https://linkedin.com/in/kasperi',
    twitter: 'https://twitter.com/kasperi',
    medium: 'https://medium.com/@kasperi',
  },

  avatarUrl: '/images/team/kasperi.webp',
};
