'use client';

import { Button, Form, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

export default function SuggestResourceForm() {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    resourceType: new Set<string>([]),
    resourceName: '',
    resourceLink: '',
    description: '',
  });

  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormState({
        name: '',
        email: '',
        resourceType: new Set<string>([]),
        resourceName: '',
        resourceLink: '',
        description: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  const resourceTypes = [
    { value: 'guide', label: 'Guide or Tutorial' },
    { value: 'directory', label: 'Business Directory' },
    { value: 'tool', label: 'Tool or Software' },
    { value: 'article', label: 'Article or Blog Post' },
    { value: 'template', label: 'Template or Checklist' },
    { value: 'other', label: 'Other' },
  ];

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex rounded-full bg-success/10 p-4 mb-4">
          <Icon icon="lucide:check-circle" className="text-4xl text-success" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Thank you for your suggestion!</h3>
        <p className="text-default-600">
          We'll review your recommendation and consider adding it to our resources.
        </p>
      </div>
    );
  }

  return (
    <Form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Your Name"
          placeholder="Enter your name"
          value={formState.name}
          onValueChange={(value) => setFormState({ ...formState, name: value })}
          isRequired
        />

        <Input
          label="Your Email"
          placeholder="Enter your email"
          type="email"
          value={formState.email}
          onValueChange={(value) => setFormState({ ...formState, email: value })}
          isRequired
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Resource Type"
          placeholder="Select resource type"
          selectedKeys={formState.resourceType}
          onSelectionChange={(keys) =>
            setFormState({ ...formState, resourceType: keys as Set<string> })
          }
          isRequired
        >
          {resourceTypes.map((type) => (
            <SelectItem key={type.value}>{type.label}</SelectItem>
          ))}
        </Select>

        <Input
          label="Resource Name"
          placeholder="Enter resource name"
          value={formState.resourceName}
          onValueChange={(value) => setFormState({ ...formState, resourceName: value })}
          isRequired
        />
      </div>

      <Input
        label="Resource Link"
        placeholder="Enter URL or source information"
        value={formState.resourceLink}
        onValueChange={(value) => setFormState({ ...formState, resourceLink: value })}
        isRequired
      />

      <Textarea
        label="Why is this resource valuable?"
        placeholder="Briefly describe why this resource would be helpful for the community"
        value={formState.description}
        onValueChange={(value) => setFormState({ ...formState, description: value })}
        minRows={3}
      />

      <div className="flex justify-end">
        <Button type="submit" color="primary" endContent={<Icon icon="lucide:send" />}>
          Submit Suggestion
        </Button>
      </div>
    </Form>
  );
}
