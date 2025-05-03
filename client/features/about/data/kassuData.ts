/**
 * Data for Kassu's profile page
 */

export const kassuData = {
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
      title: 'API Gateway Service',
      description:
        'High-performance API gateway with integrated rate limiting and advanced authentication patterns',
      tech: ['Node.js', 'Redis', 'Docker', 'Express'],
      image: 'https://img.heroui.chat/image/dashboard?w=600&h=400&u=1',
      link: '/projects/api-gateway',
    },
    {
      title: 'Data Pipeline System',
      description: 'Automated ETL pipeline for processing large datasets with real-time monitoring',
      tech: ['Python', 'Apache Airflow', 'PostgreSQL', 'Pandas'],
      image: 'https://img.heroui.chat/image/dashboard?w=600&h=400&u=2',
      link: '/projects/data-pipeline',
    },
    {
      title: 'Cloud Infrastructure',
      description: 'Infrastructure as Code solution for automated cloud deployment and scaling',
      tech: ['AWS', 'Terraform', 'Docker', 'Ansible'],
      image: 'https://img.heroui.chat/image/dashboard?w=600&h=400&u=3',
      link: '/projects/cloud-infra',
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
        'Kassu is an exceptional developer who delivers high-quality code ahead of schedule. His deep knowledge of backend systems saved our project from serious performance issues.',
      name: 'Alex Morgan',
      title: 'CTO at TechVision',
      avatarSrc: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=10',
    },
    {
      content:
        'Working with Kassu was a game-changer for our data infrastructure. He quickly identified bottlenecks and implemented elegant solutions that scaled beautifully.',
      name: 'Sarah Chen',
      title: 'Lead Engineer at DataFlow',
      avatarSrc: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=11',
    },
    {
      content:
        "Kassu's expertise in cloud architecture helped us reduce our AWS costs by 35% while improving system reliability. His documentation is also top-notch.",
      name: 'Michael Torres',
      title: 'Product Manager',
      avatarSrc: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=12',
    },
  ],

  typedStrings: [
    'Backend Developer',
    'Cloud Architecture Expert',
    'Database Specialist',
    'API Performance Guru',
  ],

  contact: {
    email: 'hello@kassu.com',
    location: 'Berlin, Germany',
    website: 'www.kassu.com',
    availability: {
      status: 'Available for new projects',
      response: 'Typical response time is within 24 hours',
    },
  },

  socialLinks: {
    github: 'https://github.com/kassu',
    linkedin: 'https://linkedin.com/in/kassu',
    twitter: 'https://twitter.com/kassu',
    medium: 'https://medium.com/@kassu',
  },

  avatarUrl: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=kassu456',
};
