import { Avatar, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type React from 'react';

interface TestimonialProps {
  content: string;
  name: string;
  title: string;
  avatarSrc?: string;
  index: number;
}

export const TestimonialCard: React.FC<TestimonialProps> = ({
  content,
  name,
  title,
  avatarSrc,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 * index }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="shadow-md border border-default-200">
        <CardBody className="relative">
          <div className="absolute top-3 left-3 text-primary opacity-20">
            <Icon icon="lucide:quote" width={40} />
          </div>

          <div className="pt-6 pb-3 px-2">
            <p className="text-default-600 italic text-sm mb-6 relative z-10">"{content}"</p>

            <div className="flex items-center">
              <Avatar
                src={avatarSrc}
                name={name.charAt(0)}
                size="md"
                color="primary"
                isBordered
                className="mr-3"
              />
              <div>
                <h4 className="font-medium">{name}</h4>
                <p className="text-xs text-default-500">{title}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
