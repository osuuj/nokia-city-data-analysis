import { Box, Container, Heading, Text, VStack } from '@heroui/react';
import type React from 'react';
import { ContactForm } from './ContactForm';

export const ContactPage: React.FC = () => {
  return (
    <Box className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)] py-12">
      <Container className="max-w-3xl">
        <VStack spacing={8} align="center">
          <Box className="text-center">
            <Heading as="h1" className="text-3xl font-bold mb-4">
              Contact Us
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400 text-lg">
              Have a question or want to get in touch? Fill out the form below and we'll get back to
              you as soon as possible.
            </Text>
          </Box>

          <ContactForm />
        </VStack>
      </Container>
    </Box>
  );
};
