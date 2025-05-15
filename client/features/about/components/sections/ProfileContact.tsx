'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

type Contact = {
  email: string;
  location: string;
  website: string;
  availability?: {
    status?: string;
    response?: string;
  };
};

type ProfileContactProps = {
  contact: Contact;
  socialLinks: Record<string, string>;
  title?: string;
  description?: string;
  specialization?: string;
};

export function ProfileContact({
  contact,
  socialLinks,
  title = 'Get In Touch',
  description = "Interested in working together? Let's connect!",
  specialization = 'development',
}: ProfileContactProps) {
  return (
    <section id="contact" className="py-24 bg-default-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            {title}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 h-1 bg-primary rounded"
            />
          </h2>
          <p className="text-default-600 max-w-3xl mx-auto">
            {description || `Interested in working together on ${specialization}? Let's connect!`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-default-100 p-8 rounded-xl shadow-sm"
          >
            <h3 className="text-2xl font-bold mb-6 text-default-900">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Icon icon="lucide:mail" className="text-primary text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-default-700">Email</h4>
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Icon icon="lucide:globe" className="text-primary text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-default-700">Website</h4>
                  <a
                    href={`https://${contact.website}`}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.website}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Icon icon="lucide:map-pin" className="text-primary text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-default-700">Location</h4>
                  <p className="text-default-600">{contact.location}</p>
                </div>
              </div>

              {contact.availability && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Icon icon="lucide:clock" className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium text-default-700">Availability</h4>
                    <p className="text-default-600">{contact.availability.status}</p>
                    {contact.availability.response && (
                      <p className="text-xs text-default-500 mt-1">
                        {contact.availability.response}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h4 className="font-medium text-default-700 mb-3">Connect with me</h4>
              <div className="flex gap-4">
                {Object.entries(socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-default-200 hover:bg-primary-100 rounded-full transition-colors"
                    aria-label={platform}
                  >
                    <Icon
                      icon={
                        platform === 'medium'
                          ? 'lucide:book'
                          : platform === 'dribbble'
                            ? 'lucide:dribbble'
                            : `lucide:${platform}`
                      }
                      className="text-xl"
                    />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-default-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-default-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-default-50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-default-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-default-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-default-50"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-default-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full p-3 border border-default-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-default-50"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-default-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-3 border border-default-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-default-50"
                  placeholder="Your message here..."
                />
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                endContent={<Icon icon="lucide:send" />}
              >
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
