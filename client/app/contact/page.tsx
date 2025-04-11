'use client';

import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Avatar, Button, Card, CardBody, Input, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import React from 'react';

/**
 * Contact page component.
 * Displays contact information for two people and a feedback form.
 */
export default function ContactPage() {
  const { resolvedTheme: theme } = useTheme();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [rating, setRating] = React.useState<number>(0);

  // Define gradient colors based on theme
  const gradientStart = theme === 'dark' ? 'rgba(50, 50, 80, 0.5)' : 'rgba(240, 240, 255, 0.7)';
  const gradientEnd = theme === 'dark' ? 'rgba(30, 30, 60, 0.3)' : 'rgba(255, 255, 255, 0.5)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', { name, email, message, rating });
    // Reset form fields
    setName('');
    setEmail('');
    setMessage('');
    setRating(0);
    // Here you would typically send this data to a server
  };

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
                <Avatar
                  src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
                  className="w-24 h-24"
                  isBordered
                  color="primary"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-default-900 dark:text-default-50">
                    Jane Doe
                  </h3>
                  <p className="text-default-500 dark:text-default-400 mb-4">Lead Developer</p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="lucide:mail" className="text-default-600 dark:text-default-400" />
                    <a
                      href="mailto:jane.doe@example.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      jane.doe@example.com
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="logos:linkedin-icon" />
                    <a
                      href="https://linkedin.com/in/janedoe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      linkedin.com/in/janedoe
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="logos:github-icon" />
                    <a
                      href="https://github.com/janedoe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      github.com/janedoe
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Second person */}
            <Card className="backdrop-blur-md bg-opacity-90">
              <CardBody className="flex flex-col items-center gap-4">
                <Avatar
                  src="https://img.heroui.chat/image/avatar?w=200&h=200&u=2"
                  className="w-24 h-24"
                  isBordered
                  color="primary"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-default-900 dark:text-default-50">
                    John Smith
                  </h3>
                  <p className="text-default-500 dark:text-default-400 mb-4">UX Designer</p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="lucide:mail" className="text-default-600 dark:text-default-400" />
                    <a
                      href="mailto:john.smith@example.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      john.smith@example.com
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="logos:linkedin-icon" />
                    <a
                      href="https://linkedin.com/in/johnsmith"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      linkedin.com/in/johnsmith
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="logos:github-icon" />
                    <a
                      href="https://github.com/johnsmith"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      github.com/johnsmith
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>

        {/* Feedback form section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-default-800 dark:text-default-200 mb-6 text-center">
            Send Us Feedback
          </h2>

          <Card className="backdrop-blur-md bg-opacity-90">
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Your Name"
                  placeholder="Enter your name"
                  variant="bordered"
                  value={name}
                  onValueChange={setName}
                  required
                  classNames={{
                    label: 'text-default-700 dark:text-default-300',
                    input: 'bg-default-50/50 dark:bg-default-900/50',
                  }}
                />

                <Input
                  label="Your Email"
                  placeholder="Enter your email"
                  variant="bordered"
                  type="email"
                  value={email}
                  onValueChange={setEmail}
                  required
                  classNames={{
                    label: 'text-default-700 dark:text-default-300',
                    input: 'bg-default-50/50 dark:bg-default-900/50',
                  }}
                />

                <Textarea
                  label="Your Message"
                  placeholder="What would you like to tell us?"
                  variant="bordered"
                  minRows={4}
                  value={message}
                  onValueChange={setMessage}
                  required
                  classNames={{
                    label: 'text-default-700 dark:text-default-300',
                    input: 'bg-default-50/50 dark:bg-default-900/50',
                  }}
                />

                {/* Rating Card */}
                <Card className="border border-default-200 dark:border-default-700 backdrop-blur-md bg-opacity-90">
                  <CardBody className="p-4">
                    <h3 className="text-lg font-medium text-default-800 dark:text-default-200 mb-3">
                      Rate Your Experience
                    </h3>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Icon
                            icon={star <= rating ? 'lucide:star' : 'lucide:star'}
                            className={`text-2xl ${
                              star <= rating
                                ? 'text-warning-400'
                                : 'text-default-300 dark:text-default-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-center mt-2 text-sm text-default-600 dark:text-default-400">
                      {rating > 0
                        ? `You rated us ${rating} ${rating === 1 ? 'star' : 'stars'}`
                        : 'Select a rating'}
                    </p>
                  </CardBody>
                </Card>

                <div className="flex justify-end">
                  <Button type="submit" color="primary" size="lg">
                    Send Feedback
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
