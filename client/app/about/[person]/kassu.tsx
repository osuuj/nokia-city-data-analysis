'use client';

import { AnimatedSkillBar } from '@/features/about/components/AnimatedSkillBar';
import AnimatedText from '@/features/about/components/AnimatedText';
import { TestimonialCard } from '@/features/about/components/TestimonialCard';
import { ContactForm } from '@/features/contact/components';
import { ProjectCard } from '@/features/project/components';
import { TimelineItem } from '@/features/project/components/ui/TimelineItem';
import { Header } from '@/shared/components/layout';
import { ParticleBackground } from '@/shared/components/ui';
import { useThemeContext } from '@/shared/context/ThemeContext';
import { Avatar, Button, Card, CardBody, Divider, Link, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function KassuPage() {
  const { theme } = useThemeContext();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const skills = [
    { name: 'Node.js', level: 92 },
    { name: 'Python', level: 88 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'AWS', level: 80 },
    { name: 'Docker', level: 82 },
    { name: 'Kubernetes', level: 78 },
    { name: 'GraphQL', level: 84 },
    { name: 'MongoDB', level: 79 },
  ];

  const projects = [
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
  ];

  const experience = [
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
  ];

  const testimonials = [
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
  ];

  // Scroll to section on load if hash is present
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            behavior: 'smooth',
            top: element.offsetTop - 100,
          });
        }, 500);
      }
    }
  }, []);

  return (
    <>
      <Header />

      <ParticleBackground />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="md:w-1/2 text-center md:text-left">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-primary font-semibold text-lg mb-2"
              >
                Hello, I'm
              </motion.h3>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold mb-4"
              >
                Kassu
              </motion.h1>

              <AnimatedText
                text=""
                className="text-2xl md:text-3xl font-medium text-default-600 mb-6"
                delay={0.4}
                type="typed"
                typedStrings={[
                  'Backend Developer',
                  'Cloud Architecture Expert',
                  'Database Specialist',
                  'API Performance Guru',
                ]}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-default-600 mb-8 max-w-lg mx-auto md:mx-0"
              >
                Building robust, scalable backend solutions that power modern applications.
                Specialized in high-performance APIs, database optimization, and cloud
                infrastructure.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap gap-4 justify-center md:justify-start"
              >
                <Button
                  as={Link}
                  href="#contact"
                  color="primary"
                  size="lg"
                  endContent={<Icon icon="lucide:send" />}
                >
                  Get in Touch
                </Button>
                <Button
                  as={Link}
                  href="#projects"
                  variant="flat"
                  color="primary"
                  size="lg"
                  endContent={<Icon icon="lucide:chevron-down" />}
                >
                  View Projects
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex gap-5 mt-10 justify-center md:justify-start"
              >
                <Tooltip content="GitHub">
                  <Button
                    as={Link}
                    isIconOnly
                    href="https://github.com/kassu"
                    color="default"
                    variant="flat"
                    aria-label="GitHub"
                  >
                    <Icon icon="lucide:github" width={20} />
                  </Button>
                </Tooltip>

                <Tooltip content="LinkedIn">
                  <Button
                    as={Link}
                    isIconOnly
                    href="https://linkedin.com/in/kassu"
                    color="default"
                    variant="flat"
                    aria-label="LinkedIn"
                  >
                    <Icon icon="lucide:linkedin" width={20} />
                  </Button>
                </Tooltip>

                <Tooltip content="Twitter">
                  <Button
                    as={Link}
                    isIconOnly
                    href="https://twitter.com/kassu"
                    color="default"
                    variant="flat"
                    aria-label="Twitter"
                  >
                    <Icon icon="lucide:twitter" width={20} />
                  </Button>
                </Tooltip>

                <Tooltip content="Medium">
                  <Button
                    as={Link}
                    isIconOnly
                    href="https://medium.com/@kassu"
                    color="default"
                    variant="flat"
                    aria-label="Medium"
                  >
                    <Icon icon="lucide:book-open" width={20} />
                  </Button>
                </Tooltip>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:w-1/3 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                <Card className="border-none shadow-lg bg-opacity-70 backdrop-blur-sm relative overflow-visible">
                  <CardBody className="overflow-visible p-0">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="flex justify-center"
                    >
                      <Avatar
                        src="https://img.heroui.chat/image/avatar?w=400&h=400&u=kassu456"
                        className="w-64 h-64 text-large shadow-xl z-10"
                        isBordered
                        color="primary"
                        showFallback
                        name="Kassu"
                      />
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                      }}
                      className="absolute top-0 right-0 w-20 h-20 border-4 border-dashed rounded-full border-primary/30"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                      }}
                      className="absolute bottom-12 -left-8 w-16 h-16 border-4 border-dotted rounded-full border-primary/20"
                    />
                  </CardBody>
                </Card>

                {/* Tech stack floating badges */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute -bottom-4 -right-4 bg-content1 rounded-full shadow-lg p-3 border border-content2"
                >
                  <Icon icon="logos:nodejs-icon" width={24} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="absolute -bottom-4 -left-4 bg-content1 rounded-full shadow-lg p-3 border border-content2"
                >
                  <Icon icon="logos:python" width={24} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                  className="absolute -top-4 -right-4 bg-content1 rounded-full shadow-lg p-3 border border-content2"
                >
                  <Icon icon="logos:postgresql" width={24} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  className="absolute -top-4 -left-4 bg-content1 rounded-full shadow-lg p-3 border border-content2"
                >
                  <Icon icon="logos:aws" width={24} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <Link href="#about">
            <Button
              isIconOnly
              variant="flat"
              color="default"
              aria-label="Scroll down"
              className="animate-bounce"
            >
              <Icon icon="lucide:chevron-down" width={20} />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-default-50/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              About Me
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded"
              />
            </h2>
            <p className="text-default-600 max-w-3xl mx-auto">
              My journey, expertise, and approach to solving complex backend challenges
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border border-default-100">
                <CardBody>
                  <h3 className="text-2xl font-semibold mb-4">My Background</h3>
                  <div className="space-y-4 text-default-600">
                    <p>
                      With over 8 years of experience in backend development, I specialize in
                      creating high-performance, scalable systems that power modern web
                      applications. My journey began with a fascination for how systems work behind
                      the scenes, which drove me to pursue a computer science degree with a focus on
                      distributed systems.
                    </p>
                    <p>
                      After graduating, I joined a startup where I built my first production
                      microservice architecture, learning valuable lessons about system design
                      through real-world challenges. This experience formed the foundation of my
                      approach to backend development: pragmatic, performance-focused, and built
                      with scalability in mind.
                    </p>
                    <p>
                      Today, I work with organizations ranging from startups to large enterprises,
                      helping them design and implement backend systems that can handle millions of
                      requests while remaining maintainable and cost-effective.
                    </p>
                  </div>

                  <Divider className="my-6" />

                  <div>
                    <h4 className="text-lg font-medium mb-4">Core Expertise</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:server" className="text-primary" />
                        <span>API Development</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:database" className="text-primary" />
                        <span>Database Optimization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:cloud" className="text-primary" />
                        <span>Cloud Architecture</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:grid" className="text-primary" />
                        <span>Microservices</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:shield" className="text-primary" />
                        <span>Security</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:bar-chart" className="text-primary" />
                        <span>Performance Tuning</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border border-default-100">
                <CardBody>
                  <h3 className="text-2xl font-semibold mb-4">My Philosophy</h3>

                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon icon="lucide:code" className="text-primary" width={24} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Clean, Maintainable Code</h4>
                        <p className="text-default-600 text-sm">
                          I believe code should be written for humans first, machines second. Clear
                          structure, thoughtful documentation, and comprehensive tests are essential
                          parts of every system I build.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon icon="lucide:zap" className="text-primary" width={24} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Performance by Design</h4>
                        <p className="text-default-600 text-sm">
                          Performance isn't an afterthought—it's part of the foundation. I design
                          systems with scalability in mind from day one, preventing bottlenecks
                          before they emerge.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon icon="lucide:shield" className="text-primary" width={24} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Security-First Approach</h4>
                        <p className="text-default-600 text-sm">
                          In today's landscape, security can't be compromised. Every system I build
                          incorporates best practices for data protection and access control.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon icon="lucide:repeat" className="text-primary" width={24} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Continuous Improvement</h4>
                        <p className="text-default-600 text-sm">
                          Technology evolves rapidly, and so does my approach. I'm committed to
                          continuous learning and applying new techniques to solve challenging
                          problems.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <Card className="border border-default-100">
              <CardBody className="text-center py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-primary mb-2">
                    <Icon icon="lucide:code" width={32} />
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-2"
                  >
                    8+
                  </motion.h3>
                  <p className="text-default-600">Years Experience</p>
                </motion.div>
              </CardBody>
            </Card>

            <Card className="border border-default-100">
              <CardBody className="text-center py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-primary mb-2">
                    <Icon icon="lucide:check-circle" width={32} />
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-2"
                  >
                    30+
                  </motion.h3>
                  <p className="text-default-600">Projects Completed</p>
                </motion.div>
              </CardBody>
            </Card>

            <Card className="border border-default-100">
              <CardBody className="text-center py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-primary mb-2">
                    <Icon icon="lucide:users" width={32} />
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-2"
                  >
                    15+
                  </motion.h3>
                  <p className="text-default-600">Happy Clients</p>
                </motion.div>
              </CardBody>
            </Card>

            <Card className="border border-default-100">
              <CardBody className="text-center py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-primary mb-2">
                    <Icon icon="lucide:coffee" width={32} />
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-2"
                  >
                    ∞
                  </motion.h3>
                  <p className="text-default-600">Cups of Coffee</p>
                </motion.div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              Work Experience
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded"
              />
            </h2>
            <p className="text-default-600 max-w-3xl mx-auto">
              My professional journey and key achievements
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-default-200 transform -translate-x-1/2" />

            {/* Timeline items */}
            <div className="relative">
              {experience.map((item, index) => (
                <TimelineItem
                  key={`${item.year}-${item.title}`}
                  year={item.year}
                  title={item.title}
                  company={item.company}
                  description={item.description}
                  index={index}
                  isLast={index === experience.length - 1}
                />
              ))}

              {/* Final marker */}
              <motion.div
                className="absolute left-1/2 bottom-0 transform -translate-x-1/2 flex flex-col items-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-5 h-5 rounded-full bg-primary-200 border-4 border-primary z-10" />
              </motion.div>
            </div>

            {/* Download CV button */}
            <div className="mt-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Button
                  endContent={<Icon icon="lucide:download" />}
                  color="primary"
                  size="lg"
                  as={Link}
                  href="#"
                  className="shadow-lg"
                >
                  Download CV
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-default-50/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              Technical Skills
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded"
              />
            </h2>
            <p className="text-default-600 max-w-3xl mx-auto">
              My technical expertise and proficiency levels
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 max-w-5xl mx-auto"
            ref={ref}
          >
            {skills.map((skill, index) => (
              <AnimatedSkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              Featured Projects
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded"
              />
            </h2>
            <p className="text-default-600 max-w-3xl mx-auto">
              Explore some of my recent work and technical solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={{ ...project, id: project.title.toLowerCase().replace(/\s+/g, '-') }}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button
                as={Link}
                href="/projects"
                color="primary"
                variant="ghost"
                size="lg"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                View All Projects
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-default-50/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              Client Testimonials
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded"
              />
            </h2>
            <p className="text-default-600 max-w-3xl mx-auto">
              What people say about working with me
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${testimonial.content.substring(0, 20)}`}
                content={testimonial.content}
                name={testimonial.name}
                title={testimonial.title}
                avatarSrc={testimonial.avatarSrc}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              Let's Connect
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded"
              />
            </h2>
            <p className="text-default-600 max-w-3xl mx-auto">
              Have a project in mind? Let's discuss how I can help you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4">Get In Touch</h3>
              <p className="text-default-600 mb-6">
                I'm always open to discussing new projects, creative ideas, or opportunities to be
                part of your vision.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon icon="lucide:mail" className="text-primary" width={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <Link href="mailto:hello@kassu.com" className="text-default-600">
                      hello@kassu.com
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon icon="lucide:map-pin" className="text-primary" width={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-default-600">Berlin, Germany</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon icon="lucide:globe" className="text-primary" width={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Website</h4>
                    <Link href="https://kassu.com" className="text-default-600">
                      www.kassu.com
                    </Link>
                  </div>
                </div>

                <Card className="mt-8 border border-default-200 bg-content2/30">
                  <CardBody>
                    <h4 className="font-medium mb-2">Availability</h4>
                    <p className="text-default-600 mb-4">
                      I'm currently available for freelance work and technical consulting. My
                      typical response time is within 24 hours.
                    </p>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                      <span className="text-default-600 text-sm">Available for new projects</span>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4">Send a Message</h3>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-default-50/80 border-t border-default-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="#home" className="font-bold text-xl">
                <span className="text-primary">K</span>assu
              </Link>
              <p className="text-default-500 text-sm mt-2">Building the backend of tomorrow</p>
            </div>

            <div className="flex gap-6">
              <Link href="#about" className="text-default-600 hover:text-primary text-sm">
                About
              </Link>
              <Link href="#experience" className="text-default-600 hover:text-primary text-sm">
                Experience
              </Link>
              <Link href="#skills" className="text-default-600 hover:text-primary text-sm">
                Skills
              </Link>
              <Link href="#projects" className="text-default-600 hover:text-primary text-sm">
                Projects
              </Link>
              <Link href="#contact" className="text-default-600 hover:text-primary text-sm">
                Contact
              </Link>
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <Button
                as={Link}
                href="https://github.com/kassu"
                isIconOnly
                variant="light"
                size="sm"
                aria-label="GitHub"
              >
                <Icon icon="lucide:github" />
              </Button>
              <Button
                as={Link}
                href="https://linkedin.com/in/kassu"
                isIconOnly
                variant="light"
                size="sm"
                aria-label="LinkedIn"
              >
                <Icon icon="lucide:linkedin" />
              </Button>
              <Button
                as={Link}
                href="https://twitter.com/kassu"
                isIconOnly
                variant="light"
                size="sm"
                aria-label="Twitter"
              >
                <Icon icon="lucide:twitter" />
              </Button>
            </div>
          </div>

          <Divider className="my-6" />

          <div className="text-center text-default-500 text-sm">
            © {new Date().getFullYear()} Kassu. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
