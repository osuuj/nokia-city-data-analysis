'use client';

import {
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Image,
  Link,
  Progress,
  Tab,
  Tabs,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from 'next-themes';
import React from 'react';

/**
 * About page for Juuso.
 * Contains Juuso's profile or information content.
 */
export default function PortfolioPage() {
  const { resolvedTheme: theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
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

      {/* Secondary animated layer */}
      <motion.div
        className="fixed inset-0 z-0 opacity-50"
        animate={{
          background: [
            `radial-gradient(circle at 80% 80%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 20% 20%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 20% 80%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 80% 20%, ${gradientEnd}, transparent 50%)`,
            `radial-gradient(circle at 80% 80%, ${gradientEnd}, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      />

      {/* Hero Section */}
      <motion.div
        className="relative z-10 h-screen flex items-center justify-center"
        style={{ opacity, scale }}
      >
        <div className="text-center px-4">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="https://img.heroui.chat/image/avatar?w=200&h=200&u=juusodev"
              alt="Juuso"
              className="w-40 h-40 mx-auto rounded-full border-4 border-primary mb-8"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500"
          >
            Juuso Juvonen
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <TypewriterEffect
              text="Frontend Developer & UI/UX Designer"
              delay={100}
              className="text-2xl text-default-600 mb-8"
            />
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Chip color="primary" variant="shadow">
              React
            </Chip>
            <Chip color="secondary" variant="shadow">
              TypeScript
            </Chip>
            <Chip color="success" variant="shadow">
              UI/UX Design
            </Chip>
            <Chip color="warning" variant="shadow">
              Animation
            </Chip>
            <Chip color="danger" variant="shadow">
              Accessibility
            </Chip>
          </motion.div>

          <motion.div
            className="flex justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Button
              color="primary"
              variant="shadow"
              size="lg"
              endContent={<Icon icon="lucide:arrow-down" />}
              onPress={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Portfolio
            </Button>

            <Button
              color="secondary"
              variant="bordered"
              size="lg"
              endContent={<Icon icon="lucide:mail" />}
              onPress={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          >
            <Icon icon="lucide:chevrons-down" className="text-primary text-3xl" />
          </motion.div>
        </div>
      </motion.div>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="backdrop-blur-md bg-opacity-85 overflow-hidden">
                <CardBody>
                  <h2 className="text-3xl font-bold mb-4 text-primary">About Me</h2>
                  <p className="mb-4 text-default-600">
                    I'm a passionate Frontend Developer with 5+ years of experience crafting
                    beautiful, responsive, and user-friendly web applications.
                  </p>
                  <p className="mb-4 text-default-600">
                    My approach combines clean code, modern design principles, and performance
                    optimization to create exceptional digital experiences.
                  </p>
                  <p className="text-default-600">
                    When I'm not coding, you can find me exploring hiking trails, experimenting with
                    new tech, or contributing to open source projects.
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          <div className="md:w-1/2">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="backdrop-blur-md bg-opacity-85">
                <CardBody>
                  <h2 className="text-2xl font-bold mb-4 text-primary">Skills</h2>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">React & React Native</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <Progress
                      value={95}
                      color="primary"
                      className="mb-3"
                      aria-label="React & React Native skill level: 95%"
                    />

                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">TypeScript</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <Progress
                      value={90}
                      color="secondary"
                      className="mb-3"
                      aria-label="TypeScript skill level: 90%"
                    />

                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">UI/UX Design</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress
                      value={85}
                      color="success"
                      className="mb-3"
                      aria-label="UI/UX Design skill level: 85%"
                    />

                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Animation & Motion</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <Progress
                      value={82}
                      color="warning"
                      className="mb-3"
                      aria-label="Animation & Motion skill level: 82%"
                    />

                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Testing & Accessibility</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress
                      value={88}
                      color="danger"
                      aria-label="Testing & Accessibility skill level: 88%"
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-primary">Featured Projects</h2>
            <p className="text-xl text-default-600">Some of my recent work</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectCard
            title="E-commerce Dashboard"
            description="A comprehensive analytics dashboard for online stores with real-time data visualization and customer insights."
            tags={['React', 'TypeScript', 'D3.js', 'REST API']}
            imageUrl="https://img.heroui.chat/image/dashboard?w=600&h=400&u=ecom123"
            link="#"
            delay={0.1}
          />

          <ProjectCard
            title="Travel Companion App"
            description="Mobile application for travelers to discover local experiences, plan itineraries and connect with other adventurers."
            tags={['React Native', 'Firebase', 'Maps API', 'Redux']}
            imageUrl="https://img.heroui.chat/image/places?w=600&h=400&u=travel456"
            link="#"
            delay={0.3}
          />

          <ProjectCard
            title="Healthcare Portal"
            description="Secure patient portal for scheduling appointments, accessing medical records and communicating with healthcare providers."
            tags={['Next.js', 'GraphQL', 'TailwindCSS', 'Auth0']}
            imageUrl="https://img.heroui.chat/image/dashboard?w=600&h=400&u=health789"
            link="#"
            delay={0.5}
          />

          <ProjectCard
            title="Smart Home Interface"
            description="IoT control center with intuitive UI for managing connected home devices and automating daily routines."
            tags={['React', 'WebSockets', 'ThreeJS', 'Styled Components']}
            imageUrl="https://img.heroui.chat/image/dashboard?w=600&h=400&u=smarthome101"
            link="#"
            delay={0.7}
          />
        </div>

        <div className="text-center mt-8">
          <Button
            color="primary"
            variant="flat"
            endContent={<Icon icon="lucide:external-link" />}
            as={Link}
            href="https://github.com"
            target="_blank"
          >
            View All Projects on GitHub
          </Button>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="relative z-10 py-20 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-primary">Experience</h2>
            <p className="text-xl text-default-600">My professional journey</p>
          </div>
        </motion.div>

        <Tabs
          aria-label="Experience"
          size="lg"
          color="primary"
          variant="underlined"
          className="max-w-3xl mx-auto"
        >
          <Tab key="current" title="Current Role">
            <Card className="backdrop-blur-md bg-opacity-85 mt-6">
              <CardBody>
                <div className="flex items-center gap-2 mb-2">
                  <Badge color="primary">2021 - Present</Badge>
                  <h3 className="text-xl font-bold">Senior Frontend Developer</h3>
                </div>
                <p className="text-default-600 mb-2">TechNova Solutions</p>
                <p className="text-default-500 mb-4">
                  Lead the frontend development of multiple high-traffic web applications,
                  collaborating with designers and backend developers to create seamless user
                  experiences.
                </p>
                <ul className="list-disc list-inside text-default-500 space-y-1">
                  <li>Implemented cutting-edge UI components with React and TypeScript</li>
                  <li>Improved application performance by 40% through code optimization</li>
                  <li>Mentored junior developers and established best practices</li>
                  <li>Introduced automated testing that increased code coverage to 85%</li>
                </ul>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="previous" title="Previous Roles">
            <Card className="backdrop-blur-md bg-opacity-85 mt-6">
              <CardBody>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge color="secondary">2019 - 2021</Badge>
                    <h3 className="text-xl font-bold">Frontend Developer</h3>
                  </div>
                  <p className="text-default-600 mb-2">Digital Horizon Inc.</p>
                  <p className="text-default-500 mb-4">
                    Developed and maintained multiple client-facing web applications using React,
                    Redux, and modern CSS frameworks.
                  </p>
                  <ul className="list-disc list-inside text-default-500 space-y-1 mb-6">
                    <li>Built responsive interfaces for diverse client requirements</li>
                    <li>Collaborated with UX team to implement design systems</li>
                    <li>Integrated third-party APIs and services</li>
                  </ul>
                </div>

                <Divider className="my-6" />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge color="warning">2017 - 2019</Badge>
                    <h3 className="text-xl font-bold">UI Developer</h3>
                  </div>
                  <p className="text-default-600 mb-2">CreativeWeb Studios</p>
                  <p className="text-default-500 mb-4">
                    Created interactive websites and user interfaces for small to medium businesses.
                  </p>
                  <ul className="list-disc list-inside text-default-500 space-y-1">
                    <li>Translated design mockups into functional web experiences</li>
                    <li>Optimized websites for mobile responsiveness</li>
                    <li>Worked closely with clients to implement feedback and revisions</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="education" title="Education">
            <Card className="backdrop-blur-md bg-opacity-85 mt-6">
              <CardBody>
                <div className="flex items-center gap-2 mb-2">
                  <Badge color="success">2013 - 2017</Badge>
                  <h3 className="text-xl font-bold">Bachelor of Science in Computer Science</h3>
                </div>
                <p className="text-default-600 mb-2">University of Technology</p>
                <p className="text-default-500 mb-4">
                  Graduated with honors, specializing in web technologies and user interface design.
                </p>
                <ul className="list-disc list-inside text-default-500 space-y-1">
                  <li>
                    Relevant coursework: Web Development, UI/UX Design, Data Structures, Algorithms
                  </li>
                  <li>Senior project: Interactive Data Visualization Platform</li>
                  <li>President of Web Development Club</li>
                </ul>

                <Divider className="my-6" />

                <div className="flex items-center gap-2 mb-2">
                  <Badge color="primary">Ongoing</Badge>
                  <h3 className="text-xl font-bold">Professional Development</h3>
                </div>
                <ul className="list-disc list-inside text-default-500 space-y-1">
                  <li>Advanced React Patterns Certification (2022)</li>
                  <li>Accessibility in Web Applications (2021)</li>
                  <li>Performance Optimization for JavaScript Applications (2020)</li>
                </ul>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-20 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-primary">Testimonials</h2>
            <p className="text-xl text-default-600">What people say about my work</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestimonialCard
            name="Sarah Johnson"
            position="Product Manager at TechNova"
            content="Juuso is an exceptional frontend developer who consistently delivers beyond expectations. His attention to detail and commitment to user experience sets him apart."
            avatar="https://img.heroui.chat/image/avatar?w=150&h=150&u=sarah123"
            delay={0.1}
          />

          <TestimonialCard
            name="Alex Chen"
            position="CTO at Digital Solutions"
            content="Working with Juuso was transformative for our project. His technical expertise combined with design sensibility resulted in a product that our users love."
            avatar="https://img.heroui.chat/image/avatar?w=150&h=150&u=alex456"
            delay={0.3}
          />

          <TestimonialCard
            name="Maya Rodriguez"
            position="UI/UX Designer"
            content="As a designer, I appreciate developers who respect the design vision while enhancing it with technical insights. Juuso is that rare talent who bridges both worlds perfectly."
            avatar="https://img.heroui.chat/image/avatar?w=150&h=150&u=maya789"
            delay={0.5}
          />

          <TestimonialCard
            name="Daniel Park"
            position="Project Lead at HealthTech"
            content="Juuso's contribution to our healthcare portal was invaluable. He tackled complex UI challenges with elegant solutions and always kept accessibility in mind."
            avatar="https://img.heroui.chat/image/avatar?w=150&h=150&u=daniel101"
            delay={0.7}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-primary">Get In Touch</h2>
            <p className="text-xl text-default-600">Let's discuss your project</p>
          </div>
        </motion.div>

        <Card className="backdrop-blur-md bg-opacity-85 max-w-3xl mx-auto">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="md:w-2/5">
                <h3 className="text-2xl font-bold mb-4 text-primary">Contact Info</h3>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:mail" className="text-primary" />
                    <span className="text-default-600">juuso@example.com</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:map-pin" className="text-primary" />
                    <span className="text-default-600">Helsinki, Finland</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:globe" className="text-primary" />
                    <Link href="#" color="primary">
                      juuso.dev
                    </Link>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-primary">Social Media</h3>
                <div className="flex gap-3">
                  <Tooltip content="GitHub">
                    <Button isIconOnly variant="flat" color="default">
                      <Icon icon="logos:github-icon" />
                    </Button>
                  </Tooltip>

                  <Tooltip content="LinkedIn">
                    <Button isIconOnly variant="flat" color="primary">
                      <Icon icon="logos:linkedin-icon" />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Twitter">
                    <Button isIconOnly variant="flat" color="secondary">
                      <Icon icon="logos:twitter" />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Dribbble">
                    <Button isIconOnly variant="flat" color="danger">
                      <Icon icon="logos:dribbble-icon" />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div className="md:w-3/5">
                <ContactForm />
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

function TypewriterEffect({
  text,
  delay,
  className,
}: { text: string; delay: number; className?: string }) {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <div className={className}>{displayText}</div>;
}

function ProjectCard({
  title,
  description,
  tags,
  imageUrl,
  link,
  delay,
}: {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      <Card className="overflow-hidden backdrop-blur-md bg-opacity-85">
        <CardBody className="p-0">
          <div className="relative">
            <Image src={imageUrl} alt={title} className="w-full h-48 object-cover" />
            <div className="absolute top-2 right-2">
              <button
                type="button"
                className="z-0 group relative inline-flex items-center justify-center box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-unit-12 w-12 h-12 px-0 cursor-pointer rounded-full bg-default-100/20 backdrop-blur-md hover:bg-default-200/30 active:bg-default-300/40"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(link, '_blank');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    window.open(link, '_blank');
                  }
                }}
                aria-label="Open project in new tab"
              >
                <Icon icon="lucide:external-link" className="text-default-500" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-default-500 text-sm mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} color="primary" variant="flat" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

function TestimonialCard({
  name,
  position,
  content,
  avatar,
  delay,
}: {
  name: string;
  position: string;
  content: string;
  avatar: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      <Card className="backdrop-blur-md bg-opacity-85">
        <CardBody>
          <div className="mb-4 text-warning text-xl">
            <Icon icon="lucide:quote" />
          </div>
          <p className="text-default-600 mb-6 italic">{content}</p>
          <div className="flex items-center gap-3">
            <Image src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-default-500 text-sm">{position}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      console.log('Form submitted:', formData);

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <Icon icon="lucide:check-circle" className="text-5xl text-success" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-default-600">
          Thank you for reaching out. I'll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-default-700 mb-1 text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-medium border border-default-300 bg-content1 text-default-900"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-default-700 mb-1 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-medium border border-default-300 bg-content1 text-default-900"
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="subject" className="block text-default-700 mb-1 text-sm font-medium">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded-medium border border-default-300 bg-content1 text-default-900"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="message" className="block text-default-700 mb-1 text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 rounded-medium border border-default-300 bg-content1 text-default-900 resize-none"
        />
      </div>
      <Button
        type="submit"
        color="primary"
        className="w-full"
        isLoading={submitting}
        spinnerPlacement="end"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
