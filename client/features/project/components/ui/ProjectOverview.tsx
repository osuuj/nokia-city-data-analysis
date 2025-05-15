import { Card, CardBody, Divider, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '../../types';

interface ProjectOverviewProps {
  project: Project;
}

/**
 * ProjectOverview component
 *
 * Displays the overview section of a project including description, goals, and progress.
 */
export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const progressValue = project.status === 'active' ? 95 : 25;
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
      };

  return (
    <motion.section {...animationProps} aria-labelledby="overview-heading">
      <Card shadow="lg">
        <CardBody className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold" id="overview-heading">
              Overview
            </h2>
            {project.timeline && (
              <div
                className="flex items-center gap-2 text-default-500"
                aria-label={`Timeline: ${typeof project.timeline === 'string' ? project.timeline : 'Project Timeline'}`}
              >
                <Icon icon="lucide:calendar" aria-hidden="true" />
                <span>
                  {typeof project.timeline === 'string' ? project.timeline : 'Project Timeline'}
                </span>
              </div>
            )}
          </div>

          <p className="text-default-600 dark:text-default-400">{project.description}</p>

          {project.goals && (
            <>
              <Divider />
              <section aria-labelledby="goals-heading">
                <h3 className="text-lg font-medium mb-2" id="goals-heading">
                  Key Goals
                </h3>
                <ul className="list-disc list-inside text-default-500 space-y-1">
                  {project.goals.map((goal) => (
                    <li key={`goal-${goal.substring(0, 20)}`} id={`goal-${goal.substring(0, 20)}`}>
                      {goal}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          <section aria-labelledby="progress-heading">
            <p className="text-sm font-medium mb-1 text-default-500" id="progress-heading">
              Progress
            </p>
            <Progress
              value={progressValue}
              color={project.status === 'active' ? 'success' : 'default'}
              size="md"
              aria-label={`Project progress: ${progressValue}%`}
            />
          </section>
        </CardBody>
      </Card>
    </motion.section>
  );
};
