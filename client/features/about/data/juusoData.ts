/**
 * Data for Juuso's profile page
 */

import { ProjectCategory } from '@/features/project/types';

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
      category: ProjectCategory.Web,
    },
    {
      id: '2',
      title: 'Alpha Vantage Data ETL Pipeline',
      description:
        'This project provides an ETL (Extract, Transform, Load) pipeline to fetch financial data from Alpha Vantage and save it as structured JSON files in specified directories. The pipeline leverages asynchronous processing to optimize data retrieval and supports multiple data types, such as stocks, forex, cryptocurrencies, commodities, treasury yields, and economic indicators.',
      tech: ['Python', 'Pandas'],
      image: '/images/projects/juuso-etl.webp',
      link: 'https://github.com/osuuj/alpha-vantage-etl',
      hasDemo: false,
      category: ProjectCategory.Other,
    },
    {
      id: '3',
      title: 'MWAA Alpha Vantage Dags',
      description:
        'This repository provides Airflow DAGs designed to automate the retrieval of financial data from Alpha Vantage. The DAGs are optimized for use with AWS Managed Workflows for Apache Airflow (MWAA), making it easy to incorporate financial data into your workflows. The project includes all necessary Python modules, configurations, and a requirements.txt file for dependency management.',
      tech: ['Python', 'Airflow', 'Docker', 'AWS'],
      image: '/images/projects/juuso-mwaa.webp',
      link: 'https://github.com/osuuj/mwaa-alpha-vantage-dags',
      hasDemo: false,
      category: ProjectCategory.Other,
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
    github: 'https://github.com/osuuj',
    linkedin: 'https://linkedin.com/in/jutoju',
  },

  avatarUrl: '/images/team/juuso-juvonen.svg',
};
