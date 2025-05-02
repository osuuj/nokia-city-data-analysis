'use client';

import { Avatar, Button, Card, CardBody, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import React from 'react';

/**
 * About page for Kassu.
 * Contains Kassu's profile or information content.
 */
export default function KassuPage() {
  const { resolvedTheme: theme } = useTheme();

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  const skills = [
    { name: 'Node.js', level: 92 },
    { name: 'Python', level: 88 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'AWS', level: 80 },
    { name: 'Docker', level: 82 },
  ];

  const projects = [
    {
      title: 'API Gateway Service',
      description: 'Scalable API gateway with rate limiting and authentication',
      tech: ['Node.js', 'Redis', 'Docker'],
      link: '/projects/api-gateway',
    },
    {
      title: 'Data Pipeline System',
      description: 'ETL pipeline for processing large datasets',
      tech: ['Python', 'Apache Airflow', 'PostgreSQL'],
      link: '/projects/data-pipeline',
    },
    {
      title: 'Cloud Infrastructure',
      description: 'Automated cloud infrastructure deployment',
      tech: ['AWS', 'Terraform', 'Docker'],
      link: '/projects/cloud-infra',
    },
  ];

  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Animated background */}
      <motion.div
        className="fixed inset-0 z-0"
        animate={{
          background: [
            `radial-gradient(circle at 20% 20%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 80% 80%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 80% 20%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 20% 80%, ${gradientStart}, transparent 60%)`,
            `radial-gradient(circle at 20% 20%, ${gradientStart}, transparent 60%)`,
          ],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-large bg-content1 shadow-small backdrop-blur-md bg-opacity-85 border border-content2">
            <Avatar
              src="https://img.heroui.chat/image/avatar?w=200&h=200&u=kassu456"
              className="w-32 h-32"
              isBordered
              color="primary"
              size="lg"
            />
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Kassu</h1>
              <p className="text-xl text-default-500 mb-4">Backend Developer</p>
              <p className="text-default-600 mb-4">
                Expert in building robust server architectures and efficient database solutions.
                Passionate about scalable systems and clean code.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Button
                  as={Link}
                  href="https://github.com/kassu"
                  color="primary"
                  variant="flat"
                  startContent={<Icon icon="mdi:github" />}
                >
                  GitHub
                </Button>
                <Button
                  as={Link}
                  href="https://linkedin.com/in/kassu"
                  color="primary"
                  variant="flat"
                  startContent={<Icon icon="mdi:linkedin" />}
                >
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="grid gap-4">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="bg-content1 p-4 rounded-large backdrop-blur-md bg-opacity-85 border border-content2"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-default-500">{skill.level}%</span>
                </div>
                <div className="h-2 bg-default-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card key={project.title} className="backdrop-blur-md bg-opacity-90">
                <CardBody>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-default-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Button
                    as={Link}
                    href={project.link}
                    color="primary"
                    variant="flat"
                    size="sm"
                    endContent={<Icon icon="mdi:arrow-right" />}
                  >
                    View Project
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
