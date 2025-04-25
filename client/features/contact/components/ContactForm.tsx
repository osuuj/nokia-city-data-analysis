import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
} from '@heroui/react';
import type React from 'react';
import { useContactForm } from '../hooks/useContactForm';
import type { ContactFormData } from '../types';

export const ContactForm: React.FC = () => {
  const { formState, handleChange, handleSubmit, resetForm } = useContactForm();
  const toast = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();

    if (success) {
      toast({
        title: 'Message sent!',
        description: 'We will get back to you soon.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      resetForm();
    } else if (formState.submitError) {
      toast({
        title: 'Error',
        description: formState.submitError,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name as keyof ContactFormData, e.target.value);
  };

  return (
    <Box as="form" onSubmit={onSubmit} className="w-full max-w-2xl">
      <Stack spacing={4}>
        <FormControl isInvalid={!!formState.errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            name="name"
            value={formState.data.name}
            onChange={handleFieldChange}
            placeholder="Your name"
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{formState.errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formState.errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={formState.data.email}
            onChange={handleFieldChange}
            placeholder="your.email@example.com"
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{formState.errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formState.errors.subject}>
          <FormLabel htmlFor="subject">Subject</FormLabel>
          <Input
            id="subject"
            name="subject"
            value={formState.data.subject}
            onChange={handleFieldChange}
            placeholder="Message subject"
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{formState.errors.subject}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formState.errors.message}>
          <FormLabel htmlFor="message">Message</FormLabel>
          <Textarea
            id="message"
            name="message"
            value={formState.data.message}
            onChange={handleFieldChange}
            placeholder="Your message"
            rows={6}
            disabled={formState.isSubmitting}
          />
          <FormErrorMessage>{formState.errors.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={formState.isSubmitting}
          loadingText="Sending..."
          className="w-full"
        >
          Send Message
        </Button>
      </Stack>
    </Box>
  );
};
