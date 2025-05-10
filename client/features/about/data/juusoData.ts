/**
 * Data for Juuso's profile page
 */

export const juusoData = {
  skills: [
    { name: 'React & React Native', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'Animation & Motion', level: 82 },
    { name: 'Testing & Accessibility', level: 88 },
    { name: 'Next.js', level: 92 },
    { name: 'TailwindCSS', level: 94 },
    { name: 'Component Libraries', level: 89 },
  ],

  projects: [
    {
      title: 'E-commerce Dashboard',
      description:
        'A comprehensive analytics dashboard for online stores with real-time data visualization and customer insights.',
      tech: ['React', 'TypeScript', 'D3.js', 'REST API'],
      image: 'https://img.heroui.chat/image/dashboard?w=600&h=400&u=ecom123',
      link: '/projects/ecommerce-dashboard',
    },
    {
      title: 'Travel Companion App',
      description:
        'Mobile application for travelers to discover local experiences, plan itineraries and connect with other adventurers.',
      tech: ['React Native', 'Firebase', 'Maps API', 'Redux'],
      image: 'https://img.heroui.chat/image/places?w=600&h=400&u=travel456',
      link: '/projects/travel-app',
    },
    {
      title: 'Healthcare Portal',
      description:
        'Secure patient portal for scheduling appointments, accessing medical records and communicating with healthcare providers.',
      tech: ['Next.js', 'GraphQL', 'TailwindCSS', 'Auth0'],
      image: 'https://img.heroui.chat/image/dashboard?w=600&h=400&u=health789',
      link: '/projects/healthcare-portal',
    },
  ],

  experience: [
    {
      year: '2021-Present',
      title: 'Senior Frontend Developer',
      company: 'TechNova Solutions',
      description:
        'Lead the frontend development of multiple high-traffic web applications, collaborating with designers and backend developers to create seamless user experiences.',
    },
    {
      year: '2019-2021',
      title: 'Frontend Developer',
      company: 'Digital Horizon Inc.',
      description:
        'Developed and maintained multiple client-facing web applications using React, Redux, and modern CSS frameworks.',
    },
    {
      year: '2017-2019',
      title: 'UI Developer',
      company: 'CreativeWeb Studios',
      description:
        'Created interactive websites and user interfaces for small to medium businesses.',
    },
  ],

  testimonials: [
    {
      content:
        'Juuso is an exceptional frontend developer who consistently delivers beyond expectations. His attention to detail and commitment to user experience sets him apart.',
      name: 'Sarah Johnson',
      title: 'Product Manager at TechNova',
      avatarSrc: 'https://img.heroui.chat/image/avatar?w=150&h=150&u=sarah123',
    },
    {
      content:
        'Working with Juuso was transformative for our project. His technical expertise combined with design sensibility resulted in a product that our users love.',
      name: 'Alex Chen',
      title: 'CTO at Digital Solutions',
      avatarSrc: 'https://img.heroui.chat/image/avatar?w=150&h=150&u=alex456',
    },
    {
      content:
        'As a designer, I appreciate developers who respect the design vision while enhancing it with technical insights. Juuso is that rare talent who bridges both worlds perfectly.',
      name: 'Maya Rodriguez',
      title: 'UI/UX Designer',
      avatarSrc: 'https://img.heroui.chat/image/avatar?w=150&h=150&u=maya789',
    },
  ],

  typedStrings: ['Frontend Developer', 'UI/UX Specialist', 'React Expert', 'Animation Enthusiast'],

  contact: {
    email: 'juuso@example.com',
    location: 'Helsinki, Finland',
    website: 'www.juuso.dev',
    availability: {
      status: 'Open to new projects',
      response: 'Will respond within 48 hours',
    },
  },

  socialLinks: {
    github: 'https://github.com/juuso',
    linkedin: 'https://linkedin.com/in/juuso',
    twitter: 'https://twitter.com/juuso',
    dribbble: 'https://dribbble.com/juuso',
  },

  avatarUrl: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=juusodev',
};
