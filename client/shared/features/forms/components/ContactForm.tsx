'use client';

import { Button, Card, CardBody, Input, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { compose, email, required } from '../utils/validation';

/**
 * Contact form values interface
 */
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

/**
 * Contact form validation schema
 */
const contactFormSchema = {
  name: (value: string) => required(value),
  email: (value: string) => compose(required, email)(value),
  message: (value: string) => required(value),
};

/**
 * Contact form component
 *
 * @example
 * ```tsx
 * <ContactForm />
 * ```
 */
export const ContactForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
    useForm<ContactFormValues>({
      initialValues: {
        name: '',
        email: '',
        message: '',
      },
      validationSchema: contactFormSchema,
      onSubmit: async (values) => {
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Reset form and show success message
        setIsSubmitted(true);

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      },
    });

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
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              variant="bordered"
              label="Name"
              placeholder="Your name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.name}
              isInvalid={!!errors.name}
              required
              className="max-w-full"
            />
            <Input
              variant="bordered"
              label="Email"
              placeholder="your.email@example.com"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.email}
              isInvalid={!!errors.email}
              type="email"
              required
              className="max-w-full"
            />
            <Textarea
              variant="bordered"
              label="Message"
              placeholder="Your message"
              name="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.message}
              isInvalid={!!errors.message}
              required
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
      </CardBody>
    </Card>
  );
};
