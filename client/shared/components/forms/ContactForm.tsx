import { Button, Card, CardBody, Input, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type React from 'react';
import { useState } from 'react';

export const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              variant="bordered"
              label="Name"
              placeholder="Your name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              className="max-w-full"
            />
            <Input
              variant="bordered"
              label="Email"
              placeholder="your.email@example.com"
              name="email"
              value={formState.email}
              onChange={handleChange}
              type="email"
              required
              className="max-w-full"
            />
            <Textarea
              variant="bordered"
              label="Message"
              placeholder="Your message"
              name="message"
              value={formState.message}
              onChange={handleChange}
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
