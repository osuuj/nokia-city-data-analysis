'use client';

import { AnimatedText } from '@/features/about/components/ui';
import { Avatar, Button, Card, CardBody, Link, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

type ProfileHeroProps = {
  name: string;
  typedStrings: string[];
  avatarUrl: string;
  bio: string;
  socialLinks: Record<string, string>;
  techIcons?: Array<{
    name: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }>;
};

export function ProfileHero({
  name,
  typedStrings,
  avatarUrl,
  bio,
  socialLinks,
  techIcons = [],
}: ProfileHeroProps) {
  // Map position strings to actual CSS classes
  const positionClasses = {
    'top-left': '-top-4 -left-4',
    'top-right': '-top-4 -right-4',
    'bottom-left': '-bottom-4 -left-4',
    'bottom-right': '-bottom-4 -right-4',
  };

  return (
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
              {name}
            </motion.h1>

            <AnimatedText
              text=""
              className="text-2xl md:text-3xl font-medium text-default-600 mb-6"
              delay={0.4}
              type="typed"
              typedStrings={typedStrings}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-default-600 mb-8 max-w-lg mx-auto md:mx-0"
            >
              {bio}
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
              {Object.entries(socialLinks).map(([platform, url]) => (
                <Tooltip
                  key={platform}
                  content={platform.charAt(0).toUpperCase() + platform.slice(1)}
                >
                  <Button
                    as={Link}
                    isIconOnly
                    href={url}
                    color="default"
                    variant="flat"
                    aria-label={platform}
                  >
                    <Icon
                      icon={platform === 'medium' ? 'lucide:book-open' : `lucide:${platform}`}
                      width={20}
                    />
                  </Button>
                </Tooltip>
              ))}
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
                      src={avatarUrl}
                      className="w-64 h-64 text-large shadow-xl z-10"
                      isBordered
                      color="primary"
                      showFallback
                      name={name}
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

              {/* Tech stack floating badges - dynamically from props */}
              {techIcons.map((icon) => (
                <motion.div
                  key={`${icon.name}-${icon.position}`}
                  initial={{
                    opacity: 0,
                    x: icon.position.includes('right') ? 20 : -20,
                    y: icon.position.includes('top') ? -20 : 20,
                  }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className={`absolute ${positionClasses[icon.position]} bg-content1 rounded-full shadow-lg p-3 border border-content2`}
                >
                  <Icon icon={icon.name} width={24} />
                </motion.div>
              ))}
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
  );
}
