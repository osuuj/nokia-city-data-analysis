import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type React from 'react';

interface ContactInfoProps {
  email: string;
  description: string;
  responseTime?: string;
}

/**
 * ContactInfo Component
 *
 * Displays general contact information with an email address
 * and additional information.
 */
export const ContactInfo: React.FC<ContactInfoProps> = ({ email, description, responseTime }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-12"
    >
      <Card className="backdrop-blur-md bg-opacity-90">
        <CardBody className="p-6">
          <h2 className="text-2xl font-semibold text-default-800 dark:text-default-200 mb-4 text-center">
            Get in Touch
          </h2>
          <p className="text-default-600 dark:text-default-400 text-center mb-6">{description}</p>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="lucide:mail" className="text-xl text-primary-500" />
            <a
              href={`mailto:${email}`}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              {email}
            </a>
          </div>

          {responseTime && (
            <div className="text-center text-sm text-default-500 dark:text-default-400 mt-6">
              {responseTime}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
};
