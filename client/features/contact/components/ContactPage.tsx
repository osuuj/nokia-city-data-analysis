import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type React from 'react';
import { Suspense } from 'react';
import { ContactErrorBoundary } from './ContactErrorBoundary';
import { ContactForm } from './ContactForm';
import { ContactFormSkeleton } from './ContactFormSkeleton';

/**
 * ContactPage Component
 *
 * The main page component for the contact feature.
 * Integrates the ContactForm with error boundary and loading states.
 * Provides a responsive layout for the contact form.
 *
 * @example
 * ```tsx
 * import { ContactPage } from '../components';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <Header />
 *       <ContactPage />
 *       <Footer />
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns {JSX.Element} A page component that displays the contact form
 */
export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-xl text-gray-600 dark:text-gray-300"
          >
            Have a question or want to work together? We'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Icon icon="mdi:email" className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                    <a
                      href="mailto:contact@example.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      contact@example.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon icon="mdi:phone" className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                    <a
                      href="tel:+1234567890"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon icon="mdi:map-marker" className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Business Street, Suite 100
                      <br />
                      City, State 12345
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Business Hours
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Monday - Friday</span>
                  <span className="text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Saturday</span>
                  <span className="text-gray-900 dark:text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                  <span className="text-gray-900 dark:text-white">Closed</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
              <ContactErrorBoundary>
                <Suspense fallback={<ContactFormSkeleton />}>
                  <ContactForm />
                </Suspense>
              </ContactErrorBoundary>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
