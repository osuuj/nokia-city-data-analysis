'use client';

import { FormValidation } from '@/shared/features/validation/components';
import { Button, Card, CardBody, Input, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type React from 'react';
import { useState } from 'react';

export const ContactForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (values: { name: string; email: string; message: string }) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <Card className="border border-default-200">
      <CardBody>
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-success-100 text-success rounded-full flex items-center justify-center">
                <Icon icon="lucide:check" width={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
            <p className="text-default-600">
              Thanks for reaching out. I'll get back to you as soon as possible.
            </p>
          </motion.div>
        ) : (
          <FormValidation
            options={{
              initialValues: { name: '', email: '', message: '' },
              validationSchema: {
                name: [{ required: true, message: 'Name is required' }],
                email: [
                  { required: true, message: 'Email is required' },
                  { email: true, message: 'Invalid email format' },
                ],
                message: [{ required: true, message: 'Message is required' }],
              },
              onSubmit: handleSubmit,
            }}
          >
            {({ values, errors, handlers, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  variant="bordered"
                  label="Name"
                  placeholder="Your name"
                  name="name"
                  value={values.name}
                  onChange={handlers.name.onChange}
                  onBlur={handlers.name.onBlur}
                  errorMessage={errors.name?.[0]}
                  isInvalid={!!errors.name?.length}
                  className="max-w-full"
                />
                <Input
                  variant="bordered"
                  label="Email"
                  placeholder="your.email@example.com"
                  name="email"
                  value={values.email}
                  onChange={handlers.email.onChange}
                  onBlur={handlers.email.onBlur}
                  errorMessage={errors.email?.[0]}
                  isInvalid={!!errors.email?.length}
                  type="email"
                  className="max-w-full"
                />
                <Textarea
                  variant="bordered"
                  label="Message"
                  placeholder="Your message"
                  name="message"
                  value={values.message}
                  onChange={handlers.message.onChange}
                  onBlur={handlers.message.onBlur}
                  errorMessage={errors.message?.[0]}
                  isInvalid={!!errors.message?.length}
                  minRows={4}
                  className="max-w-full"
                />
                <div>
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                    endContent={!isSubmitting && <Icon icon="lucide:send" />}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </FormValidation>
        )}
      </CardBody>
    </Card>
  );
};
