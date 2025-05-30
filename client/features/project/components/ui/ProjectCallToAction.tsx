'use client';

import { useAnimationProps } from '@/shared/hooks';
import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface ProjectCallToActionProps {
  isLoading: boolean;
}

/**
 * A call-to-action component for project details
 */
export function ProjectCallToAction({ isLoading }: ProjectCallToActionProps) {
  const animationProps = useAnimationProps('fadeInUp', {
    duration: 0.6,
    delay: 0.6,
    animate: isLoading ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 },
  });

  return (
    <motion.section {...animationProps} aria-labelledby="cta-heading">
      <Card className="border-b-1 border-divider bg-gradient-to-r from-default-100 via-primary-100 to-secondary-100 px-6 py-2">
        <CardBody className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-black dark:text-white" id="cta-heading">
                Interested in this project?
              </h2>
              <p className="text-default-600 dark:text-gray-300">
                Learn more about how we can help you with similar initiatives.
              </p>
            </div>
            <Button
              className="bg-primary text-white"
              startContent={<Icon icon="lucide:message-circle" />}
              href="/contact"
              as="a"
            >
              Get in touch
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.section>
  );
}
