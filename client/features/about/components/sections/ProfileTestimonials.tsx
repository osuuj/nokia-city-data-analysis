'use client';

import { TestimonialCard } from '@/features/about/components/ui';
import { motion } from 'framer-motion';

type Testimonial = {
  content: string;
  name: string;
  title: string;
  avatarSrc?: string;
};

type ProfileTestimonialsProps = {
  testimonials: Testimonial[];
  title?: string;
  description?: string;
};

export function ProfileTestimonials({
  testimonials,
  title = 'Client Testimonials',
  description = 'What people say about working with me',
}: ProfileTestimonialsProps) {
  return (
    <section id="testimonials" className="py-24 bg-default-50/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative text-black dark:text-white">
            {title}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 h-1 bg-primary rounded"
            />
          </h2>
          <p className="text-default-600 max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-${testimonial.content.substring(0, 20)}`}
              content={testimonial.content}
              name={testimonial.name}
              title={testimonial.title}
              avatarSrc={testimonial.avatarSrc || '/images/team/default-avatar.svg'}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
