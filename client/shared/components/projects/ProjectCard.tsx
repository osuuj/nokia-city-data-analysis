import { Button, Card, CardBody, CardFooter, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type React from 'react';

interface ProjectProps {
  title: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
  index: number;
}

export const ProjectCard: React.FC<ProjectProps> = ({
  title,
  description,
  tech,
  image,
  link,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 * index }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="border border-default-200 overflow-hidden h-full" isPressable isHoverable>
        <CardBody className="p-0 overflow-hidden">
          <div className="overflow-hidden h-40">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-default-600 mb-3">{description}</p>

            <div className="flex flex-wrap gap-2 mb-2">
              {tech.map((item) => (
                <span
                  key={item}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </CardBody>

        <CardFooter className="justify-between bg-default-50 border-t border-default-200 px-4 py-2">
          <Button
            as={Link}
            href={link}
            color="primary"
            variant="flat"
            size="sm"
            endContent={<Icon icon="lucide:arrow-right" width={16} />}
          >
            View Project
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
