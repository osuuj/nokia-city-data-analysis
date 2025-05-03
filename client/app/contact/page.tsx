'use client';

import { ContactErrorBoundary } from '@/features/contact/components/ContactErrorBoundary';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { ContactFormSkeleton } from '@/features/contact/components/ContactFormSkeleton';
import { AnimatedBackground } from '@/shared/components/ui';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Suspense } from 'react';

/**
 * Contact page component.
 * Displays contact information for team members and a feedback form.
 *
 * @returns {JSX.Element} The rendered contact page component
 */
export default function ContactPage(): JSX.Element {
  const { resolvedTheme: theme } = useTheme();

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Animated background */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-primary mb-12"
        >
          Contact Us
        </motion.h1>

        {/* Team contacts section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-default-800 dark:text-default-200 mb-6 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First person */}
            <Card className="backdrop-blur-md bg-opacity-90">
              <CardBody className="flex flex-col items-center gap-4">
                <img
                  src={`/api/avatar?seed=${encodeURIComponent('Juuso Juvonen')}`}
                  alt="Juuso Juvonen"
                  className="w-24 h-24 rounded-full border-2 border-primary"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-default-900 dark:text-default-50">
                    Juuso Juvonen
                  </h3>
                  <p className="text-default-500 dark:text-default-400 mb-4">Lead Developer</p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="lucide:mail" className="text-default-600 dark:text-default-400" />
                    <a
                      href="mailto:superjuuso@gmail.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      superjuuso@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="logos:linkedin-icon" />
                    <a
                      href="https://linkedin.com/in/jutoju"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      linkedin.com/in/jutoju
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="logos:github-icon" />
                    <a
                      href="https://github.com/osuuj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      github.com/osuuj
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Second person */}
            <Card className="backdrop-blur-md bg-opacity-90">
              <CardBody className="flex flex-col items-center gap-4">
                <img
                  src={`/api/avatar?seed=${encodeURIComponent('Kasperi Rautio')}`}
                  alt="Kasperi Rautio"
                  className="w-24 h-24 rounded-full border-2 border-primary"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-default-900 dark:text-default-50">
                    Kasperi Rautio
                  </h3>
                  <p className="text-default-500 dark:text-default-400 mb-4">Developer</p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="lucide:mail" className="text-default-600 dark:text-default-400" />
                    <a
                      href="mailto:kasperi.rautio@gmail.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      kasperi.rautio@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="logos:linkedin-icon" />
                    <a
                      href="https://linkedin.com/in/kasperi-rautio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      linkedin.com/in/kasperi-rautio
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="logos:github-icon" />
                    <a
                      href="https://github.com/kasperi-r"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      github.com/kasperi-r
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>

        {/* Contact Form Section */}
        <ContactErrorBoundary>
          <Suspense fallback={<ContactFormSkeleton />}>
            <ContactForm />
          </Suspense>
        </ContactErrorBoundary>
      </div>
    </div>
  );
}
