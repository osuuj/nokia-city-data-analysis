'use client';

import { Card, CardBody, Tab, Tabs, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import React from 'react';

interface TechStackShowcaseProps {
  tags: string[];
}

export default function TechStackShowcase({ tags }: TechStackShowcaseProps) {
  const [activeTab, setActiveTab] = React.useState<string>('all');

  const techCategories = {
    frontend: [
      'React',
      'Vue.js',
      'Angular',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'SASS',
      'Redux',
      'Figma',
      'UI/UX',
    ],
    backend: [
      'Node.js',
      'Express',
      'Django',
      'Flask',
      'Ruby on Rails',
      'PHP',
      'Java',
      'Spring',
      'ASP.NET',
      'Go',
    ],
    database: [
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'Firebase',
      'DynamoDB',
      'Cassandra',
      'SQLite',
    ],
    devops: [
      'AWS',
      'Azure',
      'Google Cloud',
      'Docker',
      'Kubernetes',
      'Jenkins',
      'GitHub Actions',
      'CircleCI',
    ],
    mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS', 'Expo'],
    ai: ['TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'Computer Vision', 'BERT', 'OpenAI'],
  };

  const getTechIcon = (tech: string): string => {
    const techMap: Record<string, string> = {
      React: 'logos:react',
      'Vue.js': 'logos:vue',
      Angular: 'logos:angular-icon',
      'Node.js': 'logos:nodejs-icon',
      MongoDB: 'logos:mongodb-icon',
      PostgreSQL: 'logos:postgresql',
      Firebase: 'logos:firebase',
      TypeScript: 'logos:typescript-icon',
      JavaScript: 'logos:javascript',
      Python: 'logos:python',
      TensorFlow: 'logos:tensorflow',
      AWS: 'logos:aws',
      Docker: 'logos:docker-icon',
      Kubernetes: 'logos:kubernetes',
      Redux: 'logos:redux',
      'Tailwind CSS': 'logos:tailwindcss-icon',
      GraphQL: 'logos:graphql',
      MySQL: 'logos:mysql',
      Git: 'logos:git-icon',
      HTML: 'logos:html-5',
      CSS: 'logos:css-3',
      SASS: 'logos:sass',
      Java: 'logos:java',
      Spring: 'logos:spring-icon',
      PHP: 'logos:php',
      Swift: 'logos:swift',
      Kotlin: 'logos:kotlin-icon',
      Flutter: 'logos:flutter',
      'React Native': 'logos:react',
      Ruby: 'logos:ruby',
      'Ruby on Rails': 'logos:rails',
      Go: 'logos:go',
      Redis: 'logos:redis',
      Jenkins: 'logos:jenkins',
      GitHub: 'logos:github-icon',
      Android: 'logos:android-icon',
      iOS: 'logos:ios',
      Azure: 'logos:microsoft-azure',
      'Google Cloud': 'logos:google-cloud',
      CircleCI: 'logos:circleci',
      Django: 'logos:django-icon',
      Flask: 'logos:flask',
      'ASP.NET': 'logos:dotnet',
      PyTorch: 'logos:pytorch-icon',
    };

    return techMap[tech] || 'lucide:code';
  };

  const getCategoryForTech = (tech: string): string => {
    for (const [category, list] of Object.entries(techCategories)) {
      if (list.includes(tech)) return category;
    }
    return 'other';
  };

  const filteredTags =
    activeTab === 'all' ? tags : tags.filter((tag) => getCategoryForTech(tag) === activeTab);

  return (
    <div>
      <Tabs
        aria-label="Technology categories"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="mb-8"
        variant="underlined"
        color="primary"
      >
        <Tab key="all" title="All Technologies" />
        <Tab key="frontend" title="Frontend" />
        <Tab key="backend" title="Backend" />
        <Tab key="database" title="Database" />
        <Tab key="devops" title="DevOps" />
        <Tab key="mobile" title="Mobile" />
        <Tab key="ai" title="AI & ML" />
      </Tabs>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredTags.length > 0 ? (
          filteredTags.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Tooltip content={tech}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardBody className="flex flex-col items-center justify-center p-4">
                    <Icon icon={getTechIcon(tech)} className="text-4xl mb-2" />
                    <p className="text-center text-sm font-medium truncate w-full">{tech}</p>
                  </CardBody>
                </Card>
              </Tooltip>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <Icon icon="lucide:search-x" className="text-4xl mx-auto mb-2 text-default-400" />
            <p className="text-default-500">No technologies found in this category</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
